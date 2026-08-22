"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  MapPin,
  Ticket,
  Search,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  Star,
  LogOut,
  Settings,
  BookOpen,
  Heart,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/branches", label: "Branches", icon: MapPin },
  { href: "/showtimes", label: "Showtimes", icon: Ticket },
  { href: "/compare", label: "Compare", icon: Star },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#0B0B0E]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF3B30] flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Film className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-display font-bold text-lg text-white tracking-tight">
                    CineHub
                  </span>
                  <span className="text-[10px] font-semibold text-[#D6A84D] tracking-widest uppercase">
                    Bangladesh
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF3B30]"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                aria-label="Search movies"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {status === "authenticated" && session?.user ? (
                <>
                  {/* Notifications */}
                  <Link href="/dashboard/notifications">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#FF3B30] rounded-full border-2 border-[#0B0B0E]" />
                    </motion.div>
                  </Link>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <Avatar className="w-7 h-7">
                          {session.user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={session.user.image}
                              alt={session.user.name || "User"}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-7 h-7 bg-[#FF3B30] rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {session.user.name?.[0] || "U"}
                            </div>
                          )}
                        </Avatar>
                        <span className="text-sm font-medium text-white/80 hidden sm:block max-w-24 truncate">
                          {session.user.name?.split(" ")[0] || "User"}
                        </span>
                        <ChevronDown className="w-3 h-3 text-white/40" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-[#151518] border-white/10"
                    >
                      <DropdownMenuLabel className="text-white/50 text-xs uppercase tracking-wider">
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem onClick={() => router.push("/dashboard")} className="text-white/80 cursor-pointer">
                        <User className="w-4 h-4 mr-2" /> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/dashboard/bookings")} className="text-white/80 cursor-pointer">
                        <BookOpen className="w-4 h-4 mr-2" /> My Bookings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/dashboard/wishlist")} className="text-white/80 cursor-pointer">
                        <Heart className="w-4 h-4 mr-2" /> Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/dashboard/rewards")} className="text-white/80 cursor-pointer">
                        <Trophy className="w-4 h-4 mr-2" /> Rewards
                        <Badge className="ml-auto bg-[#D6A84D]/20 text-[#D6A84D] text-[10px]">
                          Bronze
                        </Badge>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="text-white/80 cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" /> Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-[#FF3B30] cursor-pointer focus:text-[#FF3B30] focus:bg-red-950/30"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-[#FF3B30] hover:bg-[#E82018] text-white shadow-lg shadow-red-500/20"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all touch-manipulation"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-white/5 bg-[#0B0B0E]/98 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive(link.href)
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Auth links for mobile (only when not authenticated) */}
                {status !== "authenticated" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    className="pt-3 border-t border-white/5 mt-3 flex flex-col gap-2"
                  >
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#FF3B30] text-white hover:bg-[#E82018] transition-all"
                    >
                      Get Started — It&apos;s Free
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#151518] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-3 p-4 border-b border-white/5">
                <Search className="w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search movies, genres, directors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-lg"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {!searchQuery && (
                <div className="p-4">
                  <p className="text-white/30 text-sm mb-3">Trending Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Toofan", "Oppenheimer", "Deadpool", "Hawa", "Action", "Bangla"].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm transition-all"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
              {searchQuery && (
                <div className="p-4">
                  <Link
                    href={`/movies?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <Search className="w-4 h-4 text-white/40" />
                    <span className="text-white/80">
                      Search for &quot;<span className="text-white font-medium">{searchQuery}</span>&quot;
                    </span>
                    <span className="ml-auto text-white/30 text-sm group-hover:text-white/50">
                      Press Enter
                    </span>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
