import { HeroSection } from "@/components/home/HeroSection";
import { NowShowingSection } from "@/components/home/NowShowingSection";
import { UpcomingSection } from "@/components/home/UpcomingSection";
import { BranchesSection } from "@/components/home/BranchesSection";
import { FeaturedTrailerSection } from "@/components/home/FeaturedTrailerSection";
import { TodayShowsSection } from "@/components/home/TodayShowsSection";
import { StatsSection } from "@/components/home/StatsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineHub BD — Bangladesh's Premium Movie Booking Platform",
  description:
    "Discover and book movie tickets at all major cinemas in Bangladesh. Compare prices, browse seats, and enjoy a seamless booking experience.",
};

// Revalidate every 5 minutes for fresh data
export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="bg-[#0B0B0E]">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <StatsSection />

      {/* Now Showing */}
      <NowShowingSection />

      {/* Featured Trailer */}
      <FeaturedTrailerSection />

      {/* Today&apos;s Shows */}
      <TodayShowsSection />

      {/* Coming Soon */}
      <UpcomingSection />

      {/* Nearby Branches */}
      <BranchesSection />
    </div>
  );
}
