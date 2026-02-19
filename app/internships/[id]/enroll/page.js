import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getProgramById } from "@/app/actions/programs";
import { getUserProfile } from "@/app/actions/user";
import EnrollmentStepper from "@/components/User/EnrollmentStepper";
import Navbar from "@/components/User/Navbar";
import Link from "next/link";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const program = await getProgramById(id);
    return {
        title: program ? `Apply — ${program.title} | Enrollio` : "Enroll | Enrollio",
    };
}

export default async function InternshipEnroll({ params }) {
    const { id } = await params;
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const [program, userProfile] = await Promise.all([
        getProgramById(id),
        getUserProfile(),
    ]);

    if (!program || program.type !== "internship") {
        return redirect("/internships");
    }

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-32 px-6 overflow-hidden">
                {program.coverImage ? (
                    <>
                        <div className="absolute inset-0">
                            <img
                                src={program.coverImage}
                                alt={program.title}
                                className="w-full h-full object-cover opacity-30 blur-md"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-[var(--accent)]/5 -skew-y-2 transform origin-top-left scale-110"></div>
                )}

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 mb-6 shadow-lg shadow-[var(--accent)]/5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Apply for Internship
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                        Join {program.title}
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Your profile data has been pre-filled to make this quick and easy. Review your application below before submitting.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20 pb-24">
                {/* Stepper Wrapper */}
                <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-subtle)] rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/40">
                    <div className="mb-8">
                        <Link
                            href={`/internships/${program.id}`}
                            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-[var(--border-light)] transition-colors">
                                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            Back to Internship Details
                        </Link>
                    </div>

                    {/* Stepper Component */}
                    <EnrollmentStepper
                        userProfile={userProfile}
                        program={program}
                        customFields={program.customFields || []}
                    />
                </div>
            </div>
        </div>
    );
}
