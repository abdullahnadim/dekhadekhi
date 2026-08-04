"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, MapPin, Ticket, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_SCHEDULES,
  MOCK_MOVIES,
  MOCK_BRANCHES,
} from "@/services/data-providers/mock-data";

// Get today's schedules
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const todaySchedules = MOCK_SCHEDULES.filter((s) => {
  const d = new Date(s.startTime);
  return d >= today && d < tomorrow;
}).slice(0, 6);

export function TodayShowsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              Today&apos;s Shows
            </h2>
            <p className="text-white/40 text-sm">
              {today.toLocaleDateString("en-BD", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </motion.div>
          <Link
            href="/showtimes"
            className="flex items-center gap-1.5 text-[#FF3B30] hover:text-[#FF6961] text-sm font-medium transition-colors group"
          >
            All Showtimes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Showtime Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todaySchedules.length > 0 ? (
            todaySchedules.map((schedule, i) => {
              const movie = MOCK_MOVIES.find((m) => m.id === schedule.movieId);
              if (!movie) return null;

              return (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={`/book/${schedule.id}/seats`}>
                    <div className="flex gap-3 p-4 rounded-2xl bg-[#151518] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-0.5 hover:shadow-lg group cursor-pointer">
                      {/* Movie Poster */}
                      <div className="relative w-14 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={movie.posterUrl || "/placeholder.jpg"}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="56px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm line-clamp-1 mb-0.5">
                          {movie.title}
                        </h3>
                        <p className="text-[#D6A84D] text-xs mb-2">
                          {schedule.language}
                          {schedule.subtitle && ` · ${schedule.subtitle} sub`}
                        </p>

                        {/* Time */}
                        <div className="flex items-center gap-1.5 text-white/60 mb-1">
                          <Clock className="w-3.5 h-3.5 text-[#FF3B30]" />
                          <span className="text-sm font-medium text-white">
                            {new Date(schedule.startTime).toLocaleTimeString(
                              "en-BD",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                          <span className="text-xs text-white/30">
                            –{" "}
                            {new Date(schedule.endTime).toLocaleTimeString(
                              "en-BD",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>

                        {/* Branch */}
                        <div className="flex items-center gap-1 text-white/40 text-xs mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">
                            {MOCK_BRANCHES[0]?.name || "Cinema"}
                          </span>
                        </div>

                        {/* Price + Book */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white text-sm font-semibold">
                              ৳{schedule.priceStandard}
                            </span>
                            <span className="text-white/30 text-xs ml-1">
                              onwards
                            </span>
                          </div>
                          <Badge className="bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/20 text-[10px] font-semibold">
                            <Ticket className="w-2.5 h-2.5 mr-1" />
                            Book
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            /* No Shows Today */
            <div className="col-span-3 text-center py-16">
              <div className="text-5xl mb-4">🎬</div>
              <p className="text-white/40 text-base mb-2">
                No shows scheduled for today
              </p>
              <p className="text-white/20 text-sm mb-6">
                Check tomorrow&apos;s schedule or browse all movies
              </p>
              <Link href="/movies">
                <Button className="bg-[#FF3B30] hover:bg-[#E82018] text-white">
                  Browse Movies
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
