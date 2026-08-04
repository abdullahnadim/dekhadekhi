"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOCK_BRANCHES } from "@/services/data-providers/mock-data";

const branches = MOCK_BRANCHES.slice(0, 4);

export function BranchesSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
                Cinema Locations
              </h2>
              <p className="text-white/40 text-sm">
                Find the nearest cinema and explore what&apos;s showing
              </p>
            </motion.div>
          </div>
          <Link
            href="/branches"
            className="flex items-center gap-1.5 text-[#FF3B30] hover:text-[#FF6961] text-sm font-medium transition-colors group"
          >
            All Branches
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Branch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link href={`/branches/${branch.slug}`}>
                <div className="relative overflow-hidden rounded-2xl bg-[#151518] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer">
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={branch.imageUrl || "/placeholder.jpg"}
                      alt={branch.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-transparent to-transparent" />

                    {/* City Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 text-xs">
                        {branch.city.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">
                      {branch.name}
                    </h3>
                    <div className="flex items-start gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                      <span className="text-white/40 text-xs line-clamp-2">
                        {branch.address}
                      </span>
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-1.5">
                      {branch.facilities.slice(0, 3).map((facility) => (
                        <span
                          key={facility}
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-white/50"
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
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
