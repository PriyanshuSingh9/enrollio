"use client";

import Navbar from "@/components/User/Navbar";
import Link from "next/link";

// Dummy Data
const events = [
    {
        id: 1,
        title: "AI Hackathon 2026",
        organizer: "TechCorp",
        date: "Mar 15, 2026",
        location: "Online",
        category: "Hackathon",
        banner: "bg-gradient-to-r from-purple-600 to-indigo-600",
    },
    {
        id: 2,
        title: "Web3 Summit",
        organizer: "Blockchain Alliance",
        date: "Apr 02, 2026",
        location: "New York, NY",
        category: "Conference",
        banner: "bg-gradient-to-r from-blue-500 to-teal-400",
    },
    {
        id: 3,
        title: "React Advanced Workshop",
        organizer: "Frontend Masters",
        date: "Mar 20, 2026",
        location: "Online",
        category: "Workshop",
        banner: "bg-gradient-to-r from-orange-400 to-pink-500",
    },
];

const internships = [
    {
        id: 101,
        title: "Software Engineer Intern",
        company: "Google",
        location: "Remote",
        duration: "3 Months",
        stipend: "$5000/mo",
        banner: "bg-gradient-to-r from-gray-700 to-gray-900",
    },
    {
        id: 102,
        title: "Product Design Intern",
        company: "Airbnb",
        location: "San Francisco, CA",
        duration: "6 Months",
        stipend: "$4500/mo",
        banner: "bg-gradient-to-r from-red-400 to-red-600",
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <main className="pt-24 px-6 max-w-7xl mx-auto">
                {/* Warning Banner (Development Mode) */}
                {/* <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          ⚠️ You are viewing dummy data. The database is not connected yet.
        </div> */}

                <header className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="text-[var(--accent)]">Explorer</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg">
                        Here's what's happening in the tech world today.
                    </p>
                </header>

                {/* Featured Events Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-white">Trending Events</h2>
                        <Link href="/events" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                            View all &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <Link href={`/events/${event.id}`} key={event.id} className="group block h-full">
                                <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--border-light)] hover:translate-y-[-2px] transition-all duration-300">
                                    {/* Banner Placeholder */}
                                    <div className={`h-40 w-full ${event.banner} relative group-hover:opacity-90 transition-opacity`}>
                                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                                            {event.category}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
                                            <span>{event.date}</span>
                                            <span>•</span>
                                            <span>{event.location}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            by {event.organizer}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Internships Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-white">Top Internships</h2>
                        <Link href="/internships" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                            View all &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {internships.map((internship) => (
                            <Link href={`/internships/${internship.id}`} key={internship.id} className="group block h-full">
                                <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--border-light)] hover:translate-y-[-2px] transition-all duration-300">
                                    {/* Banner Placeholder */}
                                    <div className={`h-40 w-full ${internship.banner} relative group-hover:opacity-90 transition-opacity`}>
                                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                                            {internship.duration}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
                                            <span>{internship.location}</span>
                                            <span>•</span>
                                            <span className="text-[var(--success)]">{internship.stipend}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">
                                            {internship.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            at {internship.company}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
