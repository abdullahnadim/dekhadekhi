/**
 * Cineplex BD API Client
 *
 * Communicates with the undocumented Cineplex BD internal API.
 * All requests go through our own Next.js API proxy to:
 * 1. Hide credentials from the client
 * 2. Enable server-side token caching
 * 3. Allow easy swapping if the API changes
 *
 * Base URL: https://cineplex-web-api.cineplexbd.com/api/v1
 */

import type {
  CineplexApiResponse,
  CineplexMovieListResponse,
  CineplexLocation,
  CineplexShowtimeLocation,
  CineplexMovieDetail,
} from "./types";

const CINEPLEX_API_BASE = "https://cineplex-web-api.cineplexbd.com/api/v1";

// ─── Token Management ─────────────────────────────────────

interface TokenCache {
  token: string;
  expiresAt: number;
}

// Server-side token cache (lives in module scope, shared across requests in the same process)
let tokenCache: TokenCache | null = null;

async function getAuthToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid (with 5-minute buffer)
  if (tokenCache && tokenCache.expiresAt > now + 5 * 60 * 1000) {
    return tokenCache.token;
  }

  // Generate a unique guest identity
  const guestId = `cinehub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const response = await fetch(`${CINEPLEX_API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user_id: guestId,
      email: `${guestId}@cinehubbd.com`,
      password: "CineHub2024!",
      device_id: guestId,
      device_type: "web",
    }),
    // No caching for auth requests
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Cineplex auth failed: ${response.status}`);
  }

  const data: CineplexApiResponse<string> = await response.json();

  if (data.status !== "success" || !data.data) {
    throw new Error(`Cineplex auth error: ${data.message}`);
  }

  // Token appears to be long-lived — cache for 2 hours
  tokenCache = {
    token: data.data,
    expiresAt: now + 2 * 60 * 60 * 1000,
  };

  return tokenCache.token;
}

// ─── Base Request ─────────────────────────────────────────

async function cineplexPost<T>(
  path: string,
  body: Record<string, unknown> = {}
): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(`${CINEPLEX_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    next: {
      // Cache responses for 5 minutes
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Cineplex API error: ${response.status} on ${path}`);
  }

  const data: CineplexApiResponse<T> = await response.json();

  if (data.status === "error") {
    // If 401, invalidate token and retry once
    if (data.code === 401) {
      tokenCache = null;
      return cineplexPost<T>(path, body);
    }
    throw new Error(`Cineplex API: ${data.message}`);
  }

  return data.data;
}

// ─── API Methods ──────────────────────────────────────────

/**
 * Get currently running and upcoming movies from Cineplex BD
 */
export async function fetchCineplexMovies(): Promise<CineplexMovieListResponse> {
  return cineplexPost<CineplexMovieListResponse>("/movie-list");
}

/**
 * Get all Cineplex BD branch locations
 */
export async function fetchCineplexLocations(): Promise<CineplexLocation[]> {
  return cineplexPost<CineplexLocation[]>("/location");
}

/**
 * Get showtimes for a specific movie on a specific date
 * @param movieId - The Cineplex internal movie_id
 * @param date - Date string in YYYY-MM-DD format
 */
export async function fetchCineplexShowtimes(
  movieId: number,
  date: string
): Promise<CineplexShowtimeLocation[]> {
  const result = await cineplexPost<CineplexShowtimeLocation[]>("/movie-show-time", {
    movie_id: movieId,
    date,
  });
  // API may return null/empty for no shows
  return Array.isArray(result) ? result : [];
}

/**
 * Search movies by title
 */
export async function searchCineplexMovies(
  query: string
): Promise<CineplexMovieDetail[]> {
  return cineplexPost<CineplexMovieDetail[]>("/movie-search-list", {
    search: query,
  });
}
