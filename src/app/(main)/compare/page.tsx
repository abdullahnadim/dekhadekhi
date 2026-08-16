import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Cinemas — Find the Best Deal",
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-16 lg:pt-20 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-6">🎯</div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">
          Cinema Comparison
        </h1>
        <p className="text-white/40 max-w-md mx-auto">
          Compare ticket prices, seat availability, and facilities across all
          cinemas in Bangladesh. Coming soon!
        </p>
      </div>
    </div>
  );
}
