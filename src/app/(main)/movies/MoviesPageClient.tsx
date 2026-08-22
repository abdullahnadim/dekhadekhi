"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Film, RefreshCw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "@/components/movies/MovieCard";
import { useCinemaMovies } from "@/hooks/useCinemaData";

const ALL_GENRES = [
  "Action", "Drama", "Comedy", "Thriller", "Biography", "History",
  "Sci-Fi", "Adventure", "Animation", "Horror", "Family",
];

const LANGUAGES = ["English", "Bangla", "Hindi"];
const CATEGORIES = ["2D", "3D", "IMAX"];

type StatusFilter = "all" | "NOW_SHOWING" | "UPCOMING";

// Skeleton card
function MovieCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden bg-white/5 animate-pulse"
    >
      <div className="aspect-[2/3] bg-white/10" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </motion.div>
  );
}

export function MoviesPageClient() {
  const searchParams = useSearchParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useCinemaMovies();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get("status") as StatusFilter) || "all"
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genre") ? [searchParams.get("genre")!] : []
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    searchParams.get("language") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Combine running + upcoming based on status filter
  const allMovies = useMemo(() => {
    if (!data) return [];
    if (statusFilter === "NOW_SHOWING") return data.running;
    if (statusFilter === "UPCOMING") return data.upcoming;
    return [...data.running, ...data.upcoming];
  }, [data, statusFilter]);

  const filteredMovies = useMemo(() => {
    return allMovies.filter((movie) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !movie.title.toLowerCase().includes(q) &&
          !movie.genre.some((g) => g.toLowerCase().includes(q)) &&
          !movie.language.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (selectedGenres.length > 0) {
        if (!selectedGenres.some((g) => movie.genre.includes(g))) return false;
      }
      if (selectedLanguage && movie.language !== selectedLanguage) return false;
      if (selectedCategory && movie._category !== selectedCategory) return false;
      return true;
    });
  }, [allMovies, search, selectedGenres, selectedLanguage, selectedCategory]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSelectedGenres([]);
    setSelectedLanguage("");
    setSelectedCategory("");
  };

  const hasActiveFilters =
    search ||
    statusFilter !== "all" ||
    selectedGenres.length > 0 ||
    selectedLanguage ||
    selectedCategory;

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-16 lg:pt-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0B0B0E]/80 backdrop-blur-xl sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="pl-9 bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#FF3B30] rounded-xl"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filters */}
          <div className="flex items-center gap-1 flex-wrap">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "NOW_SHOWING", label: "Now Showing" },
                  { value: "UPCOMING", label: "Upcoming" },
                ] as const
              ).map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all touch-manipulation ${
                    statusFilter === f.value
                      ? "bg-[#FF3B30] text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              size="sm"
              className={`border rounded-xl gap-2 ${
                showFilters
                  ? "border-[#FF3B30] text-[#FF3B30] bg-[#FF3B30]/10"
                  : "border-white/10 text-white/50 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(selectedGenres.length > 0 || selectedLanguage || selectedCategory) && (
                <Badge className="bg-[#FF3B30] text-white text-[10px] h-4 px-1 ml-1">
                  {selectedGenres.length + (selectedLanguage ? 1 : 0) + (selectedCategory ? 1 : 0)}
                </Badge>
              )}
            </Button>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh movies"
              className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>

            {hasActiveFilters && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                size="sm"
                className="text-white/40 hover:text-white text-xs"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/5"
            >
              <div className="flex flex-col gap-4">
                {/* Genre */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Genre</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          selectedGenres.includes(genre)
                            ? "bg-[#FF3B30] text-white"
                            : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 flex-wrap">
                  {/* Language */}
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Language</p>
                    <div className="flex gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          onClick={() =>
                            setSelectedLanguage(selectedLanguage === lang ? "" : lang)
                          }
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            selectedLanguage === lang
                              ? "bg-[#D6A84D] text-black font-medium"
                              : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Format</p>
                    <div className="flex gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() =>
                            setSelectedCategory(selectedCategory === cat ? "" : cat)
                          }
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            selectedCategory === cat
                              ? "bg-[#7C3AED] text-white font-medium"
                              : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data source badge */}
        {!isLoading && !isError && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-sm">
              <span className="text-white font-medium">{filteredMovies.length}</span>{" "}
              movie{filteredMovies.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-1.5 text-[#2ECC71] text-xs">
              <Wifi className="w-3 h-3" />
              <span>Live from Star Cineplex BD</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} index={i} />
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
              Couldn&apos;t load movies
            </h3>
            <p className="text-white/30 text-sm mb-6 max-w-sm mx-auto">
              {error instanceof Error ? error.message : "Failed to connect to Cineplex BD"}
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

        {/* Movies Grid */}
        {!isLoading && !isError && filteredMovies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map((movie, i) => (
              <MovieCard
                key={movie.id}
                movie={{
                  ...movie,
                  releaseDate: new Date(movie.releaseDate),
                  subtitle: [],
                  synopsisBn: null,
                  imdbRating: null,
                  imdbId: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Film className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-white/60 text-lg font-medium mb-2">
              No movies found
            </h3>
            <p className="text-white/30 text-sm mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={clearAllFilters}
              className="bg-[#FF3B30] hover:bg-[#E82018] text-white"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
