"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Star,
  Clock,
  Calendar,
  Globe,
  Subtitles,
  Ticket,
  Heart,
  Share2,
  ChevronDown,
  X,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieCard } from "@/components/movies/MovieCard";
import type { Movie } from "@/types";
import {
  getSchedulesForMovie,
  MOCK_MOVIES,
  MOCK_BRANCHES,
} from "@/services/data-providers/mock-data";

interface MovieDetailsClientProps {
  movie: Movie;
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function MovieDetailsClient({ movie }: MovieDetailsClientProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAllSynopsis, setShowAllSynopsis] = useState(false);

  const schedules = getSchedulesForMovie(movie.id);
  const youtubeId = movie.trailerUrl ? getYouTubeId(movie.trailerUrl) : null;
  const similarMovies = MOCK_MOVIES.filter(
    (m) =>
      m.id !== movie.id &&
      m.genre.some((g) => movie.genre.includes(g)) &&
      m.isActive
  ).slice(0, 5);

  const formatRuntime = (min: number) =>
    `${Math.floor(min / 60)}h ${min % 60}m`;

  // Group schedules by date
  const schedulesByDate = schedules.reduce(
    (acc, schedule) => {
      const dateKey = new Date(schedule.startTime).toLocaleDateString("en-BD");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(schedule);
      return acc;
    },
    {} as Record<string, typeof schedules>
  );

  return (
    <div className="min-h-screen bg-[#0B0B0E]">
      {/* Hero Backdrop */}
      <div className="relative h-[75vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src={movie.backdropUrl || movie.posterUrl || "/placeholder.jpg"}
          alt={movie.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0E]/80 via-transparent to-transparent" />

        {/* Play Trailer Button */}
        {movie.trailerUrl && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowTrailer(true)}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-[#FF3B30]/80 group-hover:border-[#FF3B30] transition-all duration-300 group-hover:scale-110">
              <Play className="w-9 h-9 text-white fill-white ml-1" />
            </div>
          </motion.button>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0"
          >
            <div className="relative w-48 lg:w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10 mx-auto lg:mx-0">
              <Image
                src={movie.posterUrl || "/placeholder.jpg"}
                alt={movie.title}
                width={256}
                height={384}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pt-4 lg:pt-24"
          >
            {/* Status */}
            <div className="flex items-center gap-2 mb-3">
              {movie.status === "NOW_SHOWING" ? (
                <Badge className="bg-[#FF3B30] text-white border-0">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                  Now Showing
                </Badge>
              ) : (
                <Badge className="bg-[#D6A84D]/20 text-[#D6A84D] border border-[#D6A84D]/30">
                  Coming Soon
                </Badge>
              )}
              {movie.genre.map((g) => (
                <Link key={g} href={`/movies?genre=${g}`}>
                  <Badge className="bg-white/5 text-white/60 border-0 hover:bg-white/10 cursor-pointer">
                    {g}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-2">
              {movie.title}
            </h1>
            {movie.titleBn && (
              <p className="text-2xl text-[#D6A84D] font-semibold mb-4">
                {movie.titleBn}
              </p>
            )}

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
              {movie.rating && (
                <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-3 py-1.5">
                  <Star className="w-4 h-4 text-[#D6A84D] fill-[#D6A84D]" />
                  <span className="text-white font-bold text-base">
                    {movie.rating}
                  </span>
                  <span className="text-white/40">/10</span>
                  <span className="text-white/30 text-xs">CineHub</span>
                </div>
              )}
              {movie.imdbRating && (
                <div className="flex items-center gap-1.5 bg-[#F5C518]/10 rounded-xl px-3 py-1.5">
                  <span className="text-[#F5C518] text-xs font-bold">IMDb</span>
                  <span className="text-[#F5C518] font-bold">
                    {movie.imdbRating}
                  </span>
                </div>
              )}
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1.5 text-white/60">
                  <Clock className="w-4 h-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-white/60">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(movie.releaseDate).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <Globe className="w-4 h-4" />
                <span>{movie.language}</span>
              </div>
              {movie.subtitle.length > 0 && (
                <div className="flex items-center gap-1.5 text-white/60">
                  <Subtitles className="w-4 h-4" />
                  <span>{movie.subtitle.join(", ")} Sub</span>
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div className="mb-6 max-w-2xl">
              <p
                className={`text-white/60 leading-relaxed ${!showAllSynopsis ? "line-clamp-3" : ""}`}
              >
                {movie.synopsis}
              </p>
              {movie.synopsis.length > 200 && (
                <button
                  onClick={() => setShowAllSynopsis(!showAllSynopsis)}
                  className="flex items-center gap-1 text-[#FF3B30] text-sm mt-2 hover:text-[#FF6961] transition-colors"
                >
                  {showAllSynopsis ? "Show Less" : "Read More"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showAllSynopsis ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {movie.status === "NOW_SHOWING" && (
                <Link href="#showtimes">
                  <Button
                    size="lg"
                    className="bg-[#FF3B30] hover:bg-[#E82018] text-white px-8 rounded-2xl shadow-xl shadow-red-500/25"
                  >
                    <Ticket className="w-5 h-5 mr-2" />
                    Book Tickets
                  </Button>
                </Link>
              )}
              {movie.trailerUrl && (
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setShowTrailer(true)}
                  className="border border-white/20 text-white hover:bg-white/10 px-6 rounded-2xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Trailer
                </Button>
              )}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
                  isWishlisted
                    ? "bg-[#FF3B30]/20 border-[#FF3B30]/50 text-[#FF3B30]"
                    : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#FF3B30]" : ""}`} />
              </button>
              <button
                className="w-12 h-12 rounded-2xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 flex items-center justify-center transition-all"
                aria-label="Share"
                onClick={() =>
                  navigator.share?.({
                    title: movie.title,
                    url: window.location.href,
                  })
                }
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <Tabs defaultValue="showtimes" id="showtimes">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8">
              <TabsTrigger
                value="showtimes"
                className="data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white rounded-xl px-6"
              >
                Showtimes
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white rounded-xl px-6"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white rounded-xl px-6"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Showtimes Tab */}
            <TabsContent value="showtimes">
              {Object.keys(schedulesByDate).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(schedulesByDate).map(([date, daySchedules]) => (
                    <div key={date}>
                      <h3 className="text-white/60 text-sm font-medium mb-3">
                        {date}
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {daySchedules.map((schedule) => (
                          <Link
                            key={schedule.id}
                            href={`/book/${schedule.id}/seats`}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-[#151518] border border-white/5 hover:border-[#FF3B30]/30 hover:bg-[#FF3B30]/5 transition-all group"
                          >
                            <div className="text-center">
                              <div className="text-xl font-bold text-white">
                                {new Date(
                                  schedule.startTime
                                ).toLocaleTimeString("en-BD", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="text-white/40 text-xs">
                                {schedule.language}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
                                <MapPin className="w-3 h-3" />
                                {MOCK_BRANCHES[0]?.name}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-lg bg-white/5 text-white/50 text-xs">
                                  Screen 1
                                </span>
                                {schedule.subtitle && (
                                  <span className="px-2 py-0.5 rounded-lg bg-white/5 text-white/50 text-xs">
                                    {schedule.subtitle} Sub
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold text-sm">
                                ৳{schedule.priceStandard}
                              </div>
                              <div className="text-white/30 text-[10px]">onwards</div>
                              <Button
                                size="sm"
                                className="mt-1 bg-[#FF3B30] hover:bg-[#E82018] text-white text-xs h-7 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Book
                              </Button>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📅</div>
                  <p className="text-white/40">No showtimes available</p>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-white font-semibold mb-4">Synopsis</h3>
                  <p className="text-white/60 leading-relaxed">{movie.synopsis}</p>
                  {movie.synopsisBn && (
                    <>
                      <h4 className="text-white/40 font-medium mt-6 mb-2 text-sm">
                        বাংলায়
                      </h4>
                      <p className="text-white/50 leading-relaxed">
                        {movie.synopsisBn}
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Details</h3>
                  <dl className="space-y-3">
                    {[
                      { label: "Language", value: movie.language },
                      {
                        label: "Subtitles",
                        value:
                          movie.subtitle.join(", ") || "None",
                      },
                      {
                        label: "Runtime",
                        value: movie.runtime
                          ? formatRuntime(movie.runtime)
                          : "TBA",
                      },
                      {
                        label: "Release Date",
                        value: new Date(movie.releaseDate).toLocaleDateString(
                          "en-BD",
                          { day: "numeric", month: "long", year: "numeric" }
                        ),
                      },
                      { label: "Genre", value: movie.genre.join(", ") },
                      ...(movie.imdbId
                        ? [{ label: "IMDb", value: movie.imdbId }]
                        : []),
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-4">
                        <dt className="text-white/40 text-sm w-28 flex-shrink-0">
                          {label}
                        </dt>
                        <dd className="text-white text-sm">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="text-center py-16">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-white font-semibold mb-2">No reviews yet</h3>
                <p className="text-white/40 text-sm mb-6">
                  Be the first to review this movie after watching it
                </p>
                <Button className="bg-[#FF3B30] hover:bg-[#E82018] text-white">
                  Write a Review
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-16 pb-16">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarMovies.map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-[#151518] flex items-center justify-center">
                  <p className="text-white/40">Trailer unavailable</p>
                </div>
              )}
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80"
                aria-label="Close trailer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
