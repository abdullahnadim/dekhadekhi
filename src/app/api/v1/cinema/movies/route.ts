/**
 * GET /api/v1/cinema/movies
 *
 * Returns currently running and upcoming movies from Cineplex BD.
 * Cached for 5 minutes via Next.js revalidation.
 */

import { NextResponse } from "next/server";
import { fetchCineplexMovies } from "@/services/cineplex/client";

export const dynamic = 'force-dynamic';

function parseCineplexDate(dateStr: string): string {
  if (!dateStr || dateStr === "Coming Soon") return new Date().toISOString();
  // Cineplex format: DD-MM-YYYY
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

interface CinemaMovieDTO {
  id: string;
  title: string;
  titleBn: null;
  slug: string;
  synopsis: string;
  synopsisBn: null;
  runtime: number;
  language: string;
  subtitle: never[];
  genre: string[];
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  rating: number | null;
  imdbRating: null;
  imdbId: null;
  releaseDate: string;
  status: "NOW_SHOWING" | "UPCOMING";
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  _cineplexId: number;
  _category: string;
}

export async function GET() {
  try {
    const data = await fetchCineplexMovies();

    const mapMovie = (
      m: (typeof data.running)[0],
      status: "NOW_SHOWING" | "UPCOMING"
    ): CinemaMovieDTO => ({
      id: `cineplex-${m.movie_id}`,
      title: m.title,
      titleBn: null,
      slug: m.slug,
      synopsis: `${m.genre} film featuring ${m.actor}.`,
      synopsisBn: null,
      runtime: 0,
      language: m.language,
      subtitle: [],
      genre: m.genre ? m.genre.split(",").map((g) => g.trim()) : [],
      posterUrl: m.img || null,
      backdropUrl: m.img || null,
      trailerUrl: m.video || null,
      rating: m.rating,
      imdbRating: null,
      imdbId: null,
      releaseDate: parseCineplexDate(m.release),
      status,
      isActive: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _cineplexId: m.movie_id,
      _category: m.category,
    });

    const running = data.running.map((m) => mapMovie(m, "NOW_SHOWING"));
    const upcoming = data.upcoming.map((m) => mapMovie(m, "UPCOMING"));

    return NextResponse.json({
      success: true,
      data: { running, upcoming },
      source: "cineplex-bd",
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cinema/movies] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch movies",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
