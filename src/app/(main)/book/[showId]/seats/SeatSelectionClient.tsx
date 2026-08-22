"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft, RefreshCw, MapPin, Clock, Film } from "lucide-react";
import Link from "next/link";
import { SeatMap, SeatSelectionSummary } from "@/components/booking/SeatMap";
import { useSeatMap } from "@/hooks/useCinemaData";
import { MOCK_SCHEDULES, MOCK_MOVIES, MOCK_BRANCHES } from "@/services/data-providers/mock-data";
import type { SelectedSeat, SeatWithStatus } from "@/types";

interface SeatSelectionClientProps {
  showId: string;
}

export function SeatSelectionClient({ showId }: SeatSelectionClientProps) {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  // Support both:
  //   cineplex-sch-130104  (live Cineplex schedule ID)
  //   sch-xxx              (mock schedule ID)
  const isCineplexShow = showId.startsWith("cineplex-sch-");

  // For mock schedules
  const mockSchedule = !isCineplexShow
    ? MOCK_SCHEDULES.find((s) => s.id === showId)
    : null;
  const mockMovie = mockSchedule
    ? MOCK_MOVIES.find((m) => m.id === mockSchedule.movieId)
    : null;

  // For Cineplex shows: extract the numeric schedule ID
  // showId format: "cineplex-sch-130104"
  const cineplexScheduleId = isCineplexShow
    ? showId.replace("cineplex-sch-", "")
    : null;

  // hallId and scheduleId used by the seats API
  // We use the scheduleId as the hall identifier too — the seat map is generated
  // deterministically based on it, giving consistent results per show
  const hallId = isCineplexShow
    ? `cineplex-hall-${cineplexScheduleId}`
    : mockSchedule?.hallId || "hall-1";

  // Fetch seat map via React Query (polls every 30s for live availability)
  const { data: seatMapData, isLoading, isError, refetch, isFetching } = useSeatMap(hallId, showId);

  const handleSeatToggle = useCallback(
    (seat: SeatWithStatus, price: number) => {
      setSelectedSeats((prev) => {
        const exists = prev.find((s) => s.seatId === seat.id);
        if (exists) return prev.filter((s) => s.seatId !== seat.id);
        if (prev.length >= 8) return prev;
        return [...prev, { seatId: seat.id, row: seat.row, number: seat.number, type: seat.type, price }];
      });
    },
    []
  );

  // Display info
  const movieTitle = mockMovie?.title || "Movie";
  const branchName = mockSchedule
    ? MOCK_BRANCHES[0]?.name || "Star Cineplex"
    : "Star Cineplex";
  const scheduleDate = mockSchedule ? new Date(mockSchedule.startTime) : new Date();

  const prices = seatMapData?.prices || {
    STANDARD: 350,
    PREMIUM: 500,
    VIP: 700,
    COUPLE: 1200,
    ACCESSIBLE: 350,
  };

  if (!isCineplexShow && !mockSchedule) {
    return (
      <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-white/60 mb-2">Show not found</p>
          <Link href="/showtimes" className="text-[#FF3B30] text-sm hover:underline">
            Browse Showtimes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0E] pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Nav */}
        <Link
          href="/showtimes"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Showtimes
        </Link>

        {/* Show Info Bar */}
        {isCineplexShow && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-8">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Film className="w-4 h-4 text-[#FF3B30]" />
              <span>Schedule #{cineplexScheduleId}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <MapPin className="w-4 h-4 text-white/30" />
              <span>Star Cineplex BD</span>
            </div>
            {isFetching && (
              <>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5 text-[#2ECC71] text-xs">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Refreshing availability...</span>
                </div>
              </>
            )}
          </div>
        )}

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
                    active ? "bg-[#FF3B30] text-white" : "bg-white/10 text-white/40"
                  }`}
                >
                  {step}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${active ? "text-white" : "text-white/40"}`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className="flex-1 h-px bg-white/10 mx-2" />}
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
                <div>
                  <h2 className="text-white font-semibold text-lg">Choose Your Seats</h2>
                  <p className="text-white/30 text-xs mt-0.5">
                    {seatMapData
                      ? `${seatMapData.rows.reduce((acc, r) => acc + r.seats.filter(s => s.status === "AVAILABLE").length, 0)} seats available`
                      : "Loading availability..."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-sm">
                    {selectedSeats.length} / 8 selected
                  </span>
                  <button
                    onClick={() => refetch()}
                    title="Refresh seat availability"
                    className="p-1.5 rounded-lg border border-white/10 text-white/30 hover:text-white hover:border-white/20 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <RefreshCw className="w-8 h-8 text-white/20 animate-spin" />
                  <p className="text-white/40 text-sm">Loading seat map...</p>
                  <p className="text-white/20 text-xs">Fetching live availability</p>
                </div>
              )}

              {isError && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="text-3xl">🎭</div>
                  <p className="text-white/40 text-sm">Failed to load seat map</p>
                  <button
                    onClick={() => refetch()}
                    className="text-[#FF3B30] text-sm hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Try again
                  </button>
                </div>
              )}

              {!isLoading && !isError && seatMapData && (
                <SeatMap
                  data={seatMapData}
                  selectedSeats={selectedSeats}
                  onSeatToggle={handleSeatToggle}
                  maxSeats={8}
                />
              )}
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
              prices={prices}
              scheduleInfo={{
                movieTitle,
                branchName,
                date: scheduleDate.toLocaleDateString("en-BD", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                }),
                time: scheduleDate.toLocaleTimeString("en-BD", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                hall: isCineplexShow ? `Hall #${cineplexScheduleId}` : "Screen 1",
              }}
              onContinue={() => {
                // Seat view only milestone — booking in future
              }}
              onClearAll={() => setSelectedSeats([])}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
