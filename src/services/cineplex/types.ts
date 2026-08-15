/**
 * CineplexBD Provider Types
 * Raw API response shapes from cineplex-web-api.cineplexbd.com
 * Updated to match actual API responses.
 */

export interface CineplexApiResponse<T> {
  status: "success" | "error";
  code: number;
  data: T;
  message: string;
}

// ─── Movie Types ──────────────────────────────────────────

export interface CineplexMovie {
  id: number;
  slug: string;
  movie_id: number;
  title: string;
  img: string;
  video: string | null;
  rating: number | null;
  category: string; // "2D" | "3D" | "IMAX"
  actor: string;
  genre: string;
  release: string; // "DD-MM-YYYY" or "Coming Soon"
  language: string;
  length?: string | null;
}

export interface CineplexMovieListResponse {
  running: CineplexMovie[];
  upcoming: CineplexMovie[];
}

// ─── Location/Branch Types ─────────────────────────────────

export interface CineplexLocation {
  id: number;
  location_name: string;
  short_name: string;
  location_detail: string; // HTML string
  notice: string | null;
  location: string; // plain text address
}

// ─── Showtime Types (Real API structure) ─────────────────

export interface CineplexShowtimeSlot {
  time: string;          // "05:30 PM"
  hall: number;          // hall number
  hall_color: string;    // "#ffd564"
  hall_id: number;       // internal hall ID
  hall_type: string;     // "Premium" | "Standard" | "VIP"
  show_date: string;     // "2026-08-16"
  show_time: string;     // "2026-08-16 17:30:00"
  showtime_id: number;
  schedule_id: number;
  profile_id: number;
}

export interface CineplexShowtimeDay {
  date: string;          // "16th , August 2026"
  raw_date: string;      // "2026-08-16"
  date_name: string;     // "Sunday"
  slot: CineplexShowtimeSlot[];
}

export interface CineplexShowtimeLocation {
  id: number;
  movie_id: number;
  movie_detail: {
    title: string;
    slug: string;
    length: string | null;
    img: string;
    video: string | null;
    rating: number | null;
    category: string;
    actor: string;
    genre: string;
    release: string;
    language: string;
  };
  show_time: CineplexShowtimeDay[];
}

// ─── Movie Detail Types ────────────────────────────────────

export interface CineplexMovieDetail {
  id: number;
  slug: string;
  movie_id: number;
  title: string;
  img: string;
  video: string | null;
  rating: number | null;
  category: string;
  actor: string;
  genre: string;
  release: string;
  language: string;
  length: string;
  synopsis?: string;
}
