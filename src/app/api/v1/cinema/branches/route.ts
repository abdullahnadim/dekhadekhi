/**
 * GET /api/v1/cinema/branches
 *
 * Returns all Cineplex BD branch locations.
 * Cached for 1 hour (branches change rarely).
 */

import { NextResponse } from "next/server";
import { fetchCineplexLocations } from "@/services/cineplex/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const locations = await fetchCineplexLocations();

    const branches = locations.map((l) => {
      const addressClean = l.location.trim();
      const cityMatch = addressClean.match(/,\s*([A-Za-z]+)\s*-?\d*\s*$/);
      const city = cityMatch ? cityMatch[1] : "Dhaka";

      return {
        id: `cineplex-branch-${l.id}`,
        name: l.location_name,
        slug: `cineplex-${l.short_name.toLowerCase()}`,
        address: addressClean,
        cityId: city.toLowerCase(),
        lat: null,
        lng: null,
        phone: null,
        email: null,
        imageUrl: null,
        description: null,
        facilities: ["Dolby Digital", "Air Conditioning"],
        parking: false,
        isActive: true,
        city: { id: city.toLowerCase(), name: city, nameBn: null },
        _cineplexId: l.id,
        _shortName: l.short_name,
        _notice: l.notice,
      };
    });

    return NextResponse.json({
      success: true,
      data: branches,
      source: "cineplex-bd",
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cinema/branches] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch branches",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
