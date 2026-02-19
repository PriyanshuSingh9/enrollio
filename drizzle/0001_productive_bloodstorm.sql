DROP TABLE "notifications" CASCADE;--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "certificate_url";--> statement-breakpoint
ALTER TABLE "programs" DROP COLUMN "banner_url";--> statement-breakpoint
ALTER TABLE "programs" DROP COLUMN "max_participants";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "resume_url";