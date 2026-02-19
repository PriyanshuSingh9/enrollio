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
        return redirect("/sign-in");
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-muted mb-8">Update your personal and academic information.</p>

            <div className="p-8 rounded-xl border border-border-subtle bg-surface">
                <form action={updateProfile} className="space-y-8">
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white border-b border-border-subtle pb-2">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">Full Name *</label>
                                <input type="text" id="name" name="name" defaultValue={dbUser.name} required className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="John Doe" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">Email Address</label>
                                <input type="email" id="email" name="email" defaultValue={dbUser.email} disabled className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-muted cursor-not-allowed opacity-70" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-3">Gender *</label>
                            <div className="flex flex-wrap gap-4">
                                {['Male', 'Female', 'More Options'].map((option) => (
                                    <label key={option} className="cursor-pointer">
                                        <input type="radio" name="gender" value={option} defaultChecked={dbUser.gender === option} className="peer sr-only" required />
                                        <div className="px-6 py-2 rounded-full border border-border-subtle bg-elevated text-muted peer-checked:border-accent peer-checked:text-white peer-checked:bg-accent/10 transition-all hover:border-border-light">
                                            {option}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-3">User Type *</label>
                            <div className="flex flex-wrap gap-4">
                                {['College Student', 'Professional', 'School Student', 'Fresher'].map((type) => (
                                    <label key={type} className="cursor-pointer">
                                        <input type="radio" name="userType" value={type} defaultChecked={dbUser.userType === type} className="peer sr-only" required />
                                        <div className="px-6 py-2 rounded-full border border-border-subtle bg-elevated text-muted peer-checked:border-accent peer-checked:text-white peer-checked:bg-accent/10 transition-all hover:border-border-light flex items-center gap-2">
                                            {type}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-secondary mb-2">Current Location *</label>
                            <div className="relative">
                                <input type="text" id="location" name="location" defaultValue={dbUser.location} required className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors pr-10" placeholder="City, State, Country" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic/Professional Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-white border-b border-border-subtle pb-2">Academic / Professional Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-3">Domain *</label>
                            <div className="flex flex-wrap gap-3">
                                {['Management', 'Engineering', 'Arts & Science', 'Medicine', 'Law', 'Others'].map((domain) => (
                                    <label key={domain} className="cursor-pointer">
                                        <input type="radio" name="domain" value={domain} defaultChecked={dbUser.domain === domain} className="peer sr-only" required />
                                        <div className="px-5 py-2 rounded-full border border-border-subtle bg-elevated text-muted peer-checked:border-accent peer-checked:text-white peer-checked:bg-accent/10 transition-all hover:border-border-light text-sm">
                                            {domain}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="course" className="block text-sm font-medium text-secondary mb-2">Course *</label>
                                <select id="course" name="course" defaultValue={dbUser.course} required className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none">
                                    <option value="" disabled>Select Course</option>
                                    <option value="B.Tech/BE">B.Tech/BE (Bachelor of Technology / Engineering)</option>
                                    <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                                    <option value="BBA">BBA (Bachelor of Business Administration)</option>
                                    <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                                    <option value="M.Tech">M.Tech (Master of Technology)</option>
                                    <option value="MBA">MBA (Master of Business Administration)</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-secondary mb-2">Course Specialization *</label>
                                <select id="specialization" name="specialization" defaultValue={dbUser.specialization} required className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none">
                                    <option value="" disabled>Select Specialization</option>
                                    <option value="Computer Science">Computer Science & Engineering</option>
                                    <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electronics">Electronics & Communication</option>
                                    <option value="Mechanical">Mechanical Engineering</option>
                                    <option value="Civil">Civil Engineering</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Course Duration *</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" name="courseStartYear" placeholder="Start Year" defaultValue={dbUser.courseStartYear} min="2000" max="2030" required className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" />
                                <input type="number" name="courseEndYear" placeholder="End Year" defaultValue={dbUser.courseEndYear} min="2000" max="2035" required className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="organization" className="block text-sm font-medium text-secondary mb-2">Organization / College *</label>
                            <input type="text" id="organization" name="organization" defaultValue={dbUser.organization} required className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="University or Company Name" />
                        </div>

                        <div>
                            <label htmlFor="purpose" className="block text-sm font-medium text-secondary mb-2">Purpose *</label>
                            <textarea id="purpose" name="purpose" rows="2" defaultValue={dbUser.purpose} required className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="Why are you joining this platform?"></textarea>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-secondary mb-2">Bio</label>
                        <textarea id="bio" name="bio" rows="4" defaultValue={dbUser.bio || ""} className="w-full bg-elevated border border-border-subtle rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="Tell us about yourself..."></textarea>
                    </div>

                    <div className="pt-4 border-t border-border-subtle">
                        <button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent-hover text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg shadow-purple-500/20">
                            Save Profile Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
