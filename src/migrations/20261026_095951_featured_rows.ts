import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Featured on Home, step 2 of 2: the ordered array table, filled from the backup made in step 1
 * so the admin's current order survives.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_demo_settings_featured_demo" AS ENUM('booking', 'salon', 'restaurant', 'interior', 'tuition', 'before-after', 'ai-business');
  CREATE TABLE "demo_settings_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"demo" "enum_demo_settings_featured_demo" NOT NULL
  );
  
  ALTER TABLE "demo_settings_featured" ADD CONSTRAINT "demo_settings_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."demo_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "demo_settings_featured_order_idx" ON "demo_settings_featured" USING btree ("_order");
  CREATE INDEX "demo_settings_featured_parent_id_idx" ON "demo_settings_featured" USING btree ("_parent_id");
  INSERT INTO "demo_settings_featured" ("_order", "_parent_id", "id", "demo")
    SELECT "_order", "_parent_id", gen_random_uuid()::text, "demo"::"public"."enum_demo_settings_featured_demo"
    FROM "demo_settings_featured_backup" WHERE "demo" IS NOT NULL ORDER BY "_order";
  DROP TABLE "demo_settings_featured_backup";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "demo_settings_featured" CASCADE;
  DROP TYPE "public"."enum_demo_settings_featured_demo";`)
}
