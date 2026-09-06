import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "why_real_numbers_page" ADD COLUMN "what_makes_different_photo_id" integer;
  ALTER TABLE "why_real_numbers_page" ADD CONSTRAINT "why_real_numbers_page_what_makes_different_photo_id_media_id_fk" FOREIGN KEY ("what_makes_different_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "why_real_numbers_page_what_makes_different_what_makes_di_idx" ON "why_real_numbers_page" USING btree ("what_makes_different_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "why_real_numbers_page" DROP CONSTRAINT "why_real_numbers_page_what_makes_different_photo_id_media_id_fk";
  
  DROP INDEX "why_real_numbers_page_what_makes_different_what_makes_di_idx";
  ALTER TABLE "why_real_numbers_page" DROP COLUMN "what_makes_different_photo_id";`)
}
