import { db } from "@/db";
import { programs } from "@/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/User/Navbar";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const program = await db.query.programs.findFirst({
        where: eq(programs.id, parseInt(id)),
    });
    return {
        title: program ? `${program.title} | Enrollio` : "Internship | Enrollio",
        description: program?.description?.slice(0, 160) || "View internship details.",
    };
}

export default async function InternshipDetail({ params }) {
    const { id } = await params;
    const program = await db.query.programs.findFirst({
        where: eq(programs.id, parseInt(id)),
    });

    if (!program || program.type !== "internship") {
        notFound();
    }

    const deadlineDate = new Date(program.deadline);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24)));
    const isExpired = daysLeft === 0;
    const skills = program.requiredSkills ? program.requiredSkills.split(",").map(s => s.trim()) : [];

    return (
        <div className="min-h-screen pb-16">
            <Navbar />

            {/* Back Link */}
            <div className="max-w-6xl mx-auto px-6 pt-24 mb-6">
                <Link
                    href="/internships"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Internships
                </Link>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {/* Hero Section */}
                <div className="relative mb-10 animate-fade-in-up">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                            Internship
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white border border-white/10 capitalize">
                            {program.mode}
                        </span>
                        {program.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-[var(--text-secondary)] border border-white/10">
                                {program.category}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {program.title}
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-3xl">
                        Posted on {new Date(program.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column — Details */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-in-up delay-100" style={{ opacity: 0 }}>
                        {/* Description */}
                        <section className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                About This Internship
                            </h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                                {program.description}
                            </p>
                        </section>

                        {/* Required Skills */}
                        {skills.length > 0 && (
                            <section className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    Required Skills
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 rounded-full text-sm bg-[var(--bg-elevated)] text-white border border-[var(--border-subtle)] hover:border-[var(--accent)]/50 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Timeline */}
                        {(program.startDate || program.endDate) && (
                            <section className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    Timeline
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {program.startDate && (
                                        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                                            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Start Date</p>
                                            <p className="text-white font-medium">{new Date(program.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                                        </div>
                                    )}
                                    {program.endDate && (
                                        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                                            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">End Date</p>
                                            <p className="text-white font-medium">{new Date(program.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column — Sticky Info Card */}
                    <div className="lg:col-span-1 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5">
                                {/* Deadline */}
                                <div className={`p-4 rounded-xl text-center ${isExpired ? "bg-red-500/10 border border-red-500/20" : "bg-[var(--accent)]/10 border border-[var(--accent)]/20"}`}>
                                    <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">
                                        {isExpired ? "Registration Closed" : "Application Deadline"}
                                    </p>
                                    <p className={`text-2xl font-bold ${isExpired ? "text-red-400" : "text-[var(--accent)]"}`}>
                                        {isExpired ? "Expired" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                                    </p>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">
                                        {deadlineDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                    </p>
                                </div>

                                {/* Info Items */}
                                <div className="space-y-4">
                                    <InfoItem
                                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                        label="Stipend"
                                        value={program.stipend || "Unpaid"}
                                    />
                                    <InfoItem
                                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                        label="Duration"
                                        value={program.duration || "Flexible"}
                                    />
                                    <InfoItem
                                        icon={<><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>}
                                        label="Location"
                                        value={program.location || "Remote"}
                                    />
                                    <InfoItem
                                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                                        label="Mode"
                                        value={program.mode?.charAt(0).toUpperCase() + program.mode?.slice(1)}
                                    />
                                </div>

                                {/* CTA Button */}
                                {!isExpired ? (
                                    <Link
                                        href={`/internships/${program.id}/enroll`}
                                        className="block w-full text-center py-4 rounded-xl bg-white text-black font-semibold text-base hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Register Now →
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="block w-full text-center py-4 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-muted)] font-semibold text-base cursor-not-allowed border border-[var(--border-subtle)]"
                                    >
                                        Registration Closed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
                <p className="text-white font-medium">{value}</p>
            </div>
        </div>
    );
}
