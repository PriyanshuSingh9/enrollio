"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";



const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const links = [
        { href: "/events", label: "Events" },
        { href: "/internships", label: "Internships" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "backdrop-blur-xl bg-[rgba(10,10,10,0.8)] border-b border-[var(--border-subtle)]"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl font-semibold tracking-tight text-white">
                            Enroll.io
                        </span>
                    </Link>


                    {/* Search Bar - Centered */}
                    <div className="hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-[var(--border-subtle)] rounded-full leading-5 bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] sm:text-sm transition-colors duration-200"
                                placeholder="Search events..."
                            />
                        </div>
                    </div>

                    {/* Desktop Nav - Right side */}
                    <div className="hidden md:flex items-center gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <SignedOut>
                            <SignInButton mode="redirect">
                                <button className="text-sm text-[var(--text-secondary)]">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="redirect">
                                <button className="text-sm bg-white text-black px-6 py-3 rounded-full font-medium">
                                    Get Started
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-12 h-12",
                                    },
                                    variables: {
                                        avatarSize: "48px",
                                    },
                                }}
                            />
                        </SignedIn>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-[var(--bg-primary)] pt-20 px-6 animate-fade-in md:hidden">
                    <div className="flex flex-col gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-2xl font-light text-white"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col gap-3">
                            <SignedOut>
                                <SignInButton mode="redirect">
                                    <button className="text-base text-[var(--text-secondary)]">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="redirect">
                                    <button className="text-base bg-white text-black px-6 py-3 rounded-full font-medium">
                                        Get Started
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8",
                                        },
                                    }}
                                />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
