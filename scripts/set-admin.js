
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../schema.js';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error("Please provide an email address as an argument.");
        process.exit(1);
    }

    console.log(`Promoting ${email} to admin...`);

    // Check if user exists
    const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email)
    });

    if (!user) {
        console.error(`User with email ${email} not found.`);
        process.exit(1);
    }

    // Update role
    await db.update(schema.users)
        .set({ role: 'admin' })
        .where(eq(schema.users.email, email));

    console.log(`Successfully promoted ${user.name} (${email}) to admin.`);
}

main().catch(console.error);
