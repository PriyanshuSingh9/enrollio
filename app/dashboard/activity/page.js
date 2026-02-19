import Link from "next/link";
import { db } from "@/db";
import { applications, programs, users } from "@/schema";
import { eq, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MyActivity() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    if (!dbUser) return <div>Loading...</div>;

    // Fetch applications with program details
    const userApplications = await db
        .select({
            id: applications.id,
            status: applications.status,
            appliedAt: applications.appliedAt,
            programTitle: programs.title,
            programType: programs.type,
            programId: programs.id,
        })
        .from(applications)
        .innerJoin(programs, eq(applications.programId, programs.id))
        .where(eq(applications.userId, dbUser.id))
        .orderBy(desc(applications.appliedAt));

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">My Activity</h1>
                <p className="text-muted">Track your applications and certificates.</p>
            </header>

            <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
                {userApplications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-subtle bg-surface-hover">
                                    <th className="p-4 text-xs font-medium text-muted uppercase tracking-wider">Program</th>
                                    <th className="p-4 text-xs font-medium text-muted uppercase tracking-wider">Type</th>
                                    <th className="p-4 text-xs font-medium text-muted uppercase tracking-wider">Applied On</th>
                                    <th className="p-4 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-medium text-muted uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {userApplications.map((app) => (
                                    <tr key={app.id} className="group hover:bg-surface-hover transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white group-hover:text-accent transition-colors">
                                                {app.programTitle}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="capitalize text-sm text-secondary">{app.programType}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-secondary">
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className={`
                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${app.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' : ''}
                                                ${app.status === 'accepted' ? 'bg-accent/10 text-accent border-accent/20' : ''}
                                                ${app.status === 'rejected' ? 'bg-error/10 text-error border-error/20' : ''}
                                                ${app.status === 'completed' ? 'bg-success/10 text-success border-success/20' : ''}
                                            `}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            {app.status === 'completed' ? (
                                                <Link
                                                    href={`/api/applications/${app.id}/certificate`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-success hover:text-emerald-300 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                    Download Cert
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/${app.programType}s/${app.programId}`} // Assuming routes are /events/[id] or /internships/[id]
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-white transition-colors"
                                                >
                                                    View Program
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16 px-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-hover mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No applications yet</h3>
                        <p className="text-muted mb-6 max-w-sm mx-auto">
                            When you apply for events or internships, they will appear here.
                        </p>
                        <Link
                            href="/events"
                            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-black bg-white hover:bg-gray-100 transition-colors"
                        >
                            Browse Events
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
