import type { Metadata } from "next";
import { Suspense } from "react";
import { MoviesPageClient } from "./MoviesPageClient";

export const metadata: Metadata = {
  title: "All Movies — Browse & Book",
  description:
    "Browse all movies showing in Bangladesh. Filter by genre, language, and status. Book tickets instantly.",
};

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0E]" />}>
      <MoviesPageClient />
    </Suspense>
  );
}
