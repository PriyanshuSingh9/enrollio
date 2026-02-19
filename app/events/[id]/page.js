import { db } from "@/db";
import { programs, users } from "@/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/User/Navbar";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const event = await db.query.programs.findFirst({
        where: and(eq(programs.id, parseInt(id)), eq(programs.type, "event")),
    });

    if (!event) return { title: "Event Not Found" };

    return {
        title: `${event.title} | Enrollio`,
        description: event.description.substring(0, 160),
    };
}

export default async function EventDetail({ params }) {
    const { id } = await params;
    const eventId = parseInt(id);
    if (isNaN(eventId)) return notFound();

    const event = await db.query.programs.findFirst({
        where: and(eq(programs.id, eventId), eq(programs.type, "event")),
        with: {
            admin: true, // Fetch organizer details
        }
    });

    if (!event) return notFound();

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                {event.coverImage ? (
                    <>
                        <div className="absolute inset-0">
                            <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-full h-full object-cover opacity-40 blur-sm"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-accent/5 -skew-y-2 transform origin-top-left scale-110"></div>
                )}

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        {event.mode === 'online' ? 'Online Event' : event.mode === 'offline' ? 'In-Person Event' : 'Hybrid Event'}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        {event.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-xs font-bold text-white">
                                {event.admin?.name?.charAt(0) || "O"}
                            </div>
                            <span>Hosted by <span className="text-white hover:underline cursor-pointer">{event.admin?.name || "Organizer"}</span></span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-border-subtle"></div>
                        <span>Posted on {new Date(event.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Description */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="prose prose-invert prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-white mb-6">About this Event</h3>
                            <div className="text-secondary leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </section>

                        {/* Additional dynamic sections could go here (Schedule, Speakers, etc.) */}
                    </div>

                    {/* Right Column: Key Info Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-surface border border-border-subtle rounded-2xl p-8 shadow-xl shadow-black/20">
                            <h3 className="text-xl font-bold text-white mb-6">Event Details</h3>

                            <div className="space-y-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted mb-1">Date & Time</p>
                                        <p className="text-white font-medium">
                                            {event.startDate ? new Date(event.startDate).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : "Date TBA"}
                                        </p>
                                        {event.endDate && event.endDate !== event.startDate && (
                                            <p className="text-sm text-secondary mt-1">
                                                to {new Date(event.endDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted mb-1">Location</p>
                                        <p className="text-white font-medium">{event.location || "Online"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted mb-1">Deadline</p>
                                        <p className="text-white font-medium">
                                            {new Date(event.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/events/${eventId}/enroll`}
                                className="block w-full bg-accent hover:bg-accent-hover text-white text-center font-bold py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-accent/25"
                            >
                                Register Now
                            </Link>

                            <p className="text-xs text-center text-muted mt-4">
                                Limited spots available. Registration closes soon.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
