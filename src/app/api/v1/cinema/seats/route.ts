/**
 * GET /api/v1/cinema/seats?hallId=xxx&scheduleId=yyy
 *
 * Returns a seat map for a specific hall and schedule.
 * In production this would hit the Cineplex booking API.
 * Currently uses generated realistic seat maps since Cineplex BD's
 * seat availability is not available from their public API.
 */

import { NextResponse } from "next/server";
import { generateMockSeatMap } from "@/services/data-providers/mock-data";

// Seats update frequently — short revalidation
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hallId = searchParams.get("hallId");
  const scheduleId = searchParams.get("scheduleId");

  if (!hallId || !scheduleId) {
    return NextResponse.json(
      { success: false, error: "hallId and scheduleId are required" },
      { status: 400 }
    );
  }

  try {
    // Generate a deterministic occupancy based on schedule ID for consistency
    // In production: fetch real seat data from Cineplex BD booking system
    const hash = scheduleId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const occupancyRate = 0.2 + (hash % 60) / 100; // 20-80% occupancy

    const seatMap = generateMockSeatMap(hallId, scheduleId, occupancyRate);

    return NextResponse.json({
      success: true,
      data: seatMap,
      source: "generated", // Will be "cineplex-bd" when real API is available
      note: "Seat availability is simulated. Real-time data requires Cineplex BD booking system access.",
    });
  } catch (error) {
    console.error("[cinema/seats] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate seat map",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
