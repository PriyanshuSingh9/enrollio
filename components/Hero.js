"use client";

import React from "react";
import { SignUpButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
      <div className="glow-orb glow-orb-blue w-[400px] h-[400px] -bottom-32 -left-32 animate-pulse-glow delay-200" />
      <div className="glow-orb glow-orb-purple w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 animate-float" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Heading */}
        <h1 className="animate-fade-in-up delay-100 text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] mb-6"
          style={{ opacity: 0 }}>
          Where Events
          <br />
          <span className="gradient-text">Meet Opportunities</span>
        </h1>

        {/* Sub-heading */}
        <p className="animate-fade-in-up delay-200 text-sm md:text-xl text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed mb-10 font-light"
          style={{ opacity: 0 }}>
          Discover curated events, land top internships, and build the network
          that launches your career — all in one beautifully simple platform.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4"
             style={{ opacity: 0 }}>
          <SignedOut>
            <SignInButton mode="redirect" forceRedirectUrl="/auth/callback?role=user">
              <button className="group relative px-8 py-3.5 bg-white text-black rounded-full font-medium text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
                Explore Events
                <span className="inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/auth/callback?role=admin">
              <button className="px-8 py-3.5 rounded-full text-sm font-medium border border-[var(--border-light)] text-white hover:bg-[var(--bg-surface)] hover:border-[var(--text-muted)] transition-all duration-300">
                Post an Opportunity
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/events">
              <button className="group relative px-8 py-3.5 bg-white text-black rounded-full font-medium text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
                Explore Events
                <span className="inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </Link>
            <Link href="/admin/internships/new">
              <button className="px-8 py-3.5 rounded-full text-sm font-medium border border-[var(--border-light)] text-white hover:bg-[var(--bg-surface)] hover:border-[var(--text-muted)] transition-all duration-300">
                Post an Opportunity
              </button>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </section>
  );
};

export default Hero;
