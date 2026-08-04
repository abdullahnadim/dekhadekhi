import type { Metadata } from "next";
import { MoviesPageClient } from "./MoviesPageClient";

export const metadata: Metadata = {
  title: "All Movies — Browse & Book",
  description:
    "Browse all movies showing in Bangladesh. Filter by genre, language, and status. Book tickets instantly.",
};

export default function MoviesPage() {
  return <MoviesPageClient />;
}
