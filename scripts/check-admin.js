
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../schema.js';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
    console.log("Fetching users...");
    const users = await db.query.users.findMany();

    if (users.length === 0) {
        console.log("No users found.");
    } else {
        console.table(users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            clerkId: u.clerkId
        })));
    }
}

main().catch(console.error);
