"use server";

import { db } from "@/db";
import { programs, users, customFields, applications, applicationResponses } from "@/schema";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createEvent(formData) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Get DB user to link as admin
    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    if (!dbUser || dbUser.role !== 'admin') {
        throw new Error("Unauthorized: Only admins can create events");
    }

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const mode = formData.get("mode");
    const location = formData.get("location");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const deadline = formData.get("deadline");
    const coverImage = formData.get("coverImage");

    // Basic validation
    if (!title || !description || !mode || !deadline) {
        throw new Error("Missing required fields");
    }

    const [newEvent] = await db.insert(programs).values({
        adminId: dbUser.id,
        type: 'event',
        title,
        description,
        category,
        mode,
        location,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        deadline: new Date(deadline),
        coverImage,
        isActive: true,
    }).returning();

    revalidatePath("/events");
    revalidatePath("/admin");

    redirect(`/events/${newEvent.id}`);
}

export async function createInternship(formData) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // Get DB user to link as admin
    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    if (!dbUser || dbUser.role !== 'admin') {
        throw new Error("Unauthorized: Only admins can create internships");
    }

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const mode = formData.get("mode");
    const location = formData.get("location");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const deadline = formData.get("deadline");
    const coverImage = formData.get("coverImage");
    const stipend = formData.get("stipend");
    const duration = formData.get("duration");
    const requiredSkills = formData.get("requiredSkills");

    // Basic validation
    if (!title || !description || !mode || !deadline || !stipend || !duration || !requiredSkills) {
        throw new Error("Missing required fields");
    }

    const [newInternship] = await db.insert(programs).values({
        adminId: dbUser.id,
        type: 'internship',
        title,
        description,
        category,
        mode,
        location,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        deadline: new Date(deadline),
        coverImage,
        stipend,
        duration,
        requiredSkills,
        isActive: true,
    }).returning();

    revalidatePath("/internships");
    revalidatePath("/admin");

    redirect(`/internships/${newInternship.id}`);
}

export async function getProgramById(id) {
    const program = await db.query.programs.findFirst({
        where: eq(programs.id, parseInt(id)),
        with: {
            customFields: true,
        },
    });
    return program || null;
}

export async function submitApplication({ programId, responses }) {
    const user = await currentUser();
    if (!user) return { success: false, message: "You must be signed in to apply." };

    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    if (!dbUser) return { success: false, message: "User not found." };

    // Check for duplicate application
    const existing = await db.query.applications.findFirst({
        where: and(
            eq(applications.userId, dbUser.id),
            eq(applications.programId, programId)
        ),
    });

    if (existing) {
        return { success: false, message: "You have already applied to this program." };
    }

    try {
        const [application] = await db.insert(applications).values({
            userId: dbUser.id,
            programId,
            status: "pending",
        }).returning();

        // Insert custom field responses
        if (responses && responses.length > 0) {
            for (const resp of responses) {
                if (resp.value && resp.value.trim() !== "") {
                    await db.insert(applicationResponses).values({
                        applicationId: application.id,
                        customFieldId: resp.fieldId,
                        responseValue: resp.value,
                    });
                }
            }
        }

        revalidatePath("/dashboard");
        revalidatePath(`/internships/${programId}`);
        return { success: true, message: "Application submitted successfully!" };
    } catch (error) {
        console.error("Error submitting application:", error);
        return { success: false, message: "Failed to submit application." };
    }
}
