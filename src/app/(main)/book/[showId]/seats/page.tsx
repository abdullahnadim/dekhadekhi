import { SeatSelectionClient } from "./SeatSelectionClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ showId: string }>;
}

export const metadata: Metadata = {
  title: "Select Seats",
  description: "Choose your preferred seats for the show",
};

export default async function SeatsPage({ params }: PageProps) {
  const { showId } = await params;
  return <SeatSelectionClient showId={showId} />;
}
