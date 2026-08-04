import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
  interface User {
    role?: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        // In production, look up user in Prisma.
        // For now, allow a test user in development.
        if (process.env.NODE_ENV === "development") {
          if (
            parsed.data.email === "admin@cinehubbd.com" &&
            parsed.data.password === "password123"
          ) {
            return {
              id: "dev-admin-001",
              name: "Admin User",
              email: parsed.data.email,
              role: "ADMIN",
            };
          }
          if (parsed.data.email.includes("@")) {
            return {
              id: "dev-user-001",
              name: "Demo User",
              email: parsed.data.email,
              role: "USER",
            };
          }
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/dashboard",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
