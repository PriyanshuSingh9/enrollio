import 'dotenv/config';
import { db } from "./db.js";
import { programs, applications } from "./schema.js";
import { eq, and, count } from "drizzle-orm";

async function run() {
  const adminId = 22; // Using the ID from the error
  try {
    const arr = await Promise.all([
      db.select({ count: count(programs.id) }).from(programs).where(eq(programs.adminId, adminId)),
      db.select({ count: count(programs.id) }).from(programs).where(and(eq(programs.adminId, adminId), eq(programs.isActive, true), eq(programs.type, 'event'))),
      db.select({ count: count(programs.id) }).from(programs).where(and(eq(programs.adminId, adminId), eq(programs.isActive, true), eq(programs.type, 'internship'))),
      db.select({ count: count(applications.id) }).from(applications)
        .innerJoin(programs, eq(applications.programId, programs.id))
        .where(eq(programs.adminId, adminId)),
      db.query.programs.findMany({
        where: eq(programs.adminId, adminId),
        orderBy: (programs, { desc }) => [desc(programs.createdAt)],
      })
    ]);
    console.log("Success");
  } catch (error) {
    console.error("Error caught:");
    console.error(error);
  }
}

run();
