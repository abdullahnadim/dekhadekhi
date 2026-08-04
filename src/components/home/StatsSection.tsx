"use client";

import { motion } from "framer-motion";
import { Film, MapPin, Ticket, Users } from "lucide-react";

const stats = [
  { icon: Film, value: "500+", label: "Movies Available", color: "#FF3B30" },
  { icon: MapPin, value: "25+", label: "Cinema Branches", color: "#D6A84D" },
  { icon: Ticket, value: "50K+", label: "Tickets Sold", color: "#2ECC71" },
  { icon: Users, value: "10K+", label: "Happy Users", color: "#3498DB" },
];

export function StatsSection() {
  return (
    <section className="border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-6 lg:p-8"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon
                  className="w-5 h-5"
                  style={{ color: stat.color }}
                />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
