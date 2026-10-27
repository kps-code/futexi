import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Featured on Home moves from a multi-select to an ordered array (drag to reorder). Step 1 of 2:
 * keep the current order in a backup table, drop the select table. Also adds the two salon
 * services (men's cut, beard) to the bookings enum; they were added to the demo on 2026-10-23
 * without a migration.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_demo_bookings_service" ADD VALUE 'velvet-mens-cut' BEFORE 'velvet-facial';
  ALTER TYPE "public"."enum_demo_bookings_service" ADD VALUE 'velvet-beard' BEFORE 'velvet-facial';
  CREATE TABLE "demo_settings_featured_backup" AS SELECT "order" AS "_order", "parent_id" AS "_parent_id", "value"::text AS "demo" FROM "demo_settings_featured";
  DROP TABLE "demo_settings_featured" CASCADE;
  DROP TYPE "public"."enum_demo_settings_featured";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_demo_settings_featured" AS ENUM('booking', 'salon', 'restaurant', 'interior', 'tuition', 'before-after', 'ai-business');
  CREATE TABLE "demo_settings_featured" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_demo_settings_featured",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "demo_bookings" ALTER COLUMN "service" SET DATA TYPE text;
  DROP TYPE "public"."enum_demo_bookings_service";
  CREATE TYPE "public"."enum_demo_bookings_service" AS ENUM('signature-facial', 'deep-tissue-massage', 'hair-spa', 'skin-consultation', 'velvet-haircut', 'velvet-colour', 'velvet-keratin', 'velvet-facial', 'velvet-mani-pedi', 'velvet-bridal', 'table-2', 'table-4', 'table-6', 'table-8');
  ALTER TABLE "demo_bookings" ALTER COLUMN "service" SET DATA TYPE "public"."enum_demo_bookings_service" USING "service"::"public"."enum_demo_bookings_service";
  ALTER TABLE "demo_settings_featured" ADD CONSTRAINT "demo_settings_featured_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."demo_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "demo_settings_featured_order_idx" ON "demo_settings_featured" USING btree ("order");
  CREATE INDEX "demo_settings_featured_parent_idx" ON "demo_settings_featured" USING btree ("parent_id");`)
}
