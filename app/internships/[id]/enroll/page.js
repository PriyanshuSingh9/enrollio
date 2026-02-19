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
        <div className="min-h-screen pb-16">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 pt-24">
                {/* Back link */}
                <Link
                    href={`/internships/${program.id}`}
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors group mb-8"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to {program.title}
                </Link>

                {/* Header */}
                <div className="mb-10 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Enrollment
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Apply to {program.title}
                    </h1>
                    <p className="text-[var(--text-muted)] text-base">
                        Your profile data has been pre-filled to make this quick and easy.
                    </p>
                </div>

                {/* Stepper Component */}
                <EnrollmentStepper
                    userProfile={userProfile}
                    program={program}
                    customFields={program.customFields || []}
                />
            </div>
        </div>
    );
}
