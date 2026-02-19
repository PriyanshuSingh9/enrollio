"use server";

import { db } from "@/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name");
    const bio = formData.get("bio");
    const gender = formData.get("gender");
    const userType = formData.get("userType");
    const domain = formData.get("domain");
    const course = formData.get("course");
    const specialization = formData.get("specialization");
    const courseStartYear = formData.get("courseStartYear");
    const courseEndYear = formData.get("courseEndYear");
    const organization = formData.get("organization");
    const purpose = formData.get("purpose");
    const location = formData.get("location");

    // Basic validation
    if (!name || name.trim().length === 0) {
        return { success: false, message: "Name is required" };
    }

    try {
        await db.update(users)
            .set({
                name,
                bio,
                gender,
                userType,
                domain,
                course,
                specialization,
                courseStartYear: courseStartYear ? parseInt(courseStartYear) : null,
                courseEndYear: courseEndYear ? parseInt(courseEndYear) : null,
                organization,
                purpose,
                location,
            })
            .where(eq(users.clerkId, userId));

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

export async function getUserProfile() {
    const user = await currentUser();
    if (!user) return null;

    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    return dbUser || null;
}
