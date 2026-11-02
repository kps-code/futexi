import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_events_name" ADD VALUE 'assistant_open';
  ALTER TYPE "public"."enum_events_name" ADD VALUE 'assistant_message';
  CREATE TABLE "assistant_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "assistant" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"name" varchar DEFAULT 'KAPOSA Assistant',
  	"welcome" varchar DEFAULT 'Hi! Ask us anything about websites, demos or pricing. Tanglish-um ok.',
  	"extra_notes" varchar DEFAULT '',
  	"daily_cap" numeric DEFAULT 300,
  	"per_chat_max" numeric DEFAULT 20,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "roles" ADD COLUMN "areas_assistant" "enum_roles_level" DEFAULT 'none';
  ALTER TABLE "assistant_chips" ADD CONSTRAINT "assistant_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."assistant"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "assistant_chips_order_idx" ON "assistant_chips" USING btree ("_order");
  CREATE INDEX "assistant_chips_parent_id_idx" ON "assistant_chips" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "assistant_chips" CASCADE;
  DROP TABLE "assistant" CASCADE;
  ALTER TABLE "events" ALTER COLUMN "name" SET DATA TYPE text;
  DROP TYPE "public"."enum_events_name";
  CREATE TYPE "public"."enum_events_name" AS ENUM('cta_click', 'whatsapp_click', 'demo_open', 'demo_filter', 'ai_demo_chip', 'theme_toggle', 'form_start', 'form_submit', 'form_error', 'outbound_click');
  ALTER TABLE "events" ALTER COLUMN "name" SET DATA TYPE "public"."enum_events_name" USING "name"::"public"."enum_events_name";
  ALTER TABLE "roles" DROP COLUMN "areas_assistant";`)
}
