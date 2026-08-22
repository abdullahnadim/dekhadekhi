"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Info, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SeatMapData, SeatWithStatus, SelectedSeat } from "@/types";
import { cn } from "@/lib/utils";

const MAX_SEATS = 8;

const SEAT_TYPE_COLORS: Record<string, string> = {
  STANDARD: "seat-standard",
  PREMIUM: "seat-premium",
  VIP: "seat-vip",
  COUPLE: "seat-couple",
  ACCESSIBLE: "seat-accessible",
};

interface SeatMapProps {
  data: SeatMapData;
  selectedSeats: SelectedSeat[];
  onSeatToggle: (seat: SeatWithStatus, price: number) => void;
  maxSeats?: number;
}

export function SeatMap({
  data,
  selectedSeats,
  onSeatToggle,
  maxSeats = MAX_SEATS,
}: SeatMapProps) {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredSeat, setHoveredSeat] = useState<SeatWithStatus | null>(null);

  const isSelected = useCallback(
    (seatId: string) => selectedSeats.some((s) => s.seatId === seatId),
    [selectedSeats]
  );

  const getSeatPrice = (type: string): number => {
    return data.prices[type as keyof typeof data.prices] || data.prices.STANDARD;
  };

  const handleSeatClick = useCallback(
    (seat: SeatWithStatus) => {
      if (seat.status === "OCCUPIED") return;

      const price = getSeatPrice(seat.type);
      const alreadySelected = isSelected(seat.id);

      if (!alreadySelected && selectedSeats.length >= maxSeats) return;

      onSeatToggle(seat, price);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSeats, maxSeats, isSelected, onSeatToggle]
  );

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Mouse/Touch drag for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".seat")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - panOffset.x,
      y: touch.clientY - panOffset.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // prevent page scroll while panning seat map
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  // Keyboard zoom — stable [] deps so listener is registered once
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "=" || e.key === "+") setZoom((z) => Math.min(z + 0.2, 2.5));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.2, 0.5));
      if (e.key === "0") { setZoom(1); setPanOffset({ x: 0, y: 0 }); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="select-none">
      {/* Screen */}
      <div className="relative mb-10">
        <div className="w-full max-w-xl mx-auto">
          <div className="h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full mb-1" />
          <div className="h-8 bg-gradient-to-b from-white/10 to-transparent rounded-b-[50%]" />
          <p className="text-center text-white/30 text-xs mt-2 uppercase tracking-widest">
            Screen
          </p>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-all touch-manipulation"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-all touch-manipulation"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-all touch-manipulation"
            aria-label="Reset view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-white/30 text-xs ml-1">{Math.round(zoom * 100)}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/30 text-xs">
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Click · Drag to pan</span>
          <span className="sm:hidden">Tap · Drag to pan</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div
        className="overflow-hidden rounded-2xl bg-[#0B0B0E] border border-white/5 cursor-grab active:cursor-grabbing"
        style={{ height: "clamp(280px, 50vw, 460px)" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.1s ease",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="py-6 px-4">
            {data.rows.map((seatRow) => (
              <div
                key={seatRow.row}
                className="flex items-center gap-1.5 mb-1.5"
              >
                {/* Row Label */}
                <span className="w-6 text-center text-white/20 text-[11px] font-mono font-bold flex-shrink-0">
                  {seatRow.row}
                </span>

                {/* Seats */}
                <div className="flex gap-1 flex-wrap">
                  {seatRow.seats.map((seat) => {
                    const selected = isSelected(seat.id);
                    const occupied = seat.status === "OCCUPIED";

                    return (
                      <motion.button
                        key={seat.id}
                        className={cn(
                          "seat",
                          occupied
                            ? "seat-occupied"
                            : selected
                            ? "seat-selected"
                            : SEAT_TYPE_COLORS[seat.type] || "seat-standard"
                        )}
                        style={
                          seat.type === "COUPLE"
                            ? { width: "58px" }
                            : undefined
                        }
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => !occupied && setHoveredSeat(seat)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        disabled={occupied}
                        whileHover={
                          !occupied && !selected ? { scale: 1.15 } : {}
                        }
                        whileTap={!occupied ? { scale: 0.9 } : {}}
                        aria-label={`${seat.type} seat ${seat.row}${seat.number} — ${occupied ? "Occupied" : selected ? "Selected" : "Available"}`}
                        aria-pressed={selected}
                      >
                        {seat.type === "VIP" && !occupied && !selected && (
                          <span className="text-[6px] leading-none text-[#D6A84D] absolute">★</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Row Label (right) */}
                <span className="w-6 text-center text-white/20 text-[11px] font-mono font-bold flex-shrink-0">
                  {seatRow.row}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredSeat && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm">
              <span className="font-medium text-white">
                {hoveredSeat.type} Seat {hoveredSeat.row}{hoveredSeat.number}
              </span>
              ·
              <span className="text-[#D6A84D] font-semibold">
                ৳{getSeatPrice(hoveredSeat.type)}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {data.legend.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div
              className={cn(
                "w-6 h-5 rounded-md border",
                item.type === "STANDARD" && "bg-[#2D3748] border-[#4B5563]",
                item.type === "PREMIUM" && "bg-[#4C1D95] border-[#7C3AED]",
                item.type === "VIP" && "bg-[#78350F] border-[#D6A84D]",
                item.type === "COUPLE" && "bg-[#831843] border-[#EC4899] w-12",
                item.type === "ACCESSIBLE" && "bg-[#064E3B] border-[#10B981]",
                item.type === "OCCUPIED" && "bg-[#111827] border-[#1F2937] opacity-50",
                item.type === "SELECTED" && "bg-[#FF3B30] border-[#FF6961]"
              )}
            />
            <span className="text-white/50 text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Seat Selection Summary ───────────────────────────────

interface SeatSelectionSummaryProps {
  selectedSeats: SelectedSeat[];
  prices: SeatMapData["prices"];
  scheduleInfo: {
    movieTitle: string;
    branchName: string;
    date: string;
    time: string;
    hall: string;
  };
  onContinue: () => void;
  onClearAll: () => void;
}

export function SeatSelectionSummary({
  selectedSeats,
  prices,
  scheduleInfo,
  onContinue,
  onClearAll,
}: SeatSelectionSummaryProps) {
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = Math.round(total * 0.02);
  const grandTotal = total + convenienceFee;

  return (
    <>
      {/* Mobile floating bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#151518]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-inset-bottom">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            {selectedSeats.length === 0 ? (
              <p className="text-white/40 text-sm">Select seats above</p>
            ) : (
              <>
                <p className="text-white font-semibold text-sm">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} · <span className="text-[#D6A84D]">৳{grandTotal}</span>
                </p>
                <p className="text-white/30 text-xs truncate">
                  {selectedSeats.map(s => `${s.row}${s.number}`).join(", ")}
                </p>
              </>
            )}
          </div>
          <button
            onClick={onContinue}
            disabled={selectedSeats.length === 0}
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-[#FF3B30] hover:bg-[#E82018] active:bg-[#C41410] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all touch-manipulation"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Desktop sticky sidebar */}
      <div className="hidden lg:block sticky top-0 space-y-4">
        {/* Show Info */}
        <div className="p-4 rounded-2xl bg-[#151518] border border-white/5">
          <p className="text-white font-semibold text-sm mb-1 truncate">
            {scheduleInfo.movieTitle}
          </p>
          <p className="text-white/40 text-xs">{scheduleInfo.branchName}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-white/50 flex-wrap">
            <span>{scheduleInfo.date}</span>
            <span>·</span>
            <span>{scheduleInfo.time}</span>
            <span>·</span>
            <span>{scheduleInfo.hall}</span>
          </div>
        </div>

        {/* Selected Seats */}
        <div className="p-4 rounded-2xl bg-[#151518] border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">Selected Seats</h3>
            {selectedSeats.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[#FF3B30] text-xs hover:text-[#FF6961] transition-colors py-1 px-2"
              >
                Clear All
              </button>
            )}
          </div>

          {selectedSeats.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">
              No seats selected
            </p>
          ) : (
            <div className="space-y-2">
              {selectedSeats.map((seat) => (
                <div key={seat.seatId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-5 h-4 rounded text-[8px] flex items-center justify-center",
                      seat.type === "STANDARD" && "bg-[#2D3748]",
                      seat.type === "PREMIUM" && "bg-[#4C1D95]",
                      seat.type === "VIP" && "bg-[#78350F]",
                      seat.type === "COUPLE" && "bg-[#831843]",
                      seat.type === "ACCESSIBLE" && "bg-[#064E3B]"
                    )} />
                    <span className="text-white/60 text-sm">{seat.row}{seat.number}</span>
                    <span className="text-white/30 text-xs capitalize">({seat.type.toLowerCase()})</span>
                  </div>
                  <span className="text-white text-sm font-medium">৳{seat.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        {selectedSeats.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#151518] border border-white/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Tickets ({selectedSeats.length})</span>
              <span className="text-white">৳{total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Convenience Fee (2%)</span>
              <span className="text-white">৳{convenienceFee}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-white font-semibold">Total</span>
              <span className="text-[#D6A84D] font-bold text-lg">৳{grandTotal}</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          disabled={selectedSeats.length === 0}
          className="w-full bg-[#FF3B30] hover:bg-[#E82018] text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl py-6 text-base font-semibold shadow-xl shadow-red-500/20"
        >
          <Ticket className="w-5 h-5 mr-2" />
          {selectedSeats.length === 0
            ? "Select Seats to Continue"
            : `Continue with ${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""}`}
        </Button>

        <p className="text-center text-white/20 text-xs">
          Seats are held for 10 minutes after selection
        </p>
      </div>
    </>
  );
}

// Missing import
function Ticket({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
