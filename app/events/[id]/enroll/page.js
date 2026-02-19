import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getProgramById } from "@/app/actions/programs";
import { getUserProfile } from "@/app/actions/user";
import EnrollmentStepper from "@/components/User/EnrollmentStepper";
import Navbar from "@/components/User/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const eventId = parseInt(params.id);
    if (isNaN(eventId)) return { title: "Event Not Found" };

    const program = await getProgramById(eventId);
    return {
        title: program ? `Register — ${program.title} | Enrollio` : "Enroll | Enrollio",
    };
}

export default async function EventEnroll({ params }) {
    const eventId = parseInt(params.id);
    if (isNaN(eventId)) return notFound();

    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const [program, userProfile] = await Promise.all([
        getProgramById(eventId),
        getUserProfile(),
    ]);

    if (!program || program.type !== "event") {
        return redirect("/events");
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
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-accent/5 -skew-y-2 transform origin-top-left scale-110"></div>
                )}

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-6 shadow-lg shadow-accent/5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Secure Your Spot
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                        Register for {program.title}
                    </h1>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Your profile data has been pre-filled to make this process quick and seamless. Review and complete the steps below.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20 pb-24">
                {/* Stepper Wrapper */}
                <div className="bg-surface/80 backdrop-blur-xl border border-border-subtle rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/40">
                    <div className="mb-8">
                        <Link
                            href={`/events/${program.id}`}
                            className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-surface-hover border border-border-subtle flex items-center justify-center group-hover:border-border-light transition-colors">
                                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            Back to Event Details
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
