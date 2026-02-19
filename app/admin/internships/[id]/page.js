import { getProgramById } from "@/app/actions/programs";
import { db } from "@/db";
import { applications, users } from "@/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ManageInternship({ params }) {
    const { id } = await params;
    const internshipId = parseInt(id);

    if (isNaN(internshipId)) return notFound();

    const program = await getProgramById(internshipId);

    if (!program || program.type !== "internship") {
        return notFound();
    }

    // Fetch applicants
    const applicantsList = await db
        .select({
            id: applications.id,
            status: applications.status,
            appliedAt: applications.appliedAt,
            user: {
                name: users.name,
                email: users.email,
            }
        })
        .from(applications)
        .innerJoin(users, eq(applications.userId, users.id))
        .where(eq(applications.programId, internshipId))
        .orderBy(desc(applications.appliedAt));

    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-2">
                    <Link
                        href="/admin"
                        className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-light)] transition-colors"
                    >
                        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Manage Internship</h1>
                </div>
                <p className="text-[var(--text-muted)] mb-8">Managing "{program.title}"</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                        <h2 className="text-lg font-semibold text-white mb-4">Internship Details</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Title</p>
                                <p className="text-white font-medium">{program.title}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Deadline</p>
                                <p className="text-white font-medium">{new Date(program.deadline).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Status</p>
                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${program.isActive ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-red-500/10 text-red-500'}`}>
                                    {program.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Applicants</h2>
                            <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium">
                                {applicantsList.length} Total
                            </span>
                        </div>

                        {applicantsList.length > 0 ? (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {applicantsList.map((app) => (
                                    <div key={app.id} className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">{app.user.name}</p>
                                            <p className="text-sm text-[var(--text-muted)]">{app.user.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-[var(--text-muted)] block mb-1">
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium uppercase ${app.status === 'approved' ? 'bg-[var(--success)]/10 text-[var(--success)]' :
                                                    app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[var(--text-muted)] text-sm italic">No applications received yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
