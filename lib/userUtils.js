import { db } from "@/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { redirect } from "next/navigation";

export const getDbUser = cache(async () => {
    const user = await currentUser();
    if (!user) {
        return null; // Or handle redirect here if we strictly want only authenticated access
    }

    const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id),
    });

    return dbUser;
});

export const requireUser = async () => {
    const user = await getDbUser();
    if (!user) {
        redirect("/sign-in");
    }
    return user;
};
