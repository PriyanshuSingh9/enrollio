import { pgTable, serial, text, varchar, timestamp, boolean, integer, pgEnum, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['user', 'admin']);
export const programTypeEnum = pgEnum('program_type', ['event', 'internship']);
export const modeEnum = pgEnum('mode', ['online', 'offline', 'hybrid']);
export const statusEnum = pgEnum('status', ['pending', 'accepted', 'rejected', 'completed']);
export const fieldTypeEnum = pgEnum('field_type', ['text', 'textarea', 'url', 'file', 'select']);

// Users Table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 150 }).notNull().unique(),
    role: roleEnum('role').default('user').notNull(),
    profilePhoto: varchar('profile_photo', { length: 255 }),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Programs Table (Events & Internships)
export const programs = pgTable('programs', {
    id: serial('id').primaryKey(),
    adminId: integer('admin_id').references(() => users.id).notNull(),
    type: programTypeEnum('type').notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description').notNull(),
    category: varchar('category', { length: 100 }),
    location: varchar('location', { length: 200 }),
    mode: modeEnum('mode').notNull(),
    deadline: timestamp('deadline').notNull(),
    startDate: date('start_date'),
    endDate: date('end_date'),
    stipend: varchar('stipend', { length: 100 }), // Internships only
    duration: varchar('duration', { length: 100 }), // Internships only
    requiredSkills: text('required_skills'), // Internships only
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Custom Fields Table
export const customFields = pgTable('custom_fields', {
    id: serial('id').primaryKey(),
    programId: integer('program_id').references(() => programs.id).notNull(),
    label: varchar('label', { length: 200 }).notNull(),
    fieldType: fieldTypeEnum('field_type').notNull(),
    options: text('options'), // JSON array stringified for select type
    isRequired: boolean('is_required').default(true).notNull(),
    stepNumber: integer('step_number').default(3).notNull(),
    orderIndex: integer('order_index').default(0).notNull(),
});

// Applications Table
export const applications = pgTable('applications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    programId: integer('program_id').references(() => programs.id).notNull(),
    status: statusEnum('status').notNull().default('pending'),
    appliedAt: timestamp('applied_at').defaultNow().notNull(),
    reviewedAt: timestamp('reviewed_at'),
    // certificateUrl: varchar('certificate_url', { length: 255 }),
    certificateIssuedAt: timestamp('certificate_issued_at'),
});

// Application Responses Table
export const applicationResponses = pgTable('application_responses', {
    id: serial('id').primaryKey(),
    applicationId: integer('application_id').references(() => applications.id).notNull(),
    customFieldId: integer('custom_field_id').references(() => customFields.id).notNull(),
    responseValue: text('response_value'),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    programs: many(programs),
    applications: many(applications),
}));

export const programsRelations = relations(programs, ({ one, many }) => ({
    admin: one(users, {
        fields: [programs.adminId],
        references: [users.id],
    }),
    customFields: many(customFields),
    applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
    user: one(users, {
        fields: [applications.userId],
        references: [users.id],
    }),
    program: one(programs, {
        fields: [applications.programId],
        references: [programs.id],
    }),
    responses: many(applicationResponses),
}));

export const customFieldsRelations = relations(customFields, ({ one }) => ({
    program: one(programs, {
        fields: [customFields.programId],
        references: [programs.id],
    }),
}));

export const applicationResponsesRelations = relations(applicationResponses, ({ one }) => ({
    application: one(applications, {
        fields: [applicationResponses.applicationId],
        references: [applications.id],
    }),
    customField: one(customFields, {
        fields: [applicationResponses.customFieldId],
        references: [customFields.id],
    }),
}));