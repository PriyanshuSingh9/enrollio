import Link from "next/link";
import Navbar from "@/components/User/Navbar";
import { db } from "@/db";
import { programs } from "@/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EnrollPage({ params }) {
    const { id } = await params;
    const eventId = parseInt(id);
    if (isNaN(eventId)) return notFound();

    const event = await db.query.programs.findFirst({
        where: and(eq(programs.id, eventId), eq(programs.type, "event")),
    });

    if (!event) return notFound();

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-border-subtle mb-6">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Register for {event.title}</h1>
                        <p className="text-muted">Complete the form below to secure your spot.</p>
                    </div>

                    <div className="p-12 rounded-2xl border border-dashed border-border-subtle bg-surface">
                        <p className="text-white font-medium mb-4">Application Form Stepper Placeholder</p>
                        <p className="text-sm text-muted mb-8">
                            This page will contain the multi-step application form with dynamic fields based on the event configuration.
                        </p>

                        <Link
                            href={`/events/${eventId}`}
                            className="text-sm text-accent hover:text-accent-hover font-medium"
                        >
                            &larr; Back to Event Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
