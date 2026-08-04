import type { Metadata } from "next";
import { BranchesPageClient } from "./BranchesPageClient";

export const metadata: Metadata = {
  title: "Cinema Branches — All Locations",
  description:
    "Find all cinema branches across Bangladesh. View facilities, showtimes, and book tickets at the branch nearest to you.",
};

export default function BranchesPage() {
  return <BranchesPageClient />;
}
