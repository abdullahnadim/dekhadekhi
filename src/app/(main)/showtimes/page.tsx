import type { Metadata } from "next";
import { ShowtimesPageClient } from "./ShowtimesPageClient";

export const metadata: Metadata = {
  title: "Showtimes — Find Shows Near You",
  description:
    "View all showtimes across every cinema in Bangladesh. Filter by date, cinema, movie, and language.",
};

export default function ShowtimesPage() {
  return <ShowtimesPageClient />;
}
