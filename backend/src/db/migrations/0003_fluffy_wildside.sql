ALTER TABLE "chat_contexts" ALTER COLUMN "relevance_score" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "chat_contexts" ALTER COLUMN "relevance_score" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");