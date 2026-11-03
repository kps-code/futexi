import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page" ALTER COLUMN "heading" SET DEFAULT 'Built by engineers, end to end.';
  ALTER TABLE "about_page" ALTER COLUMN "intro" SET DEFAULT 'We are a technology team focused on building modern websites, AI-powered experiences, automation solutions and digital products. We work directly with every client, from the first call to launch and beyond.';
  ALTER TABLE "team_members" ADD COLUMN "point_of_contact" boolean DEFAULT false;`)
  // Saved About copy still carrying the old head-count wording gets the new default too.
  await db.execute(sql`
   UPDATE "about_page" SET "heading" = 'Built by engineers, end to end.' WHERE "heading" = 'Three Builders. One Vision.';
  UPDATE "about_page" SET "intro" = 'We are a technology team focused on building modern websites, AI-powered experiences, automation solutions and digital products. We work directly with every client, from the first call to launch and beyond.' WHERE "intro" LIKE 'We are a small technology team focused on%';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page" ALTER COLUMN "heading" SET DEFAULT 'Three Builders. One Vision.';
  ALTER TABLE "about_page" ALTER COLUMN "intro" SET DEFAULT 'We are a small technology team focused on building modern websites, AI-powered experiences, automation solutions and digital products. We work directly with every client, from the first call to launch and beyond.';
  ALTER TABLE "team_members" DROP COLUMN "point_of_contact";`)
}
