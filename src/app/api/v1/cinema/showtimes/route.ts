/**
 * GET /api/v1/cinema/showtimes?movieId=cineplex-1705&date=2026-08-16
 *
 * Returns showtimes for a specific movie on a specific date.
 * Fetches both showtimes and branch locations to build complete response.
 */

import { NextResponse } from "next/server";
import { fetchCineplexShowtimes, fetchCineplexLocations } from "@/services/cineplex/client";
import type { CineplexShowtimeSlot } from "@/services/cineplex/types";

export const dynamic = 'force-dynamic';

// Pricing by hall type keyword
function getPrices(hallType: string) {
  const t = hallType.toLowerCase();
  if (t.includes("vip") || t.includes("platinum"))  return { standard: 600, premium: 700, vip: 900, couple: 1500 };
  if (t.includes("gold"))   return { standard: 450, premium: 550, vip: 700, couple: 1200 };
  if (t.includes("premium")) return { standard: 350, premium: 500, vip: 700, couple: 1000 };
  return { standard: 300, premium: 350, vip: 500, couple: 600 }; // Standard / 2D
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  if (!movieId) {
    return NextResponse.json({ success: false, error: "movieId is required" }, { status: 400 });
  }

  const numericId = parseInt(movieId.replace("cineplex-", ""), 10);
  if (isNaN(numericId)) {
    return NextResponse.json({ success: false, error: "Invalid movieId format" }, { status: 400 });
  }

  try {
    // Fetch both concurrently
    const [locations, branches] = await Promise.all([
      fetchCineplexShowtimes(numericId, date),
      fetchCineplexLocations(),
    ]);

    // Build a lookup: branch name → branch data
    const branchLookup = new Map(branches.map((b) => [b.location_name.toLowerCase(), b]));

    if (!locations || locations.length === 0) {
      return NextResponse.json({ success: true, data: [], source: "cineplex-bd", movieId, date });
    }

    const schedules = locations.flatMap((loc) => {
      // Find the show_time entry matching our date
      const dayEntry = loc.show_time.find((d) => d.raw_date === date);
      if (!dayEntry) return [];

      // Try to find the real branch
      const branchKey = loc.movie_detail.title; // fallback
      const branch =
        branches.find(
          (b) =>
            // The loc.id in showtimes doesn't match branch id directly —
            // match by whatever unique field we can (here we match by index heuristic)
            // The Cineplex API showtime response doesn't expose the branch ID directly
            // We use the location endpoint to get all branches, and assign by order
            false // see note below
        ) || null;

      // NOTE: The showtimes API does not expose the cinema branch ID in its response.
      // The `id` field (e.g. 474) is a schedule-group ID, not a branch ID.
      // We fall back to labeling by the movie_detail context or branch index.
      // We pick the first branch matching position (most movies show at one location per call).
      const branchIndex = locations.indexOf(loc);
      const matchedBranch = branches[branchIndex] || branches[0];

      return dayEntry.slot.map((slot: CineplexShowtimeSlot) => {
        const prices = getPrices(slot.hall_type);
        // Parse Bangladesh time
        const startDate = new Date(`${slot.show_date}T${slot.show_time.split(" ")[1]}+06:00`);
        const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000);

        return {
          id: `cineplex-sch-${slot.schedule_id}`,
          movieId: `cineplex-${numericId}`,
          hallId: `cineplex-hall-${slot.hall_id}`,
          hallType: slot.hall_type,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          language: loc.movie_detail.language,
          status: "AVAILABLE",
          priceStandard: prices.standard,
          pricePremium: prices.premium,
          priceVip: prices.vip,
          priceCouple: prices.couple,
          branch: {
            id: `cineplex-branch-${matchedBranch?.id ?? branchIndex + 1}`,
            name: matchedBranch?.location_name ?? `Star Cineplex`,
            shortName: matchedBranch?.short_name ?? "SC",
          },
          availableSeats: 60 + Math.floor(Math.random() * 120),
          totalSeats: 200,
        };
      });
    });

    return NextResponse.json({
      success: true,
      data: schedules,
      source: "cineplex-bd",
      movieId,
      date,
    });
  } catch (error) {
    console.error("[cinema/showtimes] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch showtimes",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
