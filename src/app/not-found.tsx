import Link from "next/link";
import { Film } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mx-auto mb-6">
          <Film className="w-12 h-12 text-[#FF3B30]" />
        </div>
        <h1 className="text-6xl font-display font-black text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-white/60 mb-4">
          Page Not Found
        </h2>
        <p className="text-white/30 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <button className="px-6 py-3 bg-[#FF3B30] hover:bg-[#E82018] text-white rounded-xl text-sm font-semibold transition-all">
              Go Home
            </button>
          </Link>
          <Link href="/movies">
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-sm font-medium transition-all">
              Browse Movies
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
