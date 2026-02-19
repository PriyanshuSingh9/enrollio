"use server";

import { db } from "@/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
    const user = await currentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name");
    const bio = formData.get("bio");
    const resumeUrl = formData.get("resumeUrl");

    // Basic validation
    if (!name || name.trim().length === 0) {
        return { success: false, message: "Name is required" };
    }

    try {
        await db.update(users)
            .set({
                name,
                bio,
                // resumeUrl: resumeUrl // Schema doesn't have resumeUrl anymore based on recent changes, check PRD
            })
            .where(eq(users.clerkId, user.id));

        revalidatePath("/dashboard/profile");
        return { success: true, message: "Profile updated successfully" };

    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, message: "Failed to update profile" };
    }
}

export async function syncUser() {
    const user = await currentUser();
    if (!user) return null;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    if (existingUser) {
        return existingUser;
    }

    // Insert new user
    const [newUser] = await db.insert(users).values({
        clerkId: user.id,
        name: `${user.firstName} ${user.lastName}`.trim() || "New User",
        email: user.emailAddresses[0]?.emailAddress || "",
        profilePhoto: user.imageUrl,
        role: "user", // Default role
    }).returning();

    return newUser;
}
