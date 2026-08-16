import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DATABASE_URL is only required for booking/user features.
    // Movie browsing milestone works without a database.
    url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/cinehubbd",
  },
});
