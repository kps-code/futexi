import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_journey_chapters_screen" AS ENUM('site', 'salon', 'chat', 'whatsapp', 'booking', 'stats', 'start');
  CREATE TABLE "home_page_journey_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"screen" "enum_home_page_journey_chapters_screen" DEFAULT 'chat' NOT NULL,
  	"eyebrow" varchar,
  	"heading_line1" varchar NOT NULL,
  	"heading_line2" varchar,
  	"line" varchar NOT NULL,
  	"tagline" varchar
  );
  
  ALTER TABLE "home_page" ADD COLUMN "journey_hero_label" varchar DEFAULT 'Your website';
  ALTER TABLE "home_page_journey_chapters" ADD CONSTRAINT "home_page_journey_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_journey_chapters_order_idx" ON "home_page_journey_chapters" USING btree ("_order");
  CREATE INDEX "home_page_journey_chapters_parent_id_idx" ON "home_page_journey_chapters" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_journey_chapters" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "journey_hero_label";
  DROP TYPE "public"."enum_home_page_journey_chapters_screen";`)
}
