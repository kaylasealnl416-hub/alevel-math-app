CREATE TABLE "ai_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"messages" jsonb NOT NULL,
	"context" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

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

CREATE TABLE "units" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"subject_id" varchar(50) NOT NULL,
	"title" jsonb NOT NULL,
	"subtitle" jsonb,
	"color" varchar(20),
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "user_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"user_answer" jsonb NOT NULL,
	"is_correct" boolean NOT NULL,
	"time_spent" integer,
	"created_at" timestamp DEFAULT now()
);

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

ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "questions" ADD CONSTRAINT "questions_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "units" ADD CONSTRAINT "units_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"selected_subjects" jsonb DEFAULT '[]'::jsonb,
	"study_goals" text,
	"weekly_study_hours" integer,
	"preferred_study_time" varchar(20),
	"notification_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);

CREATE TABLE "user_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_study_time" integer DEFAULT 0,
	"total_chapters_completed" integer DEFAULT 0,
	"total_questions_answered" integer DEFAULT 0,
	"correct_answers_count" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_study_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);

ALTER TABLE "learning_progress" ADD COLUMN "completed_at" timestamp;
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
CREATE TABLE "chat_contexts" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"context_type" varchar(50) NOT NULL,
	"context_data" jsonb NOT NULL,
	"relevance_score" real DEFAULT 1.0,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"content_type" varchar(20) DEFAULT 'text',
	"metadata" jsonb,
	"tokens_used" integer,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"chapter_id" varchar(50),
	"title" varchar(200),
	"session_type" varchar(20) DEFAULT 'learning' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"message_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_message_at" timestamp
);

CREATE TABLE "user_knowledge_graph" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"knowledge_point_id" varchar(100) NOT NULL,
	"mastery_level" integer DEFAULT 0,
	"last_practiced_at" timestamp,
	"practice_count" integer DEFAULT 0,
	"correct_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

ALTER TABLE "chat_contexts" ADD CONSTRAINT "chat_contexts_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "user_knowledge_graph" ADD CONSTRAINT "user_knowledge_graph_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "chat_contexts" ALTER COLUMN "relevance_score" SET DATA TYPE real;
ALTER TABLE "chat_contexts" ALTER COLUMN "relevance_score" SET DEFAULT 1;
ALTER TABLE "users" ADD COLUMN "password" varchar(255);
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
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

ALTER TABLE "questions" ALTER COLUMN "tags" SET DATA TYPE jsonb USING to_jsonb(tags);
ALTER TABLE "questions" ALTER COLUMN "tags" SET DEFAULT '[]'::jsonb;
ALTER TABLE "questions" ALTER COLUMN "created_by" DROP DEFAULT;
ALTER TABLE "questions" ALTER COLUMN "created_by" SET DATA TYPE integer USING CASE WHEN created_by = 'manual' THEN NULL WHEN created_by = 'ai' THEN NULL ELSE created_by::integer END;
ALTER TABLE "user_answers" ALTER COLUMN "is_correct" DROP NOT NULL;
ALTER TABLE "questions" ADD COLUMN "options" jsonb;
ALTER TABLE "questions" ADD COLUMN "source" varchar(50) DEFAULT 'manual';
ALTER TABLE "questions" ADD COLUMN "source_document_id" integer;
ALTER TABLE "questions" ADD COLUMN "estimated_time" integer DEFAULT 300;
ALTER TABLE "questions" ADD COLUMN "usage_count" integer DEFAULT 0;
ALTER TABLE "questions" ADD COLUMN "correct_rate" real;
ALTER TABLE "questions" ADD COLUMN "status" varchar(20) DEFAULT 'draft';
ALTER TABLE "questions" ADD COLUMN "reviewed_by" integer;
ALTER TABLE "questions" ADD COLUMN "reviewed_at" timestamp;
ALTER TABLE "questions" ADD COLUMN "updated_at" timestamp DEFAULT now();
ALTER TABLE "user_answers" ADD COLUMN "question_set_id" integer;
ALTER TABLE "user_answers" ADD COLUMN "score" real;
ALTER TABLE "user_answers" ADD COLUMN "ai_feedback" jsonb;
ALTER TABLE "user_answers" ADD COLUMN "ai_score" real;
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;
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

ALTER TABLE "exam_question_results" ADD CONSTRAINT "exam_question_results_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "exam_question_results" ADD CONSTRAINT "exam_question_results_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "exams" ADD CONSTRAINT "exams_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "exams" ADD CONSTRAINT "exams_question_set_id_question_sets_id_fk" FOREIGN KEY ("question_set_id") REFERENCES "public"."question_sets"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "learning_recommendations" ADD CONSTRAINT "learning_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "learning_recommendations" ADD CONSTRAINT "learning_recommendations_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "learning_recommendations" ADD CONSTRAINT "learning_recommendations_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "users" ADD COLUMN "google_id" varchar(255);
ALTER TABLE "users" ADD CONSTRAINT "users_google_id_unique" UNIQUE("google_id");
