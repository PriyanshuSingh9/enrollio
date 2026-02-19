import { db } from "@/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/user";

export default async function ProfileSettings() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    if (!dbUser) {
        return redirect("/sign-in"); // Or appropriate error handling
    }

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-muted mb-8">Update your personal information.</p>

            <div className="p-8 rounded-xl border border-border-subtle bg-surface">
                <form action={updateProfile} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={dbUser.name}
                            className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={dbUser.email}
                            disabled
                            className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-muted cursor-not-allowed opacity-70"
                        />
                        <p className="mt-1 text-xs text-muted">Email cannot be changed here.</p>
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-secondary mb-2">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows="4"
                            defaultValue={dbUser.bio || ""}
                            className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-accent hover:bg-accent-hover text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
