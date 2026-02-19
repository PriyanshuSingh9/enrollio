import Link from "next/link";
import { db } from "@/db";
import { applications, programs, users } from "@/schema";
import { eq, desc, count, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    // Get user from DB to have the ID
    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    if (!dbUser) {
        return <div>Loading user data...</div>;
    }

    // Parallelize queries for better performance
    const [
        totalRes,
        pendingRes,
        completedRes,
        recentActivity
    ] = await Promise.all([
        // Total applications
        db.select({ count: count() })
            .from(applications)
            .where(eq(applications.userId, dbUser.id)),

        // Pending applications
        db.select({ count: count() })
            .from(applications)
            .where(and(
                eq(applications.userId, dbUser.id),
                eq(applications.status, "pending")
            )),

        // Completed/Certificate applications
        db.select({ count: count() })
            .from(applications)
            .where(and(
                eq(applications.userId, dbUser.id),
                eq(applications.status, "completed")
            )),

        // Recent activity
        db.select({
            id: applications.id,
            status: applications.status,
            appliedAt: applications.appliedAt,
            title: programs.title,
            type: programs.type
        })
            .from(applications)
            .innerJoin(programs, eq(applications.programId, programs.id))
            .where(eq(applications.userId, dbUser.id))
            .orderBy(desc(applications.appliedAt))
            .limit(3)
    ]);

    const totalApplications = totalRes[0]?.count || 0;
    const pendingApplications = pendingRes[0]?.count || 0;
    const completedApplications = completedRes[0]?.count || 0;

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, <span className="text-accent">{dbUser.name}</span>
                </h1>
                <p className="text-muted">Here's what's happening with your applications.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-xl border border-border-subtle bg-surface hover:border-accent transition-colors">
                    <h3 className="text-muted text-sm font-medium uppercase tracking-wide mb-2">Total Applications</h3>
                    <p className="text-4xl font-bold text-white">{totalApplications}</p>
                </div>
                <div className="p-6 rounded-xl border border-border-subtle bg-surface hover:border-warning transition-colors">
                    <h3 className="text-muted text-sm font-medium uppercase tracking-wide mb-2">Pending</h3>
                    <p className="text-4xl font-bold text-warning">{pendingApplications}</p>
                </div>
                <div className="p-6 rounded-xl border border-border-subtle bg-surface hover:border-success transition-colors">
                    <h3 className="text-muted text-sm font-medium uppercase tracking-wide mb-2">Certificates</h3>
                    <p className="text-4xl font-bold text-success">{completedApplications}</p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                    <Link href="/dashboard/activity" className="text-sm text-accent hover:text-accent-hover">
                        View all &rarr;
                    </Link>
                </div>

                {recentActivity.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="p-4 rounded-xl border border-border-subtle bg-surface flex items-center justify-between group hover:border-border-light transition-all">
                                <div>
                                    <h4 className="text-white font-medium mb-1 group-hover:text-accent transition-colors">{activity.title}</h4>
                                    <p className="text-xs text-muted">
                                        Applied on {new Date(activity.appliedAt).toLocaleDateString()} • <span className="capitalize">{activity.type}</span>
                                    </p>
                                </div>
                                <div className={`
                                    px-3 py-1 rounded-full text-xs font-medium border
                                    ${activity.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' : ''}
                                    ${activity.status === 'accepted' ? 'bg-accent/10 text-accent border-accent/20' : ''}
                                    ${activity.status === 'rejected' ? 'bg-error/10 text-error border-error/20' : ''}
                                    ${activity.status === 'completed' ? 'bg-success/10 text-success border-success/20' : ''}
                                `}>
                                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border border-dashed border-border-subtle rounded-xl">
                        <p className="text-muted mb-4">You haven't applied to any programs yet.</p>
                        <Link href="/events" className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                            Explore Events
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
