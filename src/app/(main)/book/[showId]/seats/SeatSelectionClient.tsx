"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SeatMap, SeatSelectionSummary } from "@/components/booking/SeatMap";
import { generateMockSeatMap, MOCK_SCHEDULES, MOCK_MOVIES, MOCK_BRANCHES } from "@/services/data-providers/mock-data";
import type { SelectedSeat, SeatWithStatus } from "@/types";

interface SeatSelectionClientProps {
  showId: string;
}

export function SeatSelectionClient({ showId }: SeatSelectionClientProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  const schedule = MOCK_SCHEDULES.find((s) => s.id === showId);
  const movie = schedule ? MOCK_MOVIES.find((m) => m.id === schedule.movieId) : null;
  const branch = MOCK_BRANCHES[0];

  const seatMapData = generateMockSeatMap("hall-1", showId, 0.4);

  const handleSeatToggle = useCallback(
    (seat: SeatWithStatus, price: number) => {
      setSelectedSeats((prev) => {
        const exists = prev.find((s) => s.seatId === seat.id);
        if (exists) {
          return prev.filter((s) => s.seatId !== seat.id);
        }
        return [
          ...prev,
          {
            seatId: seat.id,
            row: seat.row,
            number: seat.number,
            type: seat.type,
            price,
          },
        ];
      });
    },
    []
  );

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    // In production: persist to Zustand store + create server-side seat lock
    router.push(`/book/${showId}/food?seats=${selectedSeats.map((s) => s.seatId).join(",")}`);
  };

  if (!schedule || !movie) {
    return (
      <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-white/60">Show not found</p>
          <Link href="/movies" className="text-[#FF3B30] mt-4 block">
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  const scheduleDate = new Date(schedule.startTime);

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href={`/movies/${movie.slug}`} className="hover:text-white transition-colors">
            {movie.title}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Select Seats</span>
        </nav>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-10 max-w-lg">
          {[
            { step: 1, label: "Seats", active: true },
            { step: 2, label: "Food", active: false },
            { step: 3, label: "Pay", active: false },
          ].map(({ step, label, active }, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    active
                      ? "bg-[#FF3B30] text-white"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    active ? "text-white" : "text-white/40"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-px bg-white/10 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="p-4 sm:p-6 rounded-2xl bg-[#151518] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-lg">
                  Choose Your Seats
                </h2>
                <span className="text-white/40 text-sm">
                  {selectedSeats.length} / 8 seats selected
                </span>
              </div>
              <SeatMap
                data={seatMapData}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
                maxSeats={8}
              />
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SeatSelectionSummary
              selectedSeats={selectedSeats}
              prices={seatMapData.prices}
              scheduleInfo={{
                movieTitle: movie.title,
                branchName: branch?.name || "Cinema",
                date: scheduleDate.toLocaleDateString("en-BD", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                }),
                time: scheduleDate.toLocaleTimeString("en-BD", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                hall: "Screen 1",
              }}
              onContinue={handleContinue}
              onClearAll={() => setSelectedSeats([])}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
