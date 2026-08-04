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
  Users,
  Filter,
  Film,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_SCHEDULES,
  MOCK_MOVIES,
  MOCK_BRANCHES,
  generateMockSeatMap,
} from "@/services/data-providers/mock-data";

// Build date range for the next 7 days
function getDays(count = 7) {
  const days = [];
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

function formatDay(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() === today.getTime()) return "Today";
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-BD", { weekday: "short", day: "numeric" });
}

// Availability color coding
function getAvailabilityColor(occupancy: number) {
  if (occupancy > 0.8) return { text: "text-red-400", bg: "bg-red-950/40", label: "Filling Fast" };
  if (occupancy > 0.5) return { text: "text-yellow-400", bg: "bg-yellow-950/40", label: "Available" };
  return { text: "text-green-400", bg: "bg-green-950/40", label: "Available" };
}

export function ShowtimesPageClient() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMovieId, setSelectedMovieId] = useState<string>("all");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const selectedDate = DAYS[selectedDay];

  // Filter schedules for selected day
  const todaySchedules = useMemo(() => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    return MOCK_SCHEDULES.filter((s) => {
      const d = new Date(s.startTime);
      if (d < selectedDate || d >= nextDay) return false;
      if (selectedMovieId !== "all" && s.movieId !== selectedMovieId) return false;
      if (selectedLanguage !== "all" && s.language !== selectedLanguage) return false;
      return true;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [selectedDate, selectedMovieId, selectedBranchId, selectedLanguage]);

  // Group by movie
  const schedulesByMovie = useMemo(() => {
    const map = new Map<string, typeof todaySchedules>();
    todaySchedules.forEach((s) => {
      const list = map.get(s.movieId) || [];
      list.push(s);
      map.set(s.movieId, list);
    });
    return map;
  }, [todaySchedules]);

  // Unique movies in today's schedule
  const moviesInSchedule = useMemo(() => {
    const ids = new Set(todaySchedules.map((s) => s.movieId));
    return MOCK_MOVIES.filter((m) => ids.has(m.id));
  }, [todaySchedules]);

  const languages = useMemo(() => {
    const langs = new Set(todaySchedules.map((s) => s.language));
    return Array.from(langs);
  }, [todaySchedules]);

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0B0B0E]/90 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Date Picker */}
          <div className="py-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                disabled={selectedDay === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {DAYS.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl transition-all ${
                    selectedDay === i
                      ? "bg-[#FF3B30] text-white shadow-lg shadow-red-500/20"
                      : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-xs font-semibold">{formatDay(day)}</span>
                  <span className="text-xs opacity-70">
                    {day.toLocaleDateString("en-BD", { month: "short", day: "numeric" })}
                  </span>
                </button>
              ))}
              <button
                onClick={() => setSelectedDay(Math.min(DAYS.length - 1, selectedDay + 1))}
                className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                disabled={selectedDay === DAYS.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 pb-4 overflow-x-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                showFilters
                  ? "bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* Movie Quick Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedMovieId("all")}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  selectedMovieId === "all"
                    ? "bg-white/15 text-white"
                    : "bg-white/5 text-white/40 hover:text-white"
                }`}
              >
                All Movies
              </button>
              {moviesInSchedule.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => setSelectedMovieId(movie.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all truncate max-w-40 ${
                    selectedMovieId === movie.id
                      ? "bg-[#FF3B30] text-white"
                      : "bg-white/5 text-white/40 hover:text-white"
                  }`}
                >
                  {movie.title}
                </button>
              ))}
            </div>

            {/* Language Filter */}
            {languages.length > 1 && (
              <div className="flex items-center gap-1 border-l border-white/10 pl-3">
                {["all", ...languages].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedLanguage === lang
                        ? "bg-[#D6A84D] text-black"
                        : "bg-white/5 text-white/40 hover:text-white"
                    }`}
                  >
                    {lang === "all" ? "All Lang" : lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Showtimes Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {schedulesByMovie.size === 0 ? (
          <div className="text-center py-24">
            <Film className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-white/60 text-lg font-semibold mb-2">
              No showtimes available
            </h3>
            <p className="text-white/30 text-sm">
              Try a different date or remove filters
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(schedulesByMovie.entries()).map(([movieId, schedules]) => {
              const movie = MOCK_MOVIES.find((m) => m.id === movieId);
              if (!movie) return null;

              return (
                <motion.div
                  key={movieId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-[#151518] border border-white/5 overflow-hidden"
                >
                  {/* Movie Header */}
                  <div className="flex items-start gap-4 p-5 border-b border-white/5">
                    <div className="relative w-16 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={movie.posterUrl || "/placeholder.jpg"}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/movies/${movie.slug}`}>
                        <h2 className="text-white font-semibold text-lg hover:text-[#FF3B30] transition-colors line-clamp-1">
                          {movie.title}
                        </h2>
                      </Link>
                      {movie.titleBn && (
                        <p className="text-[#D6A84D] text-sm mb-2">{movie.titleBn}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                        <span>{movie.language}</span>
                        {movie.runtime > 0 && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                            </span>
                          </>
                        )}
                        {movie.genre.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded-md bg-white/5"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Showtimes Grid — all halls */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-[#FF3B30]" />
                      <span className="text-white/60 text-sm font-medium">
                        {MOCK_BRANCHES[0]?.name}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {schedules.map((schedule) => {
                        // Generate seat availability for each schedule
                        const seatMap = generateMockSeatMap("hall-1", schedule.id, 0.45);
                        const totalSeats = seatMap.rows.reduce(
                          (sum, row) => sum + row.seats.length,
                          0
                        );
                        const occupiedSeats = seatMap.rows.reduce(
                          (sum, row) =>
                            sum +
                            row.seats.filter((s) => s.status === "OCCUPIED").length,
                          0
                        );
                        const occupancy = occupiedSeats / totalSeats;
                        const availableCount = totalSeats - occupiedSeats;
                        const avail = getAvailabilityColor(occupancy);

                        return (
                          <Link
                            key={schedule.id}
                            href={`/book/${schedule.id}/seats`}
                          >
                            <motion.div
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className="relative group cursor-pointer"
                            >
                              <div className="px-4 py-3 rounded-xl border border-white/10 hover:border-[#FF3B30]/50 hover:bg-[#FF3B30]/5 transition-all min-w-[120px]">
                                {/* Time */}
                                <div className="text-white font-bold text-lg">
                                  {new Date(schedule.startTime).toLocaleTimeString(
                                    "en-BD",
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </div>

                                {/* Language */}
                                <div className="text-white/40 text-xs mt-0.5">
                                  {schedule.language}
                                  {schedule.subtitle && ` · ${schedule.subtitle}`}
                                </div>

                                {/* Price */}
                                <div className="text-[#D6A84D] text-xs font-semibold mt-1">
                                  ৳{schedule.priceStandard}+
                                </div>

                                {/* Availability Badge */}
                                <div className={`flex items-center gap-1 mt-2 px-1.5 py-0.5 rounded-md ${avail.bg} w-fit`}>
                                  <Users className={`w-2.5 h-2.5 ${avail.text}`} />
                                  <span className={`text-[10px] font-medium ${avail.text}`}>
                                    {availableCount} seats
                                  </span>
                                </div>

                                {/* Hover Book Button */}
                                <div className="absolute inset-0 bg-[#FF3B30]/90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="text-white text-center">
                                    <Ticket className="w-5 h-5 mx-auto mb-1" />
                                    <span className="text-xs font-bold">Book Now</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
