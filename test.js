import { db } from "./db.js";
import { programs } from "./schema.js";
import { eq, and, count } from "drizzle-orm";

async function run() {
  const adminId = 22;
  try {
    const res = await db.select({ count: count(programs.id) }).from(programs).where(and(eq(programs.adminId, adminId), eq(programs.isActive, true), eq(programs.type, 'event')));
    console.log("Success:", res);
  } catch (error) {
    console.error("Error caught:", error.message || error);
  }
}

run();
