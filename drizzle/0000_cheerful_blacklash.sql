CREATE TYPE "public"."field_type" AS ENUM('text', 'textarea', 'url', 'file', 'select');--> statement-breakpoint
CREATE TYPE "public"."mode" AS ENUM('online', 'offline', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."program_type" AS ENUM('event', 'internship');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'rejected', 'completed');--> statement-breakpoint
CREATE TABLE "application_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"custom_field_id" integer NOT NULL,
	"response_value" text
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"program_id" integer NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"certificate_url" varchar(255),
	"certificate_issued_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "custom_fields" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer NOT NULL,
	"label" varchar(200) NOT NULL,
	"field_type" "field_type" NOT NULL,
	"options" text,
	"is_required" boolean DEFAULT true NOT NULL,
	"step_number" integer DEFAULT 3 NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL,
	"type" "program_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100),
	"banner_url" varchar(255),
	"location" varchar(200),
	"mode" "mode" NOT NULL,
	"max_participants" integer,
	"deadline" timestamp NOT NULL,
	"start_date" date,
	"end_date" date,
	"stipend" varchar(100),
	"duration" varchar(100),
	"required_skills" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"profile_photo" varchar(255),
	"resume_url" varchar(255),
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "application_responses" ADD CONSTRAINT "application_responses_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_responses" ADD CONSTRAINT "application_responses_custom_field_id_custom_fields_id_fk" FOREIGN KEY ("custom_field_id") REFERENCES "public"."custom_fields"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;