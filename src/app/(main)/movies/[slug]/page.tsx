import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MovieDetailsClient } from "./MovieDetailsClient";
import { getMovieBySlug, MOCK_MOVIES } from "@/services/data-providers/mock-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_MOVIES.map((movie) => ({ slug: movie.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);

  if (!movie) {
    return { title: "Movie Not Found" };
  }

  return {
    title: `${movie.title} — Tickets & Showtimes`,
    description: movie.synopsis.slice(0, 155),
    openGraph: {
      title: movie.title,
      description: movie.synopsis.slice(0, 155),
      images: movie.backdropUrl
        ? [{ url: movie.backdropUrl, width: 1280, height: 720 }]
        : [],
    },
  };
}

export default async function MoviePage({ params }: PageProps) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  return <MovieDetailsClient movie={movie} />;
}
