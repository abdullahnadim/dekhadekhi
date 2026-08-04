"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  Bell,
  Trophy,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/bookings", label: "My Bookings", icon: BookOpen },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/rewards", label: "Rewards", icon: Trophy },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: Settings },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="space-y-4">
      {/* User Card */}
      <div className="p-4 rounded-2xl bg-[#151518] border border-white/5">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-[#FF3B30] rounded-full flex items-center justify-center text-white text-lg font-bold">
                {user.name?.[0] || "U"}
              </div>
            )}
          </Avatar>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {user.name || "Movie Fan"}
            </p>
            <p className="text-white/40 text-xs truncate">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-3 h-3 rounded-full bg-[#D6A84D]/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D6A84D]" />
              </div>
              <span className="text-[#D6A84D] text-[10px] font-semibold">
                Bronze Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 rounded-2xl bg-[#151518] border border-white/5">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
                  isActive(item.href, item.exact)
                    ? "bg-[#FF3B30]/15 text-[#FF3B30]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="border-t border-white/5 mt-2 pt-2">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-[#FF3B30] hover:bg-red-950/20 w-full transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  );
}
