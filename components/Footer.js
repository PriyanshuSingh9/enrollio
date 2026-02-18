import React from "react";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Events", href: "#events" },
    { label: "Internships", href: "#internships" },
    { label: "Companies", href: "#" },
    { label: "Pricing", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
                e
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                enrollio
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              The modern platform where events meet opportunities. Discover,
              connect, and grow.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              {["X", "GH", "LI"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-xs text-[var(--text-muted)] hover:text-white hover:border-[var(--border-light)] transition-colors duration-200"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 enrollio. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Made with precision & purpose.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
