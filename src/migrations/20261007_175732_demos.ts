import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_demo_bookings_business" AS ENUM('booking', 'salon', 'restaurant');
  CREATE TYPE "public"."enum_demo_bookings_service" AS ENUM('signature-facial', 'deep-tissue-massage', 'hair-spa', 'skin-consultation', 'velvet-haircut', 'velvet-colour', 'velvet-keratin', 'velvet-facial', 'velvet-mani-pedi', 'velvet-bridal', 'table-2', 'table-4', 'table-6', 'table-8');
  CREATE TYPE "public"."enum_demo_bookings_status" AS ENUM('requested', 'confirmed', 'cancelled');
  CREATE TYPE "public"."enum_demo_leads_business" AS ENUM('ai-business');
  CREATE TYPE "public"."enum_demo_leads_status" AS ENUM('new', 'contacted', 'won', 'lost');
  CREATE TABLE "demo_bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"business" "enum_demo_bookings_business" DEFAULT 'booking' NOT NULL,
  	"service" "enum_demo_bookings_service" NOT NULL,
  	"date" varchar NOT NULL,
  	"time" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"notes" varchar,
  	"status" "enum_demo_bookings_status" DEFAULT 'requested' NOT NULL,
  	"reference" varchar NOT NULL,
  	"visitor_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "demo_leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"business" "enum_demo_leads_business" DEFAULT 'ai-business' NOT NULL,
  	"interest" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"transcript" jsonb,
  	"status" "enum_demo_leads_status" DEFAULT 'new' NOT NULL,
  	"reference" varchar NOT NULL,
  	"visitor_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "demo_bookings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "demo_leads_id" integer;
  CREATE INDEX "demo_bookings_business_idx" ON "demo_bookings" USING btree ("business");
  CREATE INDEX "demo_bookings_date_idx" ON "demo_bookings" USING btree ("date");
  CREATE UNIQUE INDEX "demo_bookings_reference_idx" ON "demo_bookings" USING btree ("reference");
  CREATE INDEX "demo_bookings_visitor_id_idx" ON "demo_bookings" USING btree ("visitor_id");
  CREATE INDEX "demo_bookings_updated_at_idx" ON "demo_bookings" USING btree ("updated_at");
  CREATE INDEX "demo_bookings_created_at_idx" ON "demo_bookings" USING btree ("created_at");
  CREATE UNIQUE INDEX "business_date_time_idx" ON "demo_bookings" USING btree ("business","date","time");
  CREATE UNIQUE INDEX "demo_leads_reference_idx" ON "demo_leads" USING btree ("reference");
  CREATE INDEX "demo_leads_visitor_id_idx" ON "demo_leads" USING btree ("visitor_id");
  CREATE INDEX "demo_leads_updated_at_idx" ON "demo_leads" USING btree ("updated_at");
  CREATE INDEX "demo_leads_created_at_idx" ON "demo_leads" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_demo_bookings_fk" FOREIGN KEY ("demo_bookings_id") REFERENCES "public"."demo_bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_demo_leads_fk" FOREIGN KEY ("demo_leads_id") REFERENCES "public"."demo_leads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_demo_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("demo_bookings_id");
  CREATE INDEX "payload_locked_documents_rels_demo_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("demo_leads_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "demo_bookings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "demo_leads" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "demo_bookings" CASCADE;
  DROP TABLE "demo_leads" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_demo_bookings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_demo_leads_fk";
  
  DROP INDEX "payload_locked_documents_rels_demo_bookings_id_idx";
  DROP INDEX "payload_locked_documents_rels_demo_leads_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "demo_bookings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "demo_leads_id";
  DROP TYPE "public"."enum_demo_bookings_business";
  DROP TYPE "public"."enum_demo_bookings_service";
  DROP TYPE "public"."enum_demo_bookings_status";
  DROP TYPE "public"."enum_demo_leads_business";
  DROP TYPE "public"."enum_demo_leads_status";`)
}
