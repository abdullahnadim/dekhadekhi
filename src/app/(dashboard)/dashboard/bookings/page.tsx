import type { Metadata } from "next";
import { Ticket, Calendar, Film } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Bookings",
};

export default function BookingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          My Bookings
        </h1>
        <p className="text-white/40 text-sm">
          View and manage your movie ticket bookings
        </p>
      </div>

      {/* Empty state */}
      <div className="rounded-2xl bg-[#151518] border border-white/5 p-12 text-center">
        <Ticket className="w-16 h-16 text-white/10 mx-auto mb-4" />
        <h3 className="text-white font-semibold text-lg mb-2">
          No bookings yet
        </h3>
        <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
          Once you book movie tickets, they&apos;ll appear here. You can view your
          QR code, download tickets, and request refunds.
        </p>
        <Link href="/movies">
          <button className="px-6 py-3 bg-[#FF3B30] hover:bg-[#E82018] text-white rounded-2xl text-sm font-semibold transition-all">
            Browse Movies
          </button>
        </Link>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          {
            icon: Calendar,
            title: "Upcoming Shows",
            desc: "No upcoming bookings",
            color: "#FF3B30",
          },
          {
            icon: Film,
            title: "Past Bookings",
            desc: "Movies you've watched",
            color: "#D6A84D",
          },
          {
            icon: Ticket,
            title: "Cancelled",
            desc: "Refund history",
            color: "#6B7280",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="p-4 rounded-2xl bg-[#151518] border border-white/5"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${card.color}15` }}
            >
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
            </div>
            <h4 className="text-white font-medium text-sm mb-0.5">{card.title}</h4>
            <p className="text-white/30 text-xs">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
