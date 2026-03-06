CREATE TABLE "ai_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"messages" jsonb NOT NULL,
	"context" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"unit_id" varchar(50) NOT NULL,
	"num" integer NOT NULL,
	"title" jsonb NOT NULL,
	"overview" jsonb,
	"key_points" jsonb,
	"formulas" jsonb,
	"examples" jsonb,
	"videos" jsonb,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "learning_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"chapter_id" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'not_started' NOT NULL,
	"mastery_level" integer DEFAULT 0,
	"time_spent" integer DEFAULT 0,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" varchar(50) NOT NULL,
	"type" varchar(20) NOT NULL,
	"difficulty" integer NOT NULL,
	"content" jsonb NOT NULL,
	"answer" jsonb NOT NULL,
	"explanation" jsonb,
	"tags" text[],
	"created_at" timestamp DEFAULT now(),
	"created_by" varchar(20) DEFAULT 'manual'
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" jsonb NOT NULL,
	"name_full" jsonb,
	"icon" varchar(10),
	"color" varchar(20),
	"bg_color" varchar(20),
	"level" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"subject_id" varchar(50) NOT NULL,
	"title" jsonb NOT NULL,
	"subtitle" jsonb,
	"color" varchar(20),
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"user_answer" jsonb NOT NULL,
	"is_correct" boolean NOT NULL,
	"time_spent" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"wechat_openid" varchar(100),
	"wechat_unionid" varchar(100),
	"nickname" varchar(100),
	"avatar" text,
	"email" varchar(255),
	"phone" varchar(20),
	"grade" varchar(20),
	"target_university" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_login_at" timestamp,
	CONSTRAINT "users_wechat_openid_unique" UNIQUE("wechat_openid")
);
--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;