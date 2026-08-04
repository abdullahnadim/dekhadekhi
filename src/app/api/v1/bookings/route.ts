import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  acquireSeatLock,
  releaseAllSeatLocks,
  SEAT_LOCK_TTL,
} from "@/lib/redis";
import { z } from "zod";
import type { ApiResponse } from "@/types";

// POST /api/v1/bookings/create
// Creates a booking + acquires seat locks atomically

const CreateBookingSchema = z.object({
  scheduleId: z.string().min(1),
  seatIds: z.array(z.string()).min(1).max(8),
  foodItems: z
    .array(
      z.object({
        foodItemId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .optional()
    .default([]),
  couponCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = CreateBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { scheduleId, seatIds, foodItems, couponCode } = parsed.data;
    const userId = session.user.id;

    // 1. Verify schedule exists and has capacity
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId, status: "AVAILABLE" },
      include: { hall: { include: { seats: true } } },
    });

    if (!schedule) {
      return NextResponse.json(
        { success: false, error: "Show not available" },
        { status: 404 }
      );
    }

    // 2. Verify all seats belong to this hall
    const hallSeatIds = schedule.hall.seats.map((s) => s.id);
    const invalidSeats = seatIds.filter((id) => !hallSeatIds.includes(id));
    if (invalidSeats.length > 0) {
      return NextResponse.json(
        { success: false, error: "Invalid seat selection" },
        { status: 400 }
      );
    }

    // 3. Acquire Redis seat locks (atomic, 10-min TTL)
    const lockResults = await Promise.all(
      seatIds.map((seatId) =>
        acquireSeatLock(scheduleId, seatId, userId)
      )
    );

    const failedLocks = seatIds.filter((_, i) => !lockResults[i]);
    if (failedLocks.length > 0) {
      // Release any locks we acquired
      const acquiredSeats = seatIds.filter((_, i) => lockResults[i]);
      await releaseAllSeatLocks(scheduleId, acquiredSeats, userId);

      return NextResponse.json(
        {
          success: false,
          error: "Some seats are no longer available. Please try different seats.",
        },
        { status: 409 }
      );
    }

    // 4. Calculate pricing
    const seats = await prisma.seat.findMany({
      where: { id: { in: seatIds } },
    });

    const seatPrices: Record<string, number> = {
      STANDARD: Number(schedule.priceStandard),
      PREMIUM: Number(schedule.pricePremium),
      VIP: Number(schedule.priceVip),
      COUPLE: Number(schedule.priceCouple),
      ACCESSIBLE: Number(schedule.priceStandard),
    };

    let totalAmount = seats.reduce(
      (sum, seat) => sum + (seatPrices[seat.type] || seatPrices.STANDARD),
      0
    );

    // 5. Apply coupon if provided
    let appliedCoupon = null;
    let couponDiscount = 0;
    if (couponCode) {
      appliedCoupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          validFrom: { lte: new Date() },
          validTo: { gte: new Date() },
        },
      });

      if (appliedCoupon) {
        if (appliedCoupon.type === "PERCENTAGE") {
          couponDiscount = (totalAmount * Number(appliedCoupon.discountValue)) / 100;
          if (appliedCoupon.maxDiscount) {
            couponDiscount = Math.min(couponDiscount, Number(appliedCoupon.maxDiscount));
          }
        } else if (appliedCoupon.type === "FIXED_AMOUNT") {
          couponDiscount = Number(appliedCoupon.discountValue);
        }
        totalAmount = Math.max(0, totalAmount - couponDiscount);
      }
    }

    // 6. Add food items cost
    let foodTotal = 0;
    const foodDetails: Array<{ item: { id: string; price: number }; quantity: number }> = [];
    if (foodItems.length > 0) {
      const foodItemRecords = await prisma.foodItem.findMany({
        where: { id: { in: foodItems.map((f) => f.foodItemId) }, isAvailable: true },
      });

      for (const fi of foodItems) {
        const item = foodItemRecords.find((f) => f.id === fi.foodItemId);
        if (item) {
          const itemTotal = Number(item.price) * fi.quantity;
          foodTotal += itemTotal;
          foodDetails.push({ item: { id: item.id, price: Number(item.price) }, quantity: fi.quantity });
        }
      }
      totalAmount += foodTotal;
    }

    // 7. Add convenience fee (2%)
    const convenienceFee = Math.round(totalAmount * 0.02);
    totalAmount += convenienceFee;

    // 8. Create booking in a transaction
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          userId,
          scheduleId,
          status: "PENDING",
          totalAmount,
          expiresAt,
          tickets: {
            create: seats.map((seat) => ({
              seatId: seat.id,
              price: seatPrices[seat.type] || seatPrices.STANDARD,
            })),
          },
          ...(foodDetails.length > 0 && {
            foodItems: {
              create: foodDetails.map((fd) => ({
                foodItemId: fd.item.id,
                quantity: fd.quantity,
                price: fd.item.price * fd.quantity,
              })),
            },
          }),
          ...(appliedCoupon && {
            coupons: {
              create: {
                couponId: appliedCoupon.id,
                discount: couponDiscount,
              },
            },
          }),
        },
        include: { tickets: true },
      });

      // Increment coupon usage
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newBooking;
    });

    const response: ApiResponse<{ bookingId: string; expiresAt: Date; totalAmount: number }> = {
      success: true,
      data: {
        bookingId: booking.id,
        expiresAt: booking.expiresAt,
        totalAmount: Number(booking.totalAmount),
      },
      message: "Booking created successfully. Complete payment within 15 minutes.",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// GET /api/v1/bookings — Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const where = {
      userId: session.user.id,
      ...(status ? { status: status as "PENDING" | "CONFIRMED" | "CANCELLED" } : {}),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          schedule: {
            include: {
              movie: true,
              hall: { include: { branch: true } },
            },
          },
          tickets: { include: { seat: true } },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
