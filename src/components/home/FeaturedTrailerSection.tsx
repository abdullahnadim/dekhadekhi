"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { getFeaturedMovies } from "@/services/data-providers/mock-data";

// Youtube icon removed from lucide-react — inline SVG
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const featuredMovies = getFeaturedMovies().filter((m) => m.trailerUrl);

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function FeaturedTrailerSection() {
  const [playingMovieId, setPlayingMovieId] = useState<string | null>(null);
  const featuredMovie = featuredMovies[0];

  if (!featuredMovie) return null;

  const youtubeId = featuredMovie.trailerUrl
    ? getYouTubeId(featuredMovie.trailerUrl)
    : null;

  return (
    <section className="py-16 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            Featured Trailers
          </h2>
          <p className="text-white/40 text-sm">
            Watch the latest trailers before you book
          </p>
        </motion.div>

        {/* Main Featured Trailer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden cursor-pointer group"
          onClick={() => setPlayingMovieId(featuredMovie.id)}
        >
          {/* Backdrop Image */}
          <div className="relative aspect-video max-h-[480px]">
            <Image
              src={featuredMovie.backdropUrl || featuredMovie.posterUrl || "/placeholder.jpg"}
              alt={featuredMovie.title}
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-500"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-[#FF3B30] flex items-center justify-center shadow-2xl shadow-red-500/40 group-hover:shadow-red-500/60 transition-all"
              >
                <Play className="w-9 h-9 text-white fill-white ml-1" />
              </motion.div>
            </div>

            {/* Movie Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <YoutubeIcon className="w-5 h-5 text-red-500" />
                    <span className="text-white/60 text-sm font-medium">
                      Official Trailer
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {featuredMovie.title}
                  </h3>
                  {featuredMovie.titleBn && (
                    <p className="text-[#D6A84D] text-sm mt-0.5">
                      {featuredMovie.titleBn}
                    </p>
                  )}
                </div>

                <Link
                  href={`/movies/${featuredMovie.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all"
                >
                  View Movie
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trailer Modal */}
        <AnimatePresence>
          {playingMovieId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setPlayingMovieId(null)}
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
                    title="Movie Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#151518] flex items-center justify-center">
                    <p className="text-white/40">Trailer not available</p>
                  </div>
                )}

                <button
                  onClick={() => setPlayingMovieId(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all"
                  aria-label="Close trailer"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
