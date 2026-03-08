CREATE TABLE "question_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"chapter_id" varchar(50),
	"question_ids" jsonb NOT NULL,
	"total_questions" integer NOT NULL,
	"total_points" integer DEFAULT 100,
	"time_limit" integer,
	"difficulty_distribution" jsonb,
	"generated_by" varchar(50) DEFAULT 'manual',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "uploaded_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"chapter_id" varchar(50),
	"file_name" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" integer NOT NULL,
	"file_url" text,
	"status" varchar(20) DEFAULT 'pending',
	"parse_result" jsonb,
	"extracted_questions_count" integer DEFAULT 0,
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "tags" SET DATA TYPE jsonb USING to_jsonb(tags);--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "tags" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "created_by" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "created_by" SET DATA TYPE integer USING CASE WHEN created_by = 'manual' THEN NULL WHEN created_by = 'ai' THEN NULL ELSE created_by::integer END;--> statement-breakpoint
ALTER TABLE "user_answers" ALTER COLUMN "is_correct" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "options" jsonb;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "source" varchar(50) DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "source_document_id" integer;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "estimated_time" integer DEFAULT 300;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "usage_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "correct_rate" real;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "status" varchar(20) DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "reviewed_by" integer;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "reviewed_at" timestamp;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_answers" ADD COLUMN "question_set_id" integer;--> statement-breakpoint
ALTER TABLE "user_answers" ADD COLUMN "score" real;--> statement-breakpoint
ALTER TABLE "user_answers" ADD COLUMN "ai_feedback" jsonb;--> statement-breakpoint
ALTER TABLE "user_answers" ADD COLUMN "ai_score" real;--> statement-breakpoint
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;