import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_demo_settings_hidden" AS ENUM('booking', 'salon', 'restaurant', 'interior', 'tuition', 'before-after', 'ai-business');
  CREATE TYPE "public"."enum_demo_settings_featured" AS ENUM('booking', 'salon', 'restaurant', 'interior', 'tuition', 'before-after', 'ai-business');
  CREATE TABLE "demo_settings_hidden" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_demo_settings_hidden",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "demo_settings_featured" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_demo_settings_featured",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "demo_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "demo_settings_hidden" ADD CONSTRAINT "demo_settings_hidden_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."demo_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "demo_settings_featured" ADD CONSTRAINT "demo_settings_featured_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."demo_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "demo_settings_hidden_order_idx" ON "demo_settings_hidden" USING btree ("order");
  CREATE INDEX "demo_settings_hidden_parent_idx" ON "demo_settings_hidden" USING btree ("parent_id");
  CREATE INDEX "demo_settings_featured_order_idx" ON "demo_settings_featured" USING btree ("order");
  CREATE INDEX "demo_settings_featured_parent_idx" ON "demo_settings_featured" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "demo_settings_hidden" CASCADE;
  DROP TABLE "demo_settings_featured" CASCADE;
  DROP TABLE "demo_settings" CASCADE;
  DROP TYPE "public"."enum_demo_settings_hidden";
  DROP TYPE "public"."enum_demo_settings_featured";`)
}
