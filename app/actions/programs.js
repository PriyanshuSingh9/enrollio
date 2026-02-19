"use server";

import { db } from "@/db";
import { programs, users } from "@/schema";
import { eq } from "drizzle-orm";
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
