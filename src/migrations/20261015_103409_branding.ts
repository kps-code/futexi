import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_default_theme" AS ENUM('light', 'dark');
  ALTER TABLE "site_settings" ADD COLUMN "logo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "site_icon_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "default_theme" "enum_site_settings_default_theme" DEFAULT 'light';
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_site_icon_id_media_id_fk" FOREIGN KEY ("site_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_dark_idx" ON "site_settings" USING btree ("logo_dark_id");
  CREATE INDEX "site_settings_site_icon_idx" ON "site_settings" USING btree ("site_icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_logo_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_logo_dark_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_site_icon_id_media_id_fk";
  
  DROP INDEX "site_settings_logo_idx";
  DROP INDEX "site_settings_logo_dark_idx";
  DROP INDEX "site_settings_site_icon_idx";
  ALTER TABLE "site_settings" DROP COLUMN "logo_id";
  ALTER TABLE "site_settings" DROP COLUMN "logo_dark_id";
  ALTER TABLE "site_settings" DROP COLUMN "site_icon_id";
  ALTER TABLE "site_settings" DROP COLUMN "default_theme";
  DROP TYPE "public"."enum_site_settings_default_theme";`)
}
