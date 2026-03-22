CREATE TYPE "public"."code_language" AS ENUM('javascript', 'typescript', 'sql', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'other');--> statement-breakpoint
CREATE TYPE "public"."finding_severity" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TYPE "public"."roast_verdict" AS ENUM('needs_serious_help', 'rough', 'salvageable', 'clean');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "roast_findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"severity" "finding_severity" NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roast_suggested_fixes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"original_file_name" varchar(120),
	"suggested_file_name" varchar(120),
	"diff_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roast_suggested_fixes_roast_id_unique" UNIQUE("roast_id")
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"score" numeric(3, 1) NOT NULL,
	"verdict" "roast_verdict" NOT NULL,
	"headline" text NOT NULL,
	"summary" text,
	"provider_key" varchar(64) NOT NULL,
	"model" varchar(128),
	"provider_request_id" varchar(191),
	"provider_metadata" jsonb,
	"tokens_used" integer,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roasts_submission_id_unique" UNIQUE("submission_id"),
	CONSTRAINT "roasts_score_range_check" CHECK ("roasts"."score" >= 0.0 and "roasts"."score" <= 10.0)
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_id" varchar(32) NOT NULL,
	"source_code" text NOT NULL,
	"language" "code_language" NOT NULL,
	"roast_mode" boolean DEFAULT true NOT NULL,
	"line_count" integer NOT NULL,
	"char_count" integer NOT NULL,
	"status" "submission_status" DEFAULT 'pending' NOT NULL,
	"source_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submissions_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "roast_findings" ADD CONSTRAINT "roast_findings_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roast_suggested_fixes" ADD CONSTRAINT "roast_suggested_fixes_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roasts" ADD CONSTRAINT "roasts_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;