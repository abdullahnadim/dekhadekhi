"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Film, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// Facebook icon removed from lucide-react
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  const handleFacebookLogin = () => {
    signIn("facebook", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF3B30]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D6A84D]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FF3B30] flex items-center justify-center shadow-lg shadow-red-500/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-xl text-white">CineHub BD</div>
              <div className="text-[10px] text-[#D6A84D] tracking-widest uppercase font-semibold">
                Bangladesh
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            Welcome back
          </h1>
          <p className="text-white/40 text-sm">
            Sign in to continue to CineHub BD
          </p>
        </div>

        {/* Error */}
        {reason === "unauthorized" && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/20 text-red-400 text-sm text-center">
            You don&apos;t have permission to access that page.
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Card */}
        <div className="bg-[#151518] rounded-2xl border border-white/5 p-6 sm:p-8 shadow-2xl">
          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              onClick={handleGoogleLogin}
              variant="ghost"
              className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/70 hover:text-white gap-2 rounded-xl"
            >
              <GoogleIcon className="w-4 h-4" />
              Google
            </Button>
            <Button
              onClick={handleFacebookLogin}
              variant="ghost"
              className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/70 hover:text-white gap-2 rounded-xl"
            >
              <FacebookIcon className="w-4 h-4" />
              Facebook
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Separator className="flex-1 bg-white/10" />
            <span className="text-white/30 text-xs">or continue with email</span>
            <Separator className="flex-1 bg-white/10" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/60 text-sm">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#FF3B30] focus:ring-[#FF3B30] rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/60 text-sm">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[#FF3B30] text-xs hover:text-[#FF6961] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#FF3B30] focus:ring-[#FF3B30] rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF3B30] hover:bg-[#E82018] text-white rounded-xl py-6 font-semibold shadow-xl shadow-red-500/20 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Register Link */}
        <p className="text-center text-white/40 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#FF3B30] hover:text-[#FF6961] font-medium transition-colors"
          >
            Create one for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0E]" />}>
      <LoginForm />
    </Suspense>
  );
}
