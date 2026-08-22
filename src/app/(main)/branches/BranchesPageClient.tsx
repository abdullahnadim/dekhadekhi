"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, RefreshCw, Wifi, Building2, ChevronRight } from "lucide-react";
import { useCinemaBranches } from "@/hooks/useCinemaData";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Skeleton card
function BranchCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl bg-white/5 p-6 animate-pulse"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-2/3" />
        </div>
      </div>
    </motion.div>
  );
}

export function BranchesPageClient() {
  const { data: branches, isLoading, isError, error, refetch, isFetching } = useCinemaBranches();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Derive unique city list from live data
  const cities = useMemo(() => {
    if (!branches) return [];
    const seen = new Set<string>();
    return branches
      .filter((b) => {
        if (seen.has(b.cityId)) return false;
        seen.add(b.cityId);
        return true;
      })
      .map((b) => ({ id: b.cityId, name: b.city.name }));
  }, [branches]);

  const filteredBranches = useMemo(() => {
    if (!branches) return [];
    return branches.filter((branch) => {
      if (selectedCity !== "all" && branch.cityId !== selectedCity) return false;
      if (
        search &&
        !branch.name.toLowerCase().includes(search.toLowerCase()) &&
        !branch.address.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return branch.isActive;
    });
  }, [branches, selectedCity, search]);

  return (
    <div className="min-h-screen bg-[#0B0B0E] ">
      {/* Header */}
      <section className="py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto px-4"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
            Cinema Branches
          </h1>
          <p className="text-white/40 text-lg mb-8">
            Find your nearest Star Cineplex and discover what&apos;s showing today
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search branches or areas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FF3B30] transition-colors"
            />
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* City Filter + Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 gap-y-2 flex-wrap">
            <button
              onClick={() => setSelectedCity("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all touch-manipulation ${
                selectedCity === "all"
                  ? "bg-[#FF3B30] text-white"
                  : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all touch-manipulation ${
                  selectedCity === city.id
                    ? "bg-[#FF3B30] text-white"
                    : "bg-white/5 text-white/50 hover:text-white"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isLoading && !isError && (
              <div className="flex items-center gap-1.5 text-[#2ECC71] text-xs">
                <Wifi className="w-3 h-3" />
                <span>Live from Star Cineplex BD</span>
              </div>
            )}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh branches"
              className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Result count */}
        {!isLoading && !isError && (
          <p className="text-white/40 text-sm mb-6">
            <span className="text-white font-medium">{filteredBranches.length}</span>{" "}
            branch{filteredBranches.length !== 1 ? "es" : ""} found
          </p>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <BranchCardSkeleton key={i} index={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-5xl mb-4">📡</div>
            <h3 className="text-white/60 text-lg font-medium mb-2">
              Couldn&apos;t load branches
            </h3>
            <p className="text-white/30 text-sm mb-6 max-w-sm mx-auto">
              {error instanceof Error ? error.message : "Network error"}
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-[#FF3B30] hover:bg-[#E82018] text-white gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Branch Cards */}
        {!isLoading && !isError && filteredBranches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBranches.map((branch, i) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#FF3B30]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm leading-tight">
                        {branch.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/5 text-white/40 flex-shrink-0">
                        {branch._shortName}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5 text-white/40 text-xs mt-1.5">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{branch.address}</span>
                    </div>

                    {/* Notice badge */}
                    {branch._notice && (
                      <p className="text-[#D6A84D] text-xs mt-2 line-clamp-1">
                        ⚠️ {branch._notice}
                      </p>
                    )}

                    {/* City badge */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-white/40">
                        {branch.city.name}
                      </span>
                      {branch.facilities.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* View Showtimes link */}
                <Link
                  href={`/showtimes?branch=${branch._cineplexId}`}
                  className="mt-4 flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-all group-hover:border-white/10"
                >
                  <span>View Showtimes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredBranches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Building2 className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-white/60 text-lg font-medium mb-2">No branches found</h3>
            <p className="text-white/30 text-sm">Try a different city or search term</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
