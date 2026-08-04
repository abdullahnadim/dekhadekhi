import { MovieGrid } from "@/components/movies/MovieCard";
import { getNowShowingMovies } from "@/services/data-providers/mock-data";

export function NowShowingSection() {
  const movies = getNowShowingMovies();

  return (
    <MovieGrid
      movies={movies}
      title="Now Showing"
      subtitle="Currently screening at cinemas near you"
      viewAllHref="/movies?status=now_showing"
    />
  );
}
