import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { seedHomeDefaults } from '../payload/seed-home-defaults'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_pricing_setups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"best_for" varchar
  );
  
  ALTER TABLE "home_page" ADD COLUMN "pricing_heading" varchar DEFAULT 'Simple, honest pricing.' NOT NULL;
  ALTER TABLE "home_page" ADD COLUMN "pricing_line" varchar DEFAULT '{price}. The final price depends on pages, features and integrations. Tell us what you need and we send a clear quote, usually the same day.' NOT NULL;
  ALTER TABLE "home_page" ADD COLUMN "pricing_note_tag" varchar DEFAULT 'How quotes work' NOT NULL;
  ALTER TABLE "home_page" ADD COLUMN "pricing_note_title" varchar DEFAULT 'One clear number, before we start.' NOT NULL;
  ALTER TABLE "home_page" ADD COLUMN "pricing_note_body" varchar DEFAULT 'You get a fixed price for the agreed scope, a timeline and a list of what is included. No hourly billing, no hidden costs. Hosting and domain are explained separately in plain words.' NOT NULL;
  ALTER TABLE "home_page" ADD COLUMN "pricing_whatsapp_label" varchar DEFAULT 'Get a Quote on WhatsApp' NOT NULL;
  ALTER TABLE "home_page" ADD COLUMN "pricing_secondary_label" varchar DEFAULT 'Discuss Your Project' NOT NULL;
  ALTER TABLE "home_page_pricing_setups" ADD CONSTRAINT "home_page_pricing_setups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_pricing_setups_order_idx" ON "home_page_pricing_setups" USING btree ("_order");
  CREATE INDEX "home_page_pricing_setups_parent_id_idx" ON "home_page_pricing_setups" USING btree ("_parent_id");`)

  // The admin lists the same chapters and setups the site renders by default.
  const seeded = await seedHomeDefaults(payload, req)
  if (seeded.length) payload.logger.info(`home page defaults seeded: ${seeded.join(', ')}`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_pricing_setups" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "pricing_heading";
  ALTER TABLE "home_page" DROP COLUMN "pricing_line";
  ALTER TABLE "home_page" DROP COLUMN "pricing_note_tag";
  ALTER TABLE "home_page" DROP COLUMN "pricing_note_title";
  ALTER TABLE "home_page" DROP COLUMN "pricing_note_body";
  ALTER TABLE "home_page" DROP COLUMN "pricing_whatsapp_label";
  ALTER TABLE "home_page" DROP COLUMN "pricing_secondary_label";`)
}
