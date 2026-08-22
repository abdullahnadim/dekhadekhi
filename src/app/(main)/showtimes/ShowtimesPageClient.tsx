"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Ticket,
  Film,
  RefreshCw,
  Wifi,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCinemaMovies, useCinemaShowtimes, type CinemaMovie } from "@/hooks/useCinemaData";

// ─── Helpers ──────────────────────────────────────────────

function getDays(count = 7): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAYS = getDays(7);

function formatDay(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() === today.getTime()) return "Today";
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-BD", { weekday: "short", day: "numeric" });
}

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getAvailabilityInfo(available: number, total: number) {
  const ratio = available / total;
  if (ratio < 0.15) return { text: "text-red-400", label: "Almost Full", dot: "bg-red-400" };
  if (ratio < 0.4) return { text: "text-yellow-400", label: "Filling Fast", dot: "bg-yellow-400" };
  return { text: "text-green-400", label: "Available", dot: "bg-green-400" };
}

// ─── Skeleton ─────────────────────────────────────────────

function MoviePillSkeleton() {
  return (
    <div className="flex-shrink-0 w-28 rounded-xl bg-white/5 animate-pulse">
      <div className="aspect-[2/3] rounded-t-xl bg-white/10" />
      <div className="p-2">
        <div className="h-3 bg-white/10 rounded w-3/4 mx-auto" />
      </div>
    </div>
  );
}

function ShowtimeRowSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 p-5 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-3 bg-white/5 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Table ────────────────────────────────────────

function PricingTable({ priceStandard, pricePremium, priceVip, priceCouple }: {
  priceStandard: number;
  pricePremium: number;
  priceVip: number;
  priceCouple: number;
}) {
  const tiers = [
    { label: "Standard", price: priceStandard, color: "text-white/60" },
    { label: "Premium", price: pricePremium, color: "text-[#7C3AED]" },
    { label: "VIP", price: priceVip, color: "text-[#D6A84D]" },
    { label: "Couple", price: priceCouple, color: "text-[#EC4899]" },
  ];
  return (
    <div className="flex items-center gap-3 flex-wrap mt-2">
      {tiers.map((t) => (
        <div key={t.label} className="flex items-center gap-1">
          <span className="text-white/30 text-[10px]">{t.label}</span>
          <span className={`text-xs font-semibold ${t.color}`}>৳{t.price}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Showtimes Panel ──────────────────────────────────────

function ShowtimesPanel({
  movie,
  date,
  onClose,
}: {
  movie: CinemaMovie;
  date: string;
  onClose: () => void;
}) {
  const { data: showtimes, isLoading, isError, refetch } = useCinemaShowtimes(movie.id, date);

  // Group by branch
  const byBranch = useMemo(() => {
    if (!showtimes) return [];
    const map = new Map<string, typeof showtimes>();
    for (const s of showtimes) {
      const key = s.branch.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries()).map(([name, slots]) => ({ name, slots }));
  }, [showtimes]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mt-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#FF3B30]" />
            <span className="text-white font-medium text-sm">Showtimes for {new Date(date).toLocaleDateString("en-BD", { weekday: "long", day: "numeric", month: "short" })}</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white text-xs transition-colors p-2 -mr-2 rounded-lg hover:bg-white/5 touch-manipulation"
          >
            ✕
          </button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <ShowtimeRowSkeleton key={i} />)}
          </div>
        )}

        {isError && (
          <div className="text-center py-6">
            <p className="text-white/40 text-sm mb-3">Failed to load showtimes</p>
            <Button onClick={() => refetch()} variant="ghost" size="sm" className="text-white/50 gap-2">
              <RefreshCw className="w-3 h-3" /> Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && byBranch.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-white/40 text-sm">No shows scheduled for this date</p>
            <p className="text-white/20 text-xs mt-1">Try selecting a different date</p>
          </div>
        )}

        {!isLoading && !isError && byBranch.length > 0 && (
          <div className="space-y-5">
            {byBranch.map(({ name, slots }) => {
              const avail = getAvailabilityInfo(slots[0].availableSeats, slots[0].totalSeats);
              return (
                <div key={name}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-white/60 text-xs font-medium">{name}</span>
                    <span className={`text-[10px] flex items-center gap-1 ${avail.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${avail.dot} inline-block`} />
                      {avail.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {slots.map((s) => (
                      <div key={s.id} className="flex flex-col">
                        <Link
                          href={`/book/${s.id}/seats`}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF3B30]/50 hover:bg-[#FF3B30]/8 active:scale-95 transition-all cursor-pointer group"
                        >
                          <Clock className="w-3.5 h-3.5 text-white/30 group-hover:text-[#FF3B30]/70 transition-colors" />
                          <span className="text-white text-sm font-medium">
                            {formatTime(s.startTime)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-white/5 text-white/40">
                            {s.hallType}
                          </span>
                          <span className="text-[10px] text-[#FF3B30]/60 hidden group-hover:inline ml-1">
                            View Seats →
                          </span>
                        </Link>
                        <PricingTable
                          priceStandard={s.priceStandard}
                          pricePremium={s.pricePremium}
                          priceVip={s.priceVip}
                          priceCouple={s.priceCouple}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────

export function ShowtimesPageClient() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"running" | "upcoming">("running");

  const selectedDate = toISODate(DAYS[selectedDay]);

  const { data: moviesData, isLoading: moviesLoading, isError: moviesError, refetch: refetchMovies, isFetching } = useCinemaMovies();

  const displayedMovies = useMemo(() => {
    if (!moviesData) return [];
    return statusFilter === "running" ? moviesData.running : moviesData.upcoming;
  }, [moviesData, statusFilter]);

  return (
    <div className="min-h-screen bg-[#0B0B0E] ">
      {/* Hero Header */}
      <div className="border-b border-white/5 bg-gradient-to-b from-[#0F0F12] to-[#0B0B0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">
                Showtimes
              </h1>
              <p className="text-white/40 text-sm">
                Live schedules from Star Cineplex BD
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!moviesLoading && !moviesError && (
                <div className="flex items-center gap-1.5 text-[#2ECC71] text-xs">
                  <Wifi className="w-3 h-3" />
                  <span className="hidden sm:inline">Live data</span>
                </div>
              )}
              <button
                onClick={() => refetchMovies()}
                disabled={isFetching}
                className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDay((d) => Math.max(0, d - 1))}
              disabled={selectedDay === 0}
              className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all disabled:opacity-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
              {DAYS.map((day, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedDay(i); setSelectedMovieId(null); }}
                  className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedDay === i
                      ? "bg-[#FF3B30] text-white shadow-lg shadow-red-500/20"
                      : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-[10px] opacity-70 uppercase tracking-wide">
                    {formatDay(day) === "Today" || formatDay(day) === "Tomorrow"
                      ? ""
                      : day.toLocaleDateString("en-BD", { weekday: "short" })}
                  </span>
                  <span>{formatDay(day) === "Today" ? "Today" : formatDay(day) === "Tomorrow" ? "Tomorrow" : day.getDate()}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedDay((d) => Math.min(DAYS.length - 1, d + 1))}
              disabled={selectedDay === DAYS.length - 1}
              className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all disabled:opacity-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Filter */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-white/20" />
          {(["running", "upcoming"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setSelectedMovieId(null); }}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === s
                  ? "bg-[#FF3B30] text-white"
                  : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              {s === "running" ? "Now Showing" : "Upcoming"}
            </button>
          ))}
          {moviesData && (
            <span className="text-white/20 text-xs ml-2">
              {displayedMovies.length} movies
            </span>
          )}
        </div>

        {/* Movie Horizontal Scroll */}
        <div className="mb-8">
          <h2 className="text-white/40 text-xs uppercase tracking-wider mb-4">
            Select a Movie
          </h2>

          {moviesLoading && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {Array.from({ length: 6 }).map((_, i) => <MoviePillSkeleton key={i} />)}
            </div>
          )}

          {moviesError && (
            <div className="flex items-center gap-3 py-6 text-white/40">
              <span className="text-sm">Failed to load movies</span>
              <Button onClick={() => refetchMovies()} variant="ghost" size="sm" className="gap-2">
                <RefreshCw className="w-3 h-3" /> Retry
              </Button>
            </div>
          )}

          {!moviesLoading && !moviesError && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {displayedMovies.map((movie) => (
                <motion.button
                  key={movie.id}
                  onClick={() =>
                    setSelectedMovieId((prev) => prev === movie.id ? null : movie.id)
                  }
                  whileTap={{ scale: 0.97 }}
                  className={`flex-shrink-0 w-28 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedMovieId === movie.id
                      ? "border-[#FF3B30] shadow-lg shadow-red-500/20"
                      : "border-transparent hover:border-white/20"
                  }`}
                >
                  {/* Poster */}
                  <div className="relative aspect-[2/3] bg-[#151518]">
                    {movie.posterUrl ? (
                      <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-8 h-8 text-white/10" />
                      </div>
                    )}
                    {/* Category badge */}
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/70 text-white">
                      {movie._category}
                    </span>
                    {selectedMovieId === movie.id && (
                      <div className="absolute inset-0 bg-[#FF3B30]/20" />
                    )}
                  </div>
                  <div className={`px-2 py-2 text-left transition-colors ${selectedMovieId === movie.id ? "bg-[#FF3B30]/10" : "bg-white/5"}`}>
                    <p className="text-white text-[10px] font-medium leading-tight line-clamp-2">
                      {movie.title}
                    </p>
                    <p className="text-white/30 text-[9px] mt-0.5">{movie.language}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Showtimes Panel */}
        <AnimatePresence mode="wait">
          {selectedMovieId && (
            <ShowtimesPanel
              key={`${selectedMovieId}-${selectedDate}`}
              movie={displayedMovies.find((m) => m.id === selectedMovieId)!}
              date={selectedDate}
              onClose={() => setSelectedMovieId(null)}
            />
          )}
        </AnimatePresence>

        {/* Prompt if no movie selected */}
        {!selectedMovieId && !moviesLoading && !moviesError && displayedMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-white/20"
          >
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a movie above to see available showtimes</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
