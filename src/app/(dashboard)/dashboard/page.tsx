import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Trophy, Ticket, Heart, Clock, TrendingUp, Film } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — My Account",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const stats = [
    {
      label: "Total Bookings",
      value: "0",
      icon: Ticket,
      color: "#FF3B30",
      href: "/dashboard/bookings",
    },
    {
      label: "Reward Points",
      value: "0",
      icon: Trophy,
      color: "#D6A84D",
      href: "/dashboard/rewards",
    },
    {
      label: "Wishlist",
      value: "0",
      icon: Heart,
      color: "#EC4899",
      href: "/dashboard/wishlist",
    },
    {
      label: "Movies Watched",
      value: "0",
      icon: Film,
      color: "#3498DB",
      href: "/dashboard/bookings",
    },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Welcome back, {session.user.name?.split(" ")[0] || "Movie Fan"} 👋
        </h1>
        <p className="text-white/40 text-sm">
          Here&apos;s an overview of your CineHub BD activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="p-4 rounded-2xl bg-[#151518] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-0.5 group cursor-pointer">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">
                {stat.value}
              </div>
              <div className="text-white/40 text-xs">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Membership Card */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#78350F] via-[#92400E] to-[#78350F] border border-[#D6A84D]/20 overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[#D6A84D] text-xs font-semibold tracking-widest uppercase mb-1">
                Membership
              </p>
              <h3 className="text-white text-2xl font-display font-bold">
                Bronze Tier
              </h3>
            </div>
            <Trophy className="w-8 h-8 text-[#D6A84D]" />
          </div>

          {/* Progress to Silver */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-white/60 mb-1.5">
              <span>0 points</span>
              <span>Silver: 1,000 pts</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-[#D6A84D]"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          <p className="text-white/50 text-xs">
            Earn 1,000 points to unlock Silver tier perks — priority booking,
            discount vouchers & more.
          </p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl bg-[#151518] border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Recent Bookings</h3>
          <Link
            href="/dashboard/bookings"
            className="text-[#FF3B30] text-sm hover:text-[#FF6961] transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <Ticket className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-sm mb-2">No bookings yet</p>
          <p className="text-white/20 text-xs mb-6">
            Book your first movie ticket and it will appear here
          </p>
          <Link href="/movies">
            <button className="px-6 py-2.5 bg-[#FF3B30] hover:bg-[#E82018] text-white rounded-xl text-sm font-medium transition-all">
              Browse Movies
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { href: "/movies?status=now_showing", label: "Now Showing", icon: Film },
          { href: "/movies?status=upcoming", label: "Coming Soon", icon: Clock },
          { href: "/showtimes", label: "Showtimes", icon: TrendingUp },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#151518] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-0.5 group cursor-pointer">
              <link.icon className="w-5 h-5 text-white/30 group-hover:text-[#FF3B30] transition-colors" />
              <span className="text-white/60 group-hover:text-white text-sm font-medium transition-colors">
                {link.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
