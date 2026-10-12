import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_faqs_placement" AS ENUM('home', 'contact', 'hidden');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('bot', 'calendar', 'check', 'code', 'globe', 'hammer', 'layout', 'lightbulb', 'megaphone', 'message', 'pen', 'plug', 'rocket', 'search', 'smartphone', 'sparkles', 'users', 'workflow', 'zap');
  CREATE TYPE "public"."enum_services_contact_type" AS ENUM('website', 'landing', 'booking', 'ai', 'automation', 'app', 'software');
  CREATE TYPE "public"."enum_home_page_how_we_work_steps_icon" AS ENUM('bot', 'calendar', 'check', 'code', 'globe', 'hammer', 'layout', 'lightbulb', 'megaphone', 'message', 'pen', 'plug', 'rocket', 'search', 'smartphone', 'sparkles', 'users', 'workflow', 'zap');
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"placement" "enum_faqs_placement" DEFAULT 'contact' NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"business" varchar,
  	"feedback_link" varchar,
  	"token" varchar,
  	"quote" varchar,
  	"rating" numeric DEFAULT 5,
  	"photo_id" integer,
  	"submitted_at" timestamp(3) with time zone,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"visible" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" "enum_services_icon" DEFAULT 'globe' NOT NULL,
  	"contact_type" "enum_services_contact_type" DEFAULT 'website' NOT NULL,
  	"outcome" varchar NOT NULL,
  	"home_line" varchar,
  	"good_for" varchar,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "home_page_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_how_we_work_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_home_page_how_we_work_steps_icon" DEFAULT 'check' NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading_line1" varchar DEFAULT 'Your Ideas. Our Technology.' NOT NULL,
  	"hero_heading_line2" varchar DEFAULT 'Built for What''s Next.' NOT NULL,
  	"hero_sub" varchar DEFAULT 'We design and build modern websites, AI-powered experiences, automation solutions and digital products for businesses ready for the next generation.' NOT NULL,
  	"hero_primary_label" varchar DEFAULT 'Explore Our Work' NOT NULL,
  	"hero_secondary_label" varchar DEFAULT 'Start Your Project' NOT NULL,
  	"final_cta_heading" varchar DEFAULT 'Have an Idea?' NOT NULL,
  	"final_cta_heading_accent" varchar DEFAULT 'Let''s Build It.',
  	"final_cta_sub" varchar DEFAULT 'Tell us what you''re trying to build. We''ll help you find the right digital solution.' NOT NULL,
  	"final_cta_primary_label" varchar DEFAULT 'Start a Project' NOT NULL,
  	"final_cta_whatsapp_label" varchar DEFAULT 'WhatsApp Us' NOT NULL,
  	"technology_heading" varchar DEFAULT 'Modern Technology. Built for Tomorrow.' NOT NULL,
  	"technology_line" varchar DEFAULT 'You do not need to know the stack. You just need it to work. This is what we build with.',
  	"why_us_heading" varchar DEFAULT 'Why Build With Us?' NOT NULL,
  	"how_we_work_heading" varchar DEFAULT 'From Idea to Launch' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "ai_demo_conversations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"chip" varchar NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "ai_demo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Digital Solutions Built Around Your Business' NOT NULL,
  	"sub" varchar DEFAULT 'Pick what you need today. Add more as you grow.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_pages_privacy_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "legal_pages_terms_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"privacy_title" varchar DEFAULT 'Privacy Policy' NOT NULL,
  	"privacy_updated_on" timestamp(3) with time zone DEFAULT '2026-10-07',
  	"privacy_intro" varchar DEFAULT 'How {brand} handles information on this website.',
  	"terms_title" varchar DEFAULT 'Terms' NOT NULL,
  	"terms_updated_on" timestamp(3) with time zone DEFAULT '2026-10-07',
  	"terms_intro" varchar DEFAULT 'Plain-language terms for using this website and working with {brand}.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "city" varchar DEFAULT 'Chennai';
  ALTER TABLE "site_settings" ADD COLUMN "region" varchar DEFAULT 'Tamil Nadu';
  ALTER TABLE "site_settings" ADD COLUMN "service_area_text" varchar DEFAULT 'Serving businesses across India';
  ALTER TABLE "site_settings" ADD COLUMN "whatsapp_message" varchar DEFAULT 'Hi KAPOSA FUTEXI, I''m interested in building a website for my business.';
  ALTER TABLE "site_settings" ADD COLUMN "seo_description" varchar DEFAULT 'We Build Digital Experiences That Move Businesses Forward.';
  ALTER TABLE "site_settings" ADD COLUMN "og_image_id" integer;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_texts" ADD CONSTRAINT "services_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_why_us_cards" ADD CONSTRAINT "home_page_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_how_we_work_steps" ADD CONSTRAINT "home_page_how_we_work_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_texts" ADD CONSTRAINT "home_page_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ai_demo_conversations" ADD CONSTRAINT "ai_demo_conversations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ai_demo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_privacy_sections" ADD CONSTRAINT "legal_pages_privacy_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_terms_sections" ADD CONSTRAINT "legal_pages_terms_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "testimonials_token_idx" ON "testimonials" USING btree ("token");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_texts_order_parent" ON "services_texts" USING btree ("order","parent_id");
  CREATE INDEX "home_page_why_us_cards_order_idx" ON "home_page_why_us_cards" USING btree ("_order");
  CREATE INDEX "home_page_why_us_cards_parent_id_idx" ON "home_page_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_how_we_work_steps_order_idx" ON "home_page_how_we_work_steps" USING btree ("_order");
  CREATE INDEX "home_page_how_we_work_steps_parent_id_idx" ON "home_page_how_we_work_steps" USING btree ("_parent_id");
  CREATE INDEX "home_page_texts_order_parent" ON "home_page_texts" USING btree ("order","parent_id");
  CREATE INDEX "ai_demo_conversations_order_idx" ON "ai_demo_conversations" USING btree ("_order");
  CREATE INDEX "ai_demo_conversations_parent_id_idx" ON "ai_demo_conversations" USING btree ("_parent_id");
  CREATE INDEX "legal_pages_privacy_sections_order_idx" ON "legal_pages_privacy_sections" USING btree ("_order");
  CREATE INDEX "legal_pages_privacy_sections_parent_id_idx" ON "legal_pages_privacy_sections" USING btree ("_parent_id");
  CREATE INDEX "legal_pages_terms_sections_order_idx" ON "legal_pages_terms_sections" USING btree ("_order");
  CREATE INDEX "legal_pages_terms_sections_parent_id_idx" ON "legal_pages_terms_sections" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_why_us_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_how_we_work_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ai_demo_conversations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ai_demo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal_pages_privacy_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal_pages_terms_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal_pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_texts" CASCADE;
  DROP TABLE "home_page_why_us_cards" CASCADE;
  DROP TABLE "home_page_how_we_work_steps" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_texts" CASCADE;
  DROP TABLE "ai_demo_conversations" CASCADE;
  DROP TABLE "ai_demo" CASCADE;
  DROP TABLE "services_page" CASCADE;
  DROP TABLE "legal_pages_privacy_sections" CASCADE;
  DROP TABLE "legal_pages_terms_sections" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faqs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_og_image_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_faqs_id_idx";
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "site_settings_og_image_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faqs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "site_settings" DROP COLUMN "city";
  ALTER TABLE "site_settings" DROP COLUMN "region";
  ALTER TABLE "site_settings" DROP COLUMN "service_area_text";
  ALTER TABLE "site_settings" DROP COLUMN "whatsapp_message";
  ALTER TABLE "site_settings" DROP COLUMN "seo_description";
  ALTER TABLE "site_settings" DROP COLUMN "og_image_id";
  DROP TYPE "public"."enum_faqs_placement";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_services_contact_type";
  DROP TYPE "public"."enum_home_page_how_we_work_steps_icon";`)
}
