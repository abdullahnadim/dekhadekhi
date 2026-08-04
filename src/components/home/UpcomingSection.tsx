"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUpcomingMovies } from "@/services/data-providers/mock-data";

const upcomingMovies = getUpcomingMovies();

export function UpcomingSection() {
  return (
    <section className="py-16 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-display font-bold text-white mb-1"
            >
              Coming Soon
            </motion.h2>
            <p className="text-white/40 text-sm">
              Set reminders for upcoming blockbusters
            </p>
          </div>
          <Link
            href="/movies?status=upcoming"
            className="flex items-center gap-1.5 text-[#D6A84D] hover:text-[#F5CF6E] text-sm font-medium transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Upcoming Movies — Horizontal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingMovies.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link href={`/movies/${movie.slug}`}>
                <div className="flex gap-4 p-4 rounded-2xl bg-[#151518] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                  {/* Poster */}
                  <div className="relative w-20 h-28 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={movie.posterUrl || "/placeholder.jpg"}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                        {movie.title}
                      </h3>
                      <Badge className="flex-shrink-0 bg-[#D6A84D]/10 text-[#D6A84D] border border-[#D6A84D]/20 text-[10px]">
                        Soon
                      </Badge>
                    </div>

                    {movie.titleBn && (
                      <p className="text-[#D6A84D] text-xs mb-2 truncate">
                        {movie.titleBn}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(movie.releaseDate).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.genre.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-[#D6A84D] hover:text-[#D6A84D] hover:bg-[#D6A84D]/10 px-2 -ml-2"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Set reminder
                      }}
                    >
                      <Bell className="w-3 h-3 mr-1" />
                      Remind Me
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
