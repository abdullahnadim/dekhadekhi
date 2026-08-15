/**
 * Bookings API — Stubbed for current milestone
 *
 * Booking functionality is not implemented in the Movie Browsing milestone.
 * This stub prevents build errors from Prisma requiring a database adapter.
 * Full booking implementation comes in a future milestone.
 */
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Booking is not available yet",
      message: "Seat booking will be enabled in a future release. Currently you can browse movies and view seat availability.",
    },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Booking is not available yet",
    },
    { status: 501 }
  );
}
