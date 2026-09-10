import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "_home_v" ADD COLUMN "version_mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "about_page" ADD COLUMN "mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "team_page" ADD COLUMN "mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "_team_page_v" ADD COLUMN "version_mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "contact_page" ADD COLUMN "mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "why_real_numbers_page" ADD COLUMN "mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "_why_real_numbers_page_v" ADD COLUMN "version_mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "our_expertise_page" ADD COLUMN "mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "_our_expertise_page_v" ADD COLUMN "version_mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "use_cases_page" ADD COLUMN "mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "_use_cases_page_v" ADD COLUMN "version_mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "questions_founders_ask_page" ADD COLUMN "mobile_overrides" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "_questions_founders_ask_page_v" ADD COLUMN "version_mobile_overrides" jsonb DEFAULT '{}'::jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "mobile_overrides";
  ALTER TABLE "_home_v" DROP COLUMN "version_mobile_overrides";
  ALTER TABLE "about_page" DROP COLUMN "mobile_overrides";
  ALTER TABLE "_about_page_v" DROP COLUMN "version_mobile_overrides";
  ALTER TABLE "team_page" DROP COLUMN "mobile_overrides";
  ALTER TABLE "_team_page_v" DROP COLUMN "version_mobile_overrides";
  ALTER TABLE "contact_page" DROP COLUMN "mobile_overrides";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_mobile_overrides";
  ALTER TABLE "why_real_numbers_page" DROP COLUMN "mobile_overrides";
  ALTER TABLE "_why_real_numbers_page_v" DROP COLUMN "version_mobile_overrides";
  ALTER TABLE "our_expertise_page" DROP COLUMN "mobile_overrides";
  ALTER TABLE "_our_expertise_page_v" DROP COLUMN "version_mobile_overrides";
  ALTER TABLE "use_cases_page" DROP COLUMN "mobile_overrides";
  ALTER TABLE "_use_cases_page_v" DROP COLUMN "version_mobile_overrides";
  ALTER TABLE "questions_founders_ask_page" DROP COLUMN "mobile_overrides";
  ALTER TABLE "_questions_founders_ask_page_v" DROP COLUMN "version_mobile_overrides";`)
}
