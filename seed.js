import 'dotenv/config';
import { db } from './db.js';
import { users, programs, applications, customFields, applicationResponses } from './schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
    console.log('🌱 Seeding database...');

    // Lists for random data generation
    const firstNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Hannah', 'Ian', 'Jack', 'Kara', 'Liam'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const domains = ['Technology', 'Business', 'Design', 'Marketing', 'Data Science'];
    const cities = ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Remote', 'Bangalore', 'Toronto'];

    // Helper to pick random item
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // 1. Create Users (1 Admin + 15 Users)
    console.log('Creating users...');
    const createdUsers = [];

    // Admin
    const [admin] = await db.insert(users).values({
        clerkId: `user_admin_${Date.now()}`,
        name: 'Super Admin',
        email: `admin${Date.now()}@enrollio.com`,
        role: 'admin',
        bio: 'The boss.',
    }).returning();
    createdUsers.push(admin);

    // Regular Users
    for (let i = 0; i < 15; i++) {
        const name = `${random(firstNames)} ${random(lastNames)}`;
        const [user] = await db.insert(users).values({
            clerkId: `user_${i}_${Date.now()}`,
            name: name,
            email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
            role: 'user',
            bio: `Enthusiastic learner interested in ${random(domains)}.`,
        }).returning();
        createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users.`);


    // 2. Create Programs (12 Programs)
    console.log('Creating programs...');
    const createdPrograms = [];

    for (let i = 0; i < 12; i++) {
        const isInternship = Math.random() > 0.5;
        const type = isInternship ? 'internship' : 'event';
        const title = isInternship
            ? `${random(['Frontend', 'Backend', 'Full Stack', 'AI', 'Marketing'])} Intern`
            : `${random(['Hackathon', 'Workshop', 'Seminar', 'Meetup'])} 2026`;

        const [program] = await db.insert(programs).values({
            adminId: admin.id,
            type: type,
            title: title,
            description: `Join us for this amazing ${type} focused on ${random(domains)}.`,
            category: random(domains),
            location: random(cities),
            mode: random(['online', 'offline', 'hybrid']),
            deadline: new Date(Date.now() + 86400000 * Math.floor(Math.random() * 30)), // +0-30 days
            startDate: new Date(Date.now() + 86400000 * Math.floor(Math.random() * 60 + 30)),
            endDate: new Date(Date.now() + 86400000 * Math.floor(Math.random() * 90 + 30)),
            ...(isInternship ? {
                stipend: `$${Math.floor(Math.random() * 4 + 1) * 1000}/month`,
                duration: `${Math.floor(Math.random() * 5 + 1)} months`,
                requiredSkills: 'React, Node.js, Python',
            } : {}),
            isActive: true,
        }).returning();
        createdPrograms.push(program);
    }
    console.log(`Created ${createdPrograms.length} programs.`);


    // 3. Create Custom Fields
    console.log('Creating custom fields...');
    const sampleFields = [];
    for (const program of createdPrograms) {
        // Add 1-2 fields per program
        const [field1] = await db.insert(customFields).values({
            programId: program.id,
            label: 'Why do you want to join?',
            fieldType: 'textarea',
            isRequired: true,
            orderIndex: 0,
        }).returning();
        sampleFields.push(field1);

        if (Math.random() > 0.5) {
            const [field2] = await db.insert(customFields).values({
                programId: program.id,
                label: 'Portfolio / GitHub URL',
                fieldType: 'url',
                isRequired: false,
                orderIndex: 1,
            }).returning();
            sampleFields.push(field2);
        }
    }


    // 4. Create Applications (20 Applications)
    console.log('Creating applications...');
    const createdApplications = [];

    // Shuffle users and programs to create random pairs
    for (let i = 0; i < 20; i++) {
        const user = random(createdUsers);
        const program = random(createdPrograms);

        // Avoid duplicate applications
        // (In a real seed script we might check db, here we just try-catch or ignore)

        const [app] = await db.insert(applications).values({
            userId: user.id,
            programId: program.id,
            status: random(['pending', 'accepted', 'rejected', 'completed']),
            appliedAt: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 10)),
        }).returning();
        createdApplications.push(app);

        // 5. Create Application Responses for this app
        const programFields = sampleFields.filter(f => f.programId === program.id);
        for (const field of programFields) {
            await db.insert(applicationResponses).values({
                applicationId: app.id,
                customFieldId: field.id,
                responseValue: field.fieldType === 'url' ? 'https://github.com/example' : 'I am very excited to join!',
            });
        }
    }
    console.log(`Created ${createdApplications.length} applications.`);

    console.log('✅ Extended seeding complete!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
