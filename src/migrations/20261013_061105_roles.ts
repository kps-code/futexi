import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_roles_level" AS ENUM('none', 'view', 'edit');
  CREATE TABLE "roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"is_admin" boolean DEFAULT false,
  	"areas_media" "enum_roles_level" DEFAULT 'none',
  	"areas_faqs" "enum_roles_level" DEFAULT 'none',
  	"areas_testimonials" "enum_roles_level" DEFAULT 'none',
  	"areas_services" "enum_roles_level" DEFAULT 'none',
  	"areas_about_page" "enum_roles_level" DEFAULT 'none',
  	"areas_home_page" "enum_roles_level" DEFAULT 'none',
  	"areas_ai_demo" "enum_roles_level" DEFAULT 'none',
  	"areas_services_page" "enum_roles_level" DEFAULT 'none',
  	"areas_legal_pages" "enum_roles_level" DEFAULT 'none',
  	"areas_team_members" "enum_roles_level" DEFAULT 'none',
  	"areas_site_settings" "enum_roles_level" DEFAULT 'none',
  	"areas_demo_settings" "enum_roles_level" DEFAULT 'none',
  	"areas_leads" "enum_roles_level" DEFAULT 'none',
  	"areas_demo_bookings" "enum_roles_level" DEFAULT 'none',
  	"areas_demo_leads" "enum_roles_level" DEFAULT 'none',
  	"areas_analytics" "enum_roles_level" DEFAULT 'none',
  	"areas_api_logs" "enum_roles_level" DEFAULT 'none',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
  ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "assigned_role_id" integer;
  ALTER TABLE "users" ADD COLUMN "permissions" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "roles_id" integer;
  CREATE UNIQUE INDEX "roles_name_idx" ON "roles" USING btree ("name");
  CREATE INDEX "roles_updated_at_idx" ON "roles" USING btree ("updated_at");
  CREATE INDEX "roles_created_at_idx" ON "roles" USING btree ("created_at");
  ALTER TABLE "users" ADD CONSTRAINT "users_assigned_role_id_roles_id_fk" FOREIGN KEY ("assigned_role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_roles_fk" FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_assigned_role_idx" ON "users" USING btree ("assigned_role_id");
  CREATE INDEX "payload_locked_documents_rels_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("roles_id");
  -- Built-in roles, then map every existing user: "editor" -> Editor, everyone else -> Admin.
  INSERT INTO "roles" ("name", "description", "is_admin") VALUES ('Admin', 'Full access to everything, including Users and Roles.', true);
  INSERT INTO "roles" ("name", "description", "is_admin", "areas_media", "areas_faqs", "areas_testimonials", "areas_services", "areas_about_page", "areas_home_page", "areas_ai_demo", "areas_services_page", "areas_legal_pages", "areas_team_members", "areas_site_settings", "areas_demo_settings", "areas_leads", "areas_demo_bookings", "areas_demo_leads", "areas_analytics", "areas_api_logs") VALUES ('Editor', 'Edits content, team, leads and demo enquiries. No access to users, roles or logs.', false, 'edit', 'edit', 'edit', 'edit', 'edit', 'edit', 'edit', 'edit', 'edit', 'edit', 'view', 'edit', 'edit', 'edit', 'edit', 'view', 'none');
  UPDATE "users" SET "assigned_role_id" = (SELECT "id" FROM "roles" WHERE "name" = 'Editor'), "permissions" = '{"admin":false,"areas":{"media":"edit","faqs":"edit","testimonials":"edit","services":"edit","aboutPage":"edit","homePage":"edit","aiDemo":"edit","servicesPage":"edit","legalPages":"edit","teamMembers":"edit","siteSettings":"view","demoSettings":"edit","leads":"edit","demoBookings":"edit","demoLeads":"edit","analytics":"view","apiLogs":"none"}}'::jsonb WHERE "role" = 'editor';
  UPDATE "users" SET "assigned_role_id" = (SELECT "id" FROM "roles" WHERE "name" = 'Admin'), "permissions" = '{"admin":true,"areas":{}}'::jsonb WHERE "assigned_role_id" IS NULL;
  ALTER TABLE "users" ALTER COLUMN "assigned_role_id" SET NOT NULL;
`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "roles" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_assigned_role_id_roles_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_roles_fk";
  
  DROP INDEX "users_assigned_role_idx";
  DROP INDEX "payload_locked_documents_rels_roles_id_idx";
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor';
  ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "users" DROP COLUMN "assigned_role_id";
  ALTER TABLE "users" DROP COLUMN "permissions";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "roles_id";
  DROP TYPE "public"."enum_roles_level";`)
}
