import Link from "next/link";
import {
  Film,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

// Social icons removed from lucide-react — inline SVG replacements
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}
function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const footerLinks = {
  movies: [
    { label: "Now Showing", href: "/movies?status=now_showing" },
    { label: "Coming Soon", href: "/movies?status=upcoming" },
    { label: "All Movies", href: "/movies" },
    { label: "Trailers", href: "/movies?tab=trailers" },
  ],
  discover: [
    { label: "All Branches", href: "/branches" },
    { label: "Showtimes", href: "/showtimes" },
    { label: "Compare Prices", href: "/compare" },
    { label: "Today's Shows", href: "/showtimes?date=today" },
  ],
  account: [
    { label: "My Dashboard", href: "/dashboard" },
    { label: "Booking History", href: "/dashboard/bookings" },
    { label: "My Wishlist", href: "/dashboard/wishlist" },
    { label: "Rewards", href: "/dashboard/rewards" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: TwitterXIcon, href: "#", label: "Twitter / X" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-[#FF3B30] flex items-center justify-center shadow-lg shadow-red-500/30">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-xl text-white">
                  CineHub BD
                </div>
                <div className="text-[11px] text-[#D6A84D] tracking-widest uppercase font-semibold">
                  Bangladesh
                </div>
              </div>
            </Link>

            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
              Bangladesh's premier movie discovery and booking platform. Find
              the best movies, compare prices across all cinemas, and book your
              perfect seat in seconds.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-6">
              <a
                href="mailto:hello@cinehubbd.com"
                className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FF3B30]" />
                hello@cinehubbd.com
              </a>
              <a
                href="tel:+8801700000000"
                className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FF3B30]" />
                +880 1700-000000
              </a>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <MapPin className="w-4 h-4 text-[#FF3B30]" />
                Dhaka, Bangladesh
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FF3B30]/20 hover:text-[#FF3B30] flex items-center justify-center text-white/40 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Movies</h4>
              <ul className="space-y-2.5">
                {footerLinks.movies.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">
                Discover
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.discover.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white/3 rounded-2xl p-6 border border-white/5 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">
                Never miss a movie
              </h4>
              <p className="text-white/40 text-sm">
                Get notified about new releases, special screenings, and exclusive deals.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm outline-none focus:border-[#FF3B30] transition-colors"
              />
              <button className="px-4 py-2.5 bg-[#FF3B30] hover:bg-[#E82018] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-white/30 text-sm">
            © 2024 CineHub BD. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-white/30 hover:text-white text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-white/30 hover:text-white text-sm transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/sitemap.xml"
              className="text-white/30 hover:text-white text-sm transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
