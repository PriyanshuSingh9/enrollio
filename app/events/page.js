import { db } from "@/db";
import { programs } from "@/schema";
import { eq, desc, and } from "drizzle-orm";
import Link from "next/link";
import Navbar from "@/components/User/Navbar";

export const metadata = {
    title: "Events | Enrollio",
    description: "Discover and register for upcoming events, workshops, and hackathons.",
};

export default async function EventsListing({ searchParams }) {
    // 1. Fetch Data
    const eventPrograms = await db
        .select()
        .from(programs)
        .where(and(
            eq(programs.type, "event"),
            eq(programs.isActive, true)
        ))
        .orderBy(desc(programs.createdAt));

    // 2. Extract unique filter options
    const categories = [...new Set(eventPrograms.map(p => p.category).filter(Boolean))];
    const modes = ["Online", "Offline", "Hybrid"];

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-4">Explore Events</h1>
                    <p className="text-xl text-muted max-w-2xl">
                        Join workshops, webinars, and hackathons to level up your skills.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* ── Sidebar Filters ──────────────────────────────── */}
                    <aside className="hidden lg:block space-y-8">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="w-full bg-surface border border-border-subtle rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-accent transition-colors"
                            />
                            <svg className="absolute left-3 top-3.5 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        {/* Filter Group: Mode */}
                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Mode</h3>
                            <div className="space-y-2">
                                {modes.map(mode => (
                                    <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-5 h-5 rounded border border-border-subtle bg-elevated flex items-center justify-center group-hover:border-accent transition-colors"></div>
                                        <span className="text-secondary group-hover:text-white transition-colors">{mode}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Filter Group: Category */}
                        {categories.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Category</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 rounded border border-border-subtle bg-elevated flex items-center justify-center group-hover:border-accent transition-colors"></div>
                                            <span className="text-secondary group-hover:text-white transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filter Group: Status */}
                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Availability</h3>
                            <div className="space-y-2">
                                {['Upcoming', 'Open Now', 'Ending Soon'].map(s => (
                                    <label key={s} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-5 h-5 rounded border border-border-subtle bg-elevated flex items-center justify-center group-hover:border-accent transition-colors"></div>
                                        <span className="text-secondary group-hover:text-white transition-colors">{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* ── Main Grid ──────────────────────────────────── */}
                    <div className="lg:col-span-3">
                        {eventPrograms.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-4">
                                {eventPrograms.map((program) => (
                                    <Link key={program.id} href={`/events/${program.id}`}>
                                        <div className="group h-full p-6 rounded-xl border border-border-subtle bg-surface hover:border-accent/50 hover:bg-surface-hover transition-all duration-300 flex flex-col items-start hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
                                            {/* Badge Row */}
                                            <div className="flex items-center gap-2 mb-4 w-full">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                    ${program.mode === 'online' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                                                    ${program.mode === 'offline' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                                                    ${program.mode === 'hybrid' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                                                `}>
                                                    {program.mode === 'online' ? 'Online' : program.mode === 'offline' ? 'In-Person' : 'Hybrid'}
                                                </span>
                                                {program.category && (
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-muted border border-white/10">
                                                        {program.category}
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                                {program.title}
                                            </h2>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-1 gap-y-2 w-full mb-6">
                                                {program.startDate && (
                                                    <div className="flex items-center gap-2 text-sm text-secondary">
                                                        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        {new Date(program.startDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-secondary">
                                                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {program.location || "Online"}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-secondary">
                                                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Apply by {new Date(program.deadline).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="mt-auto w-full pt-4 border-t border-border-subtle flex items-center justify-between">
                                                <span className="text-sm font-medium text-white group-hover:underline decoration-accent underline-offset-4 decoration-2">
                                                    Event Details
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border-subtle bg-surface p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-hover flex items-center justify-center">
                                    <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">No active events</h3>
                                <p className="text-muted max-w-sm mx-auto">
                                    There are no upcoming events at the moment. Check back soon!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}