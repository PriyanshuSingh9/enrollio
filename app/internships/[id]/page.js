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
    const programId = parseInt(id);
    if (isNaN(programId)) return notFound();

    const program = await db.query.programs.findFirst({
        where: eq(programs.id, programId),
        with: {
            admin: true,
        }
    });

    if (!program || program.type !== "internship") {
        notFound();
    }

    const deadlineDate = new Date(program.deadline);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24)));
    const isExpired = daysLeft <= 0;
    const skills = program.requiredSkills ? program.requiredSkills.split(",").map(s => s.trim()) : [];

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                {program.coverImage ? (
                    <>
                        <div className="absolute inset-0">
                            <img
                                src={program.coverImage}
                                alt={program.title}
                                className="w-full h-full object-cover opacity-40 blur-sm"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-accent/5 -skew-y-2 transform origin-top-left scale-110"></div>
                )}

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                {!isExpired && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isExpired ? 'bg-muted' : 'bg-accent'}`}></span>
                            </span>
                            Internship
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-surface text-white border border-border-subtle capitalize">
                            {program.mode}
                        </span>
                        {program.category && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-surface text-secondary border border-border-subtle">
                                {program.category}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        {program.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-xs font-bold text-white">
                                {program.admin?.name?.charAt(0) || "O"}
                            </div>
                            <span>Posted by <span className="text-white hover:underline cursor-pointer">{program.admin?.name || "Organizer"}</span></span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-border-subtle"></div>
                        <span>Posted on {new Date(program.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="prose prose-invert prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-white mb-6">About this Internship</h3>
                            <div className="text-secondary leading-relaxed whitespace-pre-wrap">
                                {program.description}
                            </div>
                        </section>

                        {/* Required Skills */}
                        {skills.length > 0 && (
                            <section>
                                <h3 className="text-2xl font-bold text-white mb-6">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 rounded-xl text-sm font-medium bg-surface text-white border border-border-subtle hover:border-accent/50 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Key Info Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-surface border border-border-subtle rounded-2xl p-8 shadow-xl shadow-black/20">

                            {/* Deadline Display */}
                            <div className={`p-4 rounded-xl text-center mb-8 border ${isExpired ? "bg-red-500/10 border-red-500/20" : "bg-accent/10 border-accent/20"}`}>
                                <p className="text-xs uppercase tracking-wider text-muted mb-1">
                                    {isExpired ? "Registration Closed" : "Application Deadline"}
                                </p>
                                <p className={`text-2xl font-bold ${isExpired ? "text-red-400" : "text-accent"}`}>
                                    {isExpired ? "Expired" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                                </p>
                                <p className="text-sm text-muted mt-1">
                                    {deadlineDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-6">Internship Details</h3>

                            <div className="space-y-6 mb-8">
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
                                {(program.startDate || program.endDate) && (
                                    <InfoItem
                                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                                        label="Timeline"
                                        value={
                                            `${program.startDate ? new Date(program.startDate).toLocaleDateString() : 'TBA'} ${program.endDate ? `- ${new Date(program.endDate).toLocaleDateString()}` : ''}`
                                        }
                                    />
                                )}
                            </div>

                            {!isExpired ? (
                                <Link
                                    href={`/internships/${program.id}/enroll`}
                                    className="block w-full bg-accent hover:bg-accent/90 text-white text-center font-bold py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-accent/25"
                                >
                                    Register Now
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="block w-full text-center py-4 rounded-xl bg-surface-hover text-muted font-bold cursor-not-allowed border border-border-subtle"
                                >
                                    Registration Closed
                                </button>
                            )}

                            {!isExpired && (
                                <p className="text-xs text-center text-muted mt-4">
                                    Apply before time runs out!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <div>
                <p className="text-sm text-muted mb-1">{label}</p>
                <p className="text-white font-medium">{value}</p>
            </div>
        </div>
    );
}
