"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Zap, Star, Car, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_BRANCHES, MOCK_CITIES } from "@/services/data-providers/mock-data";

export function BranchesPageClient() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredBranches = MOCK_BRANCHES.filter((branch) => {
    if (selectedCity !== "all" && branch.cityId !== selectedCity) return false;
    if (
      search &&
      !branch.name.toLowerCase().includes(search.toLowerCase()) &&
      !branch.address.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return branch.isActive;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0E] pt-20">
      {/* Header */}
      <section className="py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto px-4"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
            Cinema Branches
          </h1>
          <p className="text-white/40 text-lg mb-8">
            Find your nearest cinema and discover what&apos;s showing today
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search branches or areas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-[#FF3B30] transition-colors"
            />
          </div>
        </motion.div>
      </section>

      {/* City Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCity("all")}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCity === "all"
                ? "bg-[#FF3B30] text-white"
                : "bg-white/5 text-white/50 hover:text-white"
            }`}
          >
            All Cities
          </button>
          {MOCK_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCity === city.id
                  ? "bg-[#FF3B30] text-white"
                  : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Branch Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredBranches.length === 0 ? (
          <div className="text-center py-24">
            <MapPin className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40">No branches found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch, i) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group"
              >
                <div className="rounded-2xl bg-[#151518] border border-white/5 hover:border-white/10 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={branch.imageUrl || "/placeholder.jpg"}
                      alt={branch.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/60 backdrop-blur-sm text-white border-0">
                        {branch.city.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-base mb-2 line-clamp-1">
                      {branch.name}
                    </h3>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-start gap-2 text-white/40 text-sm">
                        <MapPin className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{branch.address}</span>
                      </div>
                      {branch.phone && (
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <Phone className="w-4 h-4 text-[#FF3B30]" />
                          <a
                            href={`tel:${branch.phone}`}
                            className="hover:text-white transition-colors"
                          >
                            {branch.phone}
                          </a>
                        </div>
                      )}
                      {branch.email && (
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <Mail className="w-4 h-4 text-[#FF3B30]" />
                          <a
                            href={`mailto:${branch.email}`}
                            className="hover:text-white transition-colors truncate"
                          >
                            {branch.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {branch.facilities.slice(0, 4).map((facility) => (
                        <span
                          key={facility}
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-white/50 font-medium"
                        >
                          {facility === "IMAX" && (
                            <Zap className="w-2.5 h-2.5 text-[#D6A84D]" />
                          )}
                          {facility === "4DX" && (
                            <Star className="w-2.5 h-2.5 text-[#FF3B30]" />
                          )}
                          {facility}
                        </span>
                      ))}
                      {branch.parking && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-[#2ECC71]/70">
                        <Car className="w-2.5 h-2.5" />
                          Parking
                        </span>
                      )}
                    </div>

                    <Link href={`/branches/${branch.slug}`}>
                      <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl transition-all">
                        View Showtimes
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
