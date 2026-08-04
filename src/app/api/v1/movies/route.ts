import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, PaginatedResponse, Movie } from "@/types";
import {
  MOCK_MOVIES,
  getNowShowingMovies,
  getUpcomingMovies,
  searchMovies,
} from "@/services/data-providers/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const genre = searchParams.get("genre");
    const language = searchParams.get("language");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let movies = MOCK_MOVIES.filter((m) => m.isActive);

    // Filter by status
    if (status === "now_showing") {
      movies = getNowShowingMovies();
    } else if (status === "upcoming") {
      movies = getUpcomingMovies();
    }

    // Filter by search
    if (search) {
      movies = searchMovies(search);
    }

    // Filter by genre
    if (genre) {
      movies = movies.filter((m) =>
        m.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    // Filter by language
    if (language) {
      movies = movies.filter(
        (m) => m.language.toLowerCase() === language.toLowerCase()
      );
    }

    // Filter by featured
    if (featured === "true") {
      movies = movies.filter((m) => m.isFeatured);
    }

    // Pagination
    const total = movies.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedMovies = movies.slice(offset, offset + limit);

    const response: PaginatedResponse<Movie> = {
      success: true,
      data: paginatedMovies,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Movies API error:", error);
    const errorResponse: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch movies",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
