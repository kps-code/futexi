import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_demo_leads_business" ADD VALUE 'interior';
  ALTER TYPE "public"."enum_demo_leads_business" ADD VALUE 'tuition';
  ALTER TABLE "demo_leads" ADD COLUMN "details" varchar;
  CREATE INDEX "demo_leads_business_idx" ON "demo_leads" USING btree ("business");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "demo_leads" ALTER COLUMN "business" SET DATA TYPE text;
  ALTER TABLE "demo_leads" ALTER COLUMN "business" SET DEFAULT 'ai-business'::text;
  DROP TYPE "public"."enum_demo_leads_business";
  CREATE TYPE "public"."enum_demo_leads_business" AS ENUM('ai-business');
  ALTER TABLE "demo_leads" ALTER COLUMN "business" SET DEFAULT 'ai-business'::"public"."enum_demo_leads_business";
  ALTER TABLE "demo_leads" ALTER COLUMN "business" SET DATA TYPE "public"."enum_demo_leads_business" USING "business"::"public"."enum_demo_leads_business";
  DROP INDEX "demo_leads_business_idx";
  ALTER TABLE "demo_leads" DROP COLUMN "details";`)
}
