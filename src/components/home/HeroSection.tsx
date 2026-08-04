"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Ticket,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeaturedMovies } from "@/services/data-providers/mock-data";

const featuredMovies = getFeaturedMovies();

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
    );
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goNext]);

  const movie = featuredMovies[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section
      className="relative w-full h-screen min-h-[680px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Images */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={movie.backdropUrl || movie.posterUrl || "/placeholder.jpg"}
            alt={movie.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0E] via-[#0B0B0E]/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-transparent to-[#0B0B0E]/30 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-4 flex items-center gap-3"
              >
                {movie.status === "NOW_SHOWING" ? (
                  <Badge className="bg-[#FF3B30] text-white border-0 px-3 py-1 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                    Now Showing
                  </Badge>
                ) : (
                  <Badge className="bg-[#D6A84D]/20 text-[#D6A84D] border border-[#D6A84D]/30 px-3 py-1 text-xs font-semibold">
                    Coming Soon
                  </Badge>
                )}
                {movie.genre.slice(0, 2).map((g) => (
                  <span key={g} className="text-white/40 text-xs font-medium">
                    {g}
                  </span>
                ))}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] mb-3"
              >
                {movie.title}
              </motion.h1>

              {movie.titleBn && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl text-[#D6A84D] font-semibold mb-4"
                >
                  {movie.titleBn}
                </motion.p>
              )}

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-4 mb-5"
              >
                {movie.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#D6A84D] fill-[#D6A84D]" />
                    <span className="text-white font-semibold">
                      {movie.rating}
                    </span>
                    <span className="text-white/40 text-sm">/10</span>
                  </div>
                )}
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(movie.releaseDate).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white/70 text-xs font-medium">
                  {movie.language}
                </span>
              </motion.div>

              {/* Synopsis */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-base leading-relaxed mb-8 max-w-lg line-clamp-3"
              >
                {movie.synopsis}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-4"
              >
                {movie.status === "NOW_SHOWING" ? (
                  <Link href={`/movies/${movie.slug}`}>
                    <Button
                      size="lg"
                      className="bg-[#FF3B30] hover:bg-[#E82018] text-white px-8 py-6 rounded-2xl text-base font-semibold shadow-xl shadow-red-500/25 hover:shadow-red-500/40 transition-all hover:scale-105"
                    >
                      <Ticket className="w-5 h-5 mr-2" />
                      Book Tickets
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/movies/${movie.slug}`}>
                    <Button
                      size="lg"
                      className="bg-[#D6A84D] hover:bg-[#C49440] text-black px-8 py-6 rounded-2xl text-base font-semibold shadow-xl shadow-yellow-500/20"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      View Details
                    </Button>
                  </Link>
                )}

                {movie.trailerUrl && (
                  <Link href={`/movies/${movie.slug}#trailer`}>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="text-white hover:text-white hover:bg-white/10 px-6 py-6 rounded-2xl text-base font-semibold border border-white/20"
                    >
                      <Play className="w-5 h-5 mr-2 fill-white" />
                      Watch Trailer
                    </Button>
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110"
          aria-label="Previous movie"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          {featuredMovies.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex
                  ? "w-8 h-2.5 bg-[#FF3B30]"
                  : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to movie ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110"
          aria-label="Next movie"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden lg:flex items-center gap-3">
        {featuredMovies.map((m, i) => (
          <button
            key={m.id}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
              i === currentIndex
                ? "w-24 h-14 ring-2 ring-[#FF3B30] ring-offset-2 ring-offset-transparent"
                : "w-16 h-10 opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              src={m.posterUrl || "/placeholder.jpg"}
              alt={m.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
