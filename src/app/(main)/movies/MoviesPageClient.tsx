"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "@/components/movies/MovieCard";
import { MOCK_MOVIES } from "@/services/data-providers/mock-data";
import type { MovieStatus } from "@/types";

const ALL_GENRES = [
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Biography",
  "History",
  "Sci-Fi",
  "Superhero",
  "Mystery",
  "Sports",
  "Adventure",
];

const LANGUAGES = ["Bangla", "English", "Hindi"];

type StatusFilter = "all" | MovieStatus;

export function MoviesPageClient() {
  const searchParams = useSearchParams();

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
  const [showFilters, setShowFilters] = useState(false);

  const filteredMovies = useMemo(() => {
    return MOCK_MOVIES.filter((movie) => {
      if (!movie.isActive) return false;

      if (search) {
        const q = search.toLowerCase();
        if (
          !movie.title.toLowerCase().includes(q) &&
          !(movie.titleBn && movie.titleBn.includes(q)) &&
          !movie.genre.some((g) => g.toLowerCase().includes(q))
        ) {
          return false;
        }
      }

      if (statusFilter !== "all" && movie.status !== statusFilter) return false;

      if (selectedGenres.length > 0) {
        if (!selectedGenres.some((g) => movie.genre.includes(g))) return false;
      }

      if (selectedLanguage && movie.language !== selectedLanguage) return false;

      return true;
    });
  }, [search, statusFilter, selectedGenres, selectedLanguage]);

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
  };

  const hasActiveFilters =
    search ||
    statusFilter !== "all" ||
    selectedGenres.length > 0 ||
    selectedLanguage;

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0B0B0E]/80 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
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
            <div className="hidden sm:flex items-center gap-1">
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
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
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
              {(selectedGenres.length > 0 || selectedLanguage) && (
                <Badge className="bg-[#FF3B30] text-white text-[10px] h-4 px-1 ml-1">
                  {selectedGenres.length + (selectedLanguage ? 1 : 0)}
                </Badge>
              )}
            </Button>

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
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                    Genre
                  </p>
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

                {/* Language */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                    Language
                  </p>
                  <div className="flex gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() =>
                          setSelectedLanguage(
                            selectedLanguage === lang ? "" : lang
                          )
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
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Result Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">
            <span className="text-white font-medium">{filteredMovies.length}</span>{" "}
            movie{filteredMovies.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        ) : (
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
