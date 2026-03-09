CREATE TABLE "exam_question_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"user_answer" jsonb NOT NULL,
	"is_correct" boolean NOT NULL,
	"score" real NOT NULL,
	"max_score" real NOT NULL,
	"time_spent" integer,
	"ai_feedback" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"question_set_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"mode" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'in_progress' NOT NULL,
	"time_limit" integer,
	"allow_review" boolean DEFAULT true,
	"answers" jsonb DEFAULT '{}' NOT NULL,
	"marked_questions" jsonb DEFAULT '[]',
	"started_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp,
	"time_spent" integer,
	"total_score" real,
	"max_score" real,
	"correct_count" integer,
	"total_count" integer,
	"difficulty_stats" jsonb,
	"topic_stats" jsonb,
	"type_stats" jsonb,
	"ai_feedback" jsonb,
	"tab_switch_count" integer DEFAULT 0,
	"focus_lost_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learning_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"exam_id" integer,
	"type" varchar(50) NOT NULL,
	"priority" integer NOT NULL,
	"chapter_id" varchar(50),
	"video_url" text,
	"question_ids" jsonb,
	"reason" text,
	"weak_topics" jsonb,
	"status" varchar(20) DEFAULT 'pending',
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "exam_question_results" ADD CONSTRAINT "exam_question_results_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_question_results" ADD CONSTRAINT "exam_question_results_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_question_set_id_question_sets_id_fk" FOREIGN KEY ("question_set_id") REFERENCES "public"."question_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_recommendations" ADD CONSTRAINT "learning_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_recommendations" ADD CONSTRAINT "learning_recommendations_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_recommendations" ADD CONSTRAINT "learning_recommendations_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;