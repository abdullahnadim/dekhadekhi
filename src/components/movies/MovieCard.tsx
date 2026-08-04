"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, ArrowRight, Ticket, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  showBookButton?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: (movieId: string) => void;
}

export function MovieCard({
  movie,
  index = 0,
  showBookButton = true,
  isWishlisted = false,
  onWishlistToggle,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    onWishlistToggle?.(movie.id);
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/movies/${movie.slug}`} className="block">
        {/* Card Container */}
        <div className="relative overflow-hidden rounded-2xl bg-[#151518] border border-white/5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/50 group-hover:border-white/10">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={movie.posterUrl || "/placeholder.jpg"}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />

            {/* Gradient overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/40 to-transparent transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-60"
              )}
            />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
              <div className="flex flex-col gap-1.5">
                {movie.status === "NOW_SHOWING" && (
                  <Badge className="bg-[#FF3B30] text-white border-0 text-[10px] font-bold px-2 py-0.5 w-fit">
                    SHOWING
                  </Badge>
                )}
                {movie.status === "UPCOMING" && (
                  <Badge className="bg-[#D6A84D]/20 text-[#D6A84D] border border-[#D6A84D]/30 text-[10px] font-bold px-2 py-0.5 w-fit">
                    UPCOMING
                  </Badge>
                )}
                {movie.isFeatured && (
                  <Badge className="bg-white/10 text-white/80 border-0 text-[10px] font-bold px-2 py-0.5 w-fit backdrop-blur-sm">
                    ✦ FEATURED
                  </Badge>
                )}
              </div>

              {/* Wishlist button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleWishlist}
                className={cn(
                  "w-8 h-8 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all",
                  wishlisted
                    ? "bg-[#FF3B30]/90 text-white"
                    : "bg-black/40 text-white/60 hover:text-white hover:bg-black/60"
                )}
                aria-label={
                  wishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={cn("w-4 h-4", wishlisted && "fill-white")}
                />
              </motion.button>
            </div>

            {/* Rating */}
            {movie.rating && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 z-10">
                <Star className="w-3 h-3 text-[#D6A84D] fill-[#D6A84D]" />
                <span className="text-white text-xs font-semibold">
                  {movie.rating}
                </span>
              </div>
            )}

            {/* Hover Book Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-3 bottom-3 z-10"
            >
              {showBookButton && movie.status === "NOW_SHOWING" && (
                <Button
                  size="sm"
                  className="w-full bg-[#FF3B30] hover:bg-[#E82018] text-white rounded-xl text-xs font-semibold shadow-lg"
                >
                  <Ticket className="w-3.5 h-3.5 mr-1.5" />
                  Book Tickets
                </Button>
              )}
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-white text-sm leading-tight truncate mb-0.5">
              {movie.title}
            </h3>
            {movie.titleBn && (
              <p className="text-[#D6A84D] text-xs font-medium mb-1.5 truncate">
                {movie.titleBn}
              </p>
            )}
            <div className="flex items-center gap-2 text-white/40">
              <span className="text-xs">{movie.language}</span>
              {movie.runtime > 0 && (
                <>
                  <span className="text-white/20">·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{formatRuntime(movie.runtime)}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genre.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Movie Grid ───────────────────────────────────────────

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  showBookButton?: boolean;
}

export function MovieGrid({
  movies,
  title,
  subtitle,
  viewAllHref,
  showBookButton = true,
}: MovieGridProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || viewAllHref) && (
          <div className="flex items-end justify-between mb-8">
            <div>
              {title && (
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-white/40 text-sm">{subtitle}</p>
              )}
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="flex items-center gap-1.5 text-[#FF3B30] hover:text-[#FF6961] text-sm font-medium transition-colors group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={i}
              showBookButton={showBookButton}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
