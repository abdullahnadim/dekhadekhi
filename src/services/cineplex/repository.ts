/**
 * Cinema Data Repository
 *
 * Provider-agnostic interface that the UI layer consumes.
 * Transforms raw Cineplex BD API data into our internal domain types.
 * Decoupled from the data source — can swap Cineplex BD for any other provider.
 */

import type { Movie, Branch, Schedule, SeatMapData, ScheduleWithDetails } from "@/types";
import {
  fetchCineplexMovies,
  fetchCineplexLocations,
  fetchCineplexShowtimes,
} from "./client";
import type { CineplexMovie, CineplexLocation, CineplexShowtimeLocation } from "./types";

// ─── Transform Helpers ────────────────────────────────────

function parseCineplexDate(dateStr: string): Date {
  if (!dateStr || dateStr === "Coming Soon") return new Date();
  // Cineplex uses DD-MM-YYYY format
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  return new Date(dateStr);
}

function cineplexMovieToDomain(m: CineplexMovie): Movie {
  return {
    id: `cineplex-${m.movie_id}`,
    title: m.title,
    titleBn: null,
    slug: m.slug,
    synopsis: `${m.genre} film featuring ${m.actor}.`,
    synopsisBn: null,
    runtime: 0, // Not provided by list endpoint
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
    status: "NOW_SHOWING",
    isActive: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    // Extra fields for display
    _cineplexId: m.movie_id,
    _category: m.category, // "2D" | "3D" | "IMAX"
  } as Movie & { _cineplexId: number; _category: string };
}

function cineplexLocationToDomain(l: CineplexLocation): Branch {
  // Strip HTML from location_detail
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
    // Extra
    _cineplexId: l.id,
    _shortName: l.short_name,
  } as Branch & { _cineplexId: number; _shortName: string };
}

function cineplexShowtimesToSchedules(
  movieId: number,
  movieTitle: string,
  date: string,
  showtimes: CineplexShowtimeLocation[]
): ScheduleWithDetails[] {
  const schedules: ScheduleWithDetails[] = [];

  for (const location of showtimes) {
    // New structure: location has show_time[] array of days, each with slot[]
    const dayEntry = location.show_time.find((d) => d.raw_date === date);
    if (!dayEntry) continue;

    for (const slot of dayEntry.slot) {
      // show_time is "2026-08-16 17:30:00"
      const startDate = new Date(slot.show_time.replace(" ", "T") + "+06:00");
      const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000);

      const scheduleId = `cineplex-sch-${slot.schedule_id}`;

      schedules.push({
        id: scheduleId,
        movieId: `cineplex-${movieId}`,
        hallId: `cineplex-hall-${slot.hall_id}`,
        startTime: startDate,
        endTime: endDate,
        language: location.movie_detail.language || "English",
        subtitle: null,
        status: "AVAILABLE",
        priceStandard: 350,
        pricePremium: 500,
        priceVip: 700,
        priceCouple: 1200,
        movie: {
          id: `cineplex-${movieId}`,
          title: movieTitle,
          titleBn: null,
          slug: "",
          synopsis: "",
          synopsisBn: null,
          runtime: 0,
          language: location.movie_detail.language || "English",
          subtitle: [],
          genre: [],
          posterUrl: null,
          backdropUrl: null,
          trailerUrl: null,
          rating: null,
          imdbRating: null,
          imdbId: null,
          releaseDate: new Date(date),
          status: "NOW_SHOWING",
          isActive: true,
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        hall: {
          id: `cineplex-hall-${slot.hall_id}`,
          branchId: `cineplex-branch-${location.id}`,
          name: slot.hall_type || "Main Hall",
          capacity: 200,
          facilities: [slot.hall_type || "2D"],
          imageUrl: null,
          isActive: true,
          branch: {
            id: `cineplex-branch-${location.id}`,
            name: `Star Cineplex`,
            slug: `cineplex-branch-${location.id}`,
            address: `Star Cineplex`,
            cityId: "dhaka",
            lat: null,
            lng: null,
            phone: null,
            email: null,
            imageUrl: null,
            description: null,
            facilities: [],
            parking: false,
            isActive: true,
            city: { id: "dhaka", name: "Dhaka", nameBn: "ঢাকা" },
          },
        },
        availableSeats: Math.floor(Math.random() * 80) + 20,
        totalSeats: 200,
      });
    }
  }

  return schedules;
}

// ─── Repository Interface ─────────────────────────────────

export interface ICinemaRepository {
  getRunningMovies(): Promise<Movie[]>;
  getUpcomingMovies(): Promise<Movie[]>;
  getBranches(): Promise<Branch[]>;
  getShowtimes(movieId: string, date: string): Promise<ScheduleWithDetails[]>;
  getSeatMap(hallId: string, scheduleId: string): Promise<SeatMapData>;
}

// ─── Cineplex BD Repository Implementation ─────────────────

export class CineplexRepository implements ICinemaRepository {
  async getRunningMovies(): Promise<Movie[]> {
    const data = await fetchCineplexMovies();
    return data.running.map(cineplexMovieToDomain);
  }

  async getUpcomingMovies(): Promise<Movie[]> {
    const data = await fetchCineplexMovies();
    return data.upcoming.map((m) => ({
      ...cineplexMovieToDomain(m),
      status: "UPCOMING" as const,
    }));
  }

  async getBranches(): Promise<Branch[]> {
    const locations = await fetchCineplexLocations();
    return locations.map(cineplexLocationToDomain);
  }

  async getShowtimes(
    movieId: string,
    date: string
  ): Promise<ScheduleWithDetails[]> {
    // Extract the numeric Cineplex ID from our internal ID
    const numericId = parseInt(movieId.replace("cineplex-", ""), 10);
    if (isNaN(numericId)) return [];

    const showtimes = await fetchCineplexShowtimes(numericId, date);
    const movies = await fetchCineplexMovies();
    const movie = movies.running.find((m) => m.movie_id === numericId);
    const title = movie?.title || "Movie";

    return cineplexShowtimesToSchedules(numericId, title, date, showtimes);
  }

  async getSeatMap(hallId: string, scheduleId: string): Promise<SeatMapData> {
    // Seat map data is not available from Cineplex BD's public API.
    // The actual seat map is rendered inside their booking system (ticket.cineplexbd.com).
    // We generate a realistic seat map based on hall configuration.
    const { generateMockSeatMap } = await import(
      "@/services/data-providers/mock-data"
    );
    return generateMockSeatMap(hallId, scheduleId, 0.35);
  }
}

// ─── Singleton Instance ───────────────────────────────────

export const cinemaRepository: ICinemaRepository = new CineplexRepository();
