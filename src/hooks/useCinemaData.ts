/**
 * React Query hooks for cinema data
 * All hooks consume our internal API proxy — never call Cineplex BD directly from the client.
 */

import { useQuery } from "@tanstack/react-query";
import type { SeatMapData } from "@/types";

// ─── Types ────────────────────────────────────────────────

export interface CinemaMovie {
  id: string;
  title: string;
  titleBn: string | null;
  slug: string;
  synopsis: string;
  runtime: number;
  language: string;
  genre: string[];
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  rating: number | null;
  releaseDate: string;
  status: "NOW_SHOWING" | "UPCOMING";
  isActive: boolean;
  isFeatured: boolean;
  _cineplexId: number;
  _category: string; // "2D" | "3D" | "IMAX"
}

export interface CinemaBranch {
  id: string;
  name: string;
  slug: string;
  address: string;
  cityId: string;
  city: { id: string; name: string; nameBn: string | null };
  facilities: string[];
  parking: boolean;
  isActive: boolean;
  _cineplexId: number;
  _shortName: string;
  _notice: string | null;
}

export interface CinemaShowtime {
  id: string;
  movieId: string;
  hallId: string;
  hallType: string;
  startTime: string;
  endTime: string;
  language: string;
  status: string;
  priceStandard: number;
  pricePremium: number;
  priceVip: number;
  priceCouple: number;
  branch: {
    id: string;
    name: string;
    shortName: string;
  };
  availableSeats: number;
  totalSeats: number;
}

// ─── Fetchers ─────────────────────────────────────────────

async function fetchMovies(): Promise<{
  running: CinemaMovie[];
  upcoming: CinemaMovie[];
}> {
  const res = await fetch("/api/v1/cinema/movies");
  if (!res.ok) throw new Error(`Movies fetch failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch movies");

  // Normalize — ensure genre is always string[], not a raw string
  const normalize = (m: CinemaMovie): CinemaMovie => ({
    ...m,
    genre: Array.isArray(m.genre)
      ? m.genre
      : typeof m.genre === "string" && m.genre
      ? (m.genre as string).split(/[,\s]+/).map((g) => g.trim()).filter(Boolean)
      : [],
  });

  return {
    running: (json.data.running ?? []).map(normalize),
    upcoming: (json.data.upcoming ?? []).map(normalize),
  };
}

async function fetchBranches(): Promise<CinemaBranch[]> {
  const res = await fetch("/api/v1/cinema/branches");
  if (!res.ok) throw new Error(`Branches fetch failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch branches");
  return json.data;
}

async function fetchShowtimes(
  movieId: string,
  date: string
): Promise<CinemaShowtime[]> {
  const res = await fetch(
    `/api/v1/cinema/showtimes?movieId=${encodeURIComponent(movieId)}&date=${date}`
  );
  if (!res.ok) throw new Error(`Showtimes fetch failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch showtimes");
  return json.data;
}

async function fetchSeatMap(
  hallId: string,
  scheduleId: string
): Promise<SeatMapData> {
  const res = await fetch(
    `/api/v1/cinema/seats?hallId=${encodeURIComponent(hallId)}&scheduleId=${encodeURIComponent(scheduleId)}`
  );
  if (!res.ok) throw new Error(`Seat map fetch failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch seat map");
  return json.data;
}

// ─── Query Keys ───────────────────────────────────────────

export const cinemaQueryKeys = {
  all: ["cinema"] as const,
  movies: () => [...cinemaQueryKeys.all, "movies"] as const,
  branches: () => [...cinemaQueryKeys.all, "branches"] as const,
  showtimes: (movieId: string, date: string) =>
    [...cinemaQueryKeys.all, "showtimes", movieId, date] as const,
  seatMap: (hallId: string, scheduleId: string) =>
    [...cinemaQueryKeys.all, "seats", hallId, scheduleId] as const,
} as const;

// ─── Hooks ────────────────────────────────────────────────

/**
 * Fetches currently running and upcoming movies from Cineplex BD.
 * Stale after 5 minutes, refetches in background.
 */
export function useCinemaMovies() {
  return useQuery({
    queryKey: cinemaQueryKeys.movies(),
    queryFn: fetchMovies,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

/**
 * Fetches all Cineplex BD branch locations.
 * Stale after 1 hour.
 */
export function useCinemaBranches() {
  return useQuery({
    queryKey: cinemaQueryKeys.branches(),
    queryFn: fetchBranches,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: 3,
  });
}

/**
 * Fetches showtimes for a specific movie on a specific date.
 * @param movieId - Internal movie ID (e.g. "cineplex-1705")
 * @param date - ISO date string "YYYY-MM-DD"
 */
export function useCinemaShowtimes(
  movieId: string | null,
  date: string
) {
  return useQuery({
    queryKey: cinemaQueryKeys.showtimes(movieId ?? "", date),
    queryFn: () => fetchShowtimes(movieId!, date),
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Fetches the seat map for a specific hall and show.
 * Refetches every 30 seconds for live availability.
 */
export function useSeatMap(hallId: string | null, scheduleId: string | null) {
  return useQuery({
    queryKey: cinemaQueryKeys.seatMap(hallId ?? "", scheduleId ?? ""),
    queryFn: () => fetchSeatMap(hallId!, scheduleId!),
    enabled: !!hallId && !!scheduleId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Live updates every 30s
    retry: 2,
  });
}
