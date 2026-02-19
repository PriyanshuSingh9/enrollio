import Navbar from "@/components/User/Navbar";
import Link from "next/link";
import { db } from "@/db";
import { programs, users } from "@/schema";
import { eq, desc, and } from "drizzle-orm";
import { syncUser } from "@/app/actions/user";

// Helper to get consistent gradient based on ID (deterministic)
const getGradient = (id) => {
    const gradients = [
        "bg-gradient-to-r from-purple-600 to-indigo-600",
        "bg-gradient-to-r from-blue-500 to-teal-400",
        "bg-gradient-to-r from-orange-400 to-pink-500",
        "bg-gradient-to-r from-red-400 to-red-600",
        "bg-gradient-to-r from-emerald-500 to-teal-500",
        "bg-gradient-to-r from-indigo-500 to-purple-500",
    ];
    return gradients[id % gradients.length];
};

export default async function HomePage() {
    await syncUser(); // Sync user on visit

    // Fetch Events (latest 6)
    const events = await db.select({
        id: programs.id,
        title: programs.title,
        category: programs.category,
        date: programs.startDate,
        location: programs.location,
        organizer: users.name,
    })
        .from(programs)
        .innerJoin(users, eq(programs.adminId, users.id))
        .where(and(eq(programs.type, 'event'), eq(programs.isActive, true)))
        .orderBy(desc(programs.createdAt))
        .limit(6);

    // Fetch Internships (latest 6)
    const internships = await db.select({
        id: programs.id,
        title: programs.title,
        company: users.name, // Assuming admin name is company/organizer for now
        location: programs.location,
        duration: programs.duration,
        stipend: programs.stipend,
    })
        .from(programs)
        .innerJoin(users, eq(programs.adminId, users.id))
        .where(and(eq(programs.type, 'internship'), eq(programs.isActive, true)))
        .orderBy(desc(programs.createdAt))
        .limit(6);

    return (
        <div className="min-h-screen pb-20">
            <Navbar />

            <main className="pt-24 px-6 max-w-7xl mx-auto">
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

                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <Link href={`/events/${event.id}`} key={event.id} className="group block h-full">
                                    <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--border-light)] hover:translate-y-[-2px] transition-all duration-300">
                                        {/* Banner Placeholder */}
                                        <div className={`h-40 w-full ${getGradient(event.id)} relative group-hover:opacity-90 transition-opacity`}>
                                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                                                {event.category || 'Event'}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
                                                <span>{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</span>
                                                <span>•</span>
                                                <span>{event.location || 'Online'}</span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-1">
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
                    ) : (
                        <p className="text-[var(--text-muted)]">No active events found.</p>
                    )}
                </section>

                {/* Featured Internships Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-white">Top Internships</h2>
                        <Link href="/internships" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                            View all &rarr;
                        </Link>
                    </div>

                    {internships.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {internships.map((internship) => (
                                <Link href={`/internships/${internship.id}`} key={internship.id} className="group block h-full">
                                    <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--border-light)] hover:translate-y-[-2px] transition-all duration-300">
                                        {/* Banner Placeholder */}
                                        <div className={`h-40 w-full ${getGradient(internship.id + 100)} relative group-hover:opacity-90 transition-opacity`}>
                                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                                                {internship.duration || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
                                                <span>{internship.location || 'Remote'}</span>
                                                <span>•</span>
                                                <span className="text-[var(--success)]">{internship.stipend || 'Unpaid'}</span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-1">
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
                    ) : (
                        <p className="text-[var(--text-muted)]">No active internships found.</p>
                    )}
                </section>
            </main>
        </div>
    );
}
