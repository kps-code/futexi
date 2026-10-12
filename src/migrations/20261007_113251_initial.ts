import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_leads_need" AS ENUM('Website', 'Landing Page', 'Booking Website', 'AI Integration', 'Automation', 'Web Application', 'Mobile App', 'Custom Software', 'Other');
  CREATE TYPE "public"."enum_leads_budget" AS ENUM('Under ₹10,000', '₹10,000 to ₹25,000', '₹25,000 to ₹50,000', 'Above ₹50,000', 'Not sure yet');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'lost');
  CREATE TYPE "public"."enum_api_logs_kind" AS ENUM('route', 'action', 'payload');
  CREATE TYPE "public"."enum_visitors_device" AS ENUM('desktop', 'mobile', 'tablet');
  CREATE TYPE "public"."enum_sessions_device" AS ENUM('desktop', 'mobile', 'tablet');
  CREATE TYPE "public"."enum_page_views_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_events_name" AS ENUM('cta_click', 'whatsapp_click', 'demo_open', 'demo_filter', 'ai_demo_chip', 'theme_toggle', 'form_start', 'form_submit', 'form_error', 'outbound_click');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"photo_id" integer,
  	"linkedin" varchar,
  	"github" varchar,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"business_name" varchar,
  	"email" varchar NOT NULL,
  	"whatsapp" varchar NOT NULL,
  	"business_type" varchar,
  	"need" "enum_leads_need" NOT NULL,
  	"budget" "enum_leads_budget",
  	"details" varchar,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"notes" varchar,
  	"visitor_id" varchar,
  	"source_utm_source" varchar,
  	"source_utm_medium" varchar,
  	"source_utm_campaign" varchar,
  	"source_referrer" varchar,
  	"source_landing_path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "api_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"request_id" varchar NOT NULL,
  	"kind" "enum_api_logs_kind" NOT NULL,
  	"name" varchar NOT NULL,
  	"method" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"status" numeric NOT NULL,
  	"duration_ms" numeric NOT NULL,
  	"visitor_id" varchar,
  	"user_id" integer,
  	"ip_hash" varchar,
  	"country" varchar,
  	"city" varchar,
  	"user_agent" varchar,
  	"referer" varchar,
  	"input_summary" jsonb,
  	"error_code" varchar,
  	"error_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "visitors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visitor_id" varchar NOT NULL,
  	"first_seen" timestamp(3) with time zone NOT NULL,
  	"last_seen" timestamp(3) with time zone NOT NULL,
  	"visits_count" numeric DEFAULT 1 NOT NULL,
  	"first_referrer" varchar,
  	"first_landing_path" varchar,
  	"first_utm_source" varchar,
  	"first_utm_medium" varchar,
  	"first_utm_campaign" varchar,
  	"device" "enum_visitors_device",
  	"browser" varchar,
  	"os" varchar,
  	"country" varchar,
  	"city" varchar,
  	"lead_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar NOT NULL,
  	"visitor_id" varchar NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"ended_at" timestamp(3) with time zone NOT NULL,
  	"duration_ms" numeric DEFAULT 0 NOT NULL,
  	"page_count" numeric DEFAULT 0 NOT NULL,
  	"landing_path" varchar NOT NULL,
  	"exit_path" varchar,
  	"referrer" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"device" "enum_sessions_device",
  	"country" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "page_views" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visitor_id" varchar NOT NULL,
  	"session_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"title" varchar,
  	"referrer" varchar,
  	"duration_ms" numeric,
  	"max_scroll_pct" numeric,
  	"theme" "enum_page_views_theme",
  	"viewport_width" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visitor_id" varchar NOT NULL,
  	"session_id" varchar NOT NULL,
  	"name" "enum_events_name" NOT NULL,
  	"path" varchar NOT NULL,
  	"props" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"team_members_id" integer,
  	"leads_id" integer,
  	"api_logs_id" integer,
  	"visitors_id" integer,
  	"sessions_id" integer,
  	"page_views_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar DEFAULT '+91 88836 73422' NOT NULL,
  	"whatsapp_number" varchar DEFAULT '918883673422' NOT NULL,
  	"email" varchar DEFAULT 'kpsankar1398kp@gmail.com' NOT NULL,
  	"reply_time_text" varchar DEFAULT 'We reply within one working day.',
  	"instagram" varchar,
  	"linkedin" varchar DEFAULT 'https://www.linkedin.com/in/sankaralingamk1398',
  	"github" varchar,
  	"tagline" varchar DEFAULT 'We Build Digital Experiences That Move Businesses Forward.' NOT NULL,
  	"starting_price_text" varchar DEFAULT 'Projects start from ₹5,000' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Three Builders. One Vision.' NOT NULL,
  	"intro" varchar DEFAULT 'We are a small technology team focused on building modern websites, AI-powered experiences, automation solutions and digital products. We work directly with every client, from the first call to launch and beyond.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members_texts" ADD CONSTRAINT "team_members_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "api_logs" ADD CONSTRAINT "api_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "visitors" ADD CONSTRAINT "visitors_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_api_logs_fk" FOREIGN KEY ("api_logs_id") REFERENCES "public"."api_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visitors_fk" FOREIGN KEY ("visitors_id") REFERENCES "public"."visitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_views_fk" FOREIGN KEY ("page_views_id") REFERENCES "public"."page_views"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_texts" ADD CONSTRAINT "about_page_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "team_members_texts_order_parent" ON "team_members_texts" USING btree ("order","parent_id");
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_visitor_id_idx" ON "leads" USING btree ("visitor_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "api_logs_request_id_idx" ON "api_logs" USING btree ("request_id");
  CREATE INDEX "api_logs_name_idx" ON "api_logs" USING btree ("name");
  CREATE INDEX "api_logs_path_idx" ON "api_logs" USING btree ("path");
  CREATE INDEX "api_logs_status_idx" ON "api_logs" USING btree ("status");
  CREATE INDEX "api_logs_visitor_id_idx" ON "api_logs" USING btree ("visitor_id");
  CREATE INDEX "api_logs_user_idx" ON "api_logs" USING btree ("user_id");
  CREATE INDEX "api_logs_updated_at_idx" ON "api_logs" USING btree ("updated_at");
  CREATE INDEX "api_logs_created_at_idx" ON "api_logs" USING btree ("created_at");
  CREATE INDEX "name_createdAt_idx" ON "api_logs" USING btree ("name","created_at");
  CREATE INDEX "status_createdAt_idx" ON "api_logs" USING btree ("status","created_at");
  CREATE UNIQUE INDEX "visitors_visitor_id_idx" ON "visitors" USING btree ("visitor_id");
  CREATE INDEX "visitors_last_seen_idx" ON "visitors" USING btree ("last_seen");
  CREATE INDEX "visitors_country_idx" ON "visitors" USING btree ("country");
  CREATE INDEX "visitors_lead_idx" ON "visitors" USING btree ("lead_id");
  CREATE INDEX "visitors_updated_at_idx" ON "visitors" USING btree ("updated_at");
  CREATE INDEX "visitors_created_at_idx" ON "visitors" USING btree ("created_at");
  CREATE UNIQUE INDEX "sessions_session_id_idx" ON "sessions" USING btree ("session_id");
  CREATE INDEX "sessions_visitor_id_idx" ON "sessions" USING btree ("visitor_id");
  CREATE INDEX "sessions_started_at_idx" ON "sessions" USING btree ("started_at");
  CREATE INDEX "sessions_updated_at_idx" ON "sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_created_at_idx" ON "sessions" USING btree ("created_at");
  CREATE INDEX "visitorId_startedAt_idx" ON "sessions" USING btree ("visitor_id","started_at");
  CREATE INDEX "page_views_visitor_id_idx" ON "page_views" USING btree ("visitor_id");
  CREATE INDEX "page_views_session_id_idx" ON "page_views" USING btree ("session_id");
  CREATE INDEX "page_views_path_idx" ON "page_views" USING btree ("path");
  CREATE INDEX "page_views_updated_at_idx" ON "page_views" USING btree ("updated_at");
  CREATE INDEX "page_views_created_at_idx" ON "page_views" USING btree ("created_at");
  CREATE INDEX "visitorId_createdAt_idx" ON "page_views" USING btree ("visitor_id","created_at");
  CREATE INDEX "path_createdAt_idx" ON "page_views" USING btree ("path","created_at");
  CREATE INDEX "events_visitor_id_idx" ON "events" USING btree ("visitor_id");
  CREATE INDEX "events_session_id_idx" ON "events" USING btree ("session_id");
  CREATE INDEX "events_name_idx" ON "events" USING btree ("name");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "name_createdAt_1_idx" ON "events" USING btree ("name","created_at");
  CREATE INDEX "visitorId_createdAt_1_idx" ON "events" USING btree ("visitor_id","created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_api_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("api_logs_id");
  CREATE INDEX "payload_locked_documents_rels_visitors_id_idx" ON "payload_locked_documents_rels" USING btree ("visitors_id");
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX "payload_locked_documents_rels_page_views_id_idx" ON "payload_locked_documents_rels" USING btree ("page_views_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "about_page_texts_order_parent" ON "about_page_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "team_members_texts" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "api_logs" CASCADE;
  DROP TABLE "visitors" CASCADE;
  DROP TABLE "sessions" CASCADE;
  DROP TABLE "page_views" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_texts" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_leads_need";
  DROP TYPE "public"."enum_leads_budget";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_api_logs_kind";
  DROP TYPE "public"."enum_visitors_device";
  DROP TYPE "public"."enum_sessions_device";
  DROP TYPE "public"."enum_page_views_theme";
  DROP TYPE "public"."enum_events_name";`)
}
