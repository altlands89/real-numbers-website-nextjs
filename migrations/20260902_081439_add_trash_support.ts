import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "why_rn_wmd_paragraphs" DROP CONSTRAINT "why_real_numbers_page_what_makes_different_paragraphs_parent_id_fk";
  
  ALTER TABLE "why_rn_wmd_photos" DROP CONSTRAINT "why_real_numbers_page_what_makes_different_photos_image_id_media_id_fk";
  
  ALTER TABLE "why_rn_wmd_photos" DROP CONSTRAINT "why_real_numbers_page_what_makes_different_photos_parent_id_fk";
  
  DROP INDEX "why_real_numbers_page_what_makes_different_paragraphs_order_idx";
  DROP INDEX "why_real_numbers_page_what_makes_different_paragraphs_parent_id_idx";
  DROP INDEX "why_real_numbers_page_what_makes_different_photos_order_idx";
  DROP INDEX "why_real_numbers_page_what_makes_different_photos_parent_id_idx";
  DROP INDEX "why_real_numbers_page_what_makes_different_photos_image_idx";
  ALTER TABLE "media" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "team_members" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "testimonials" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "faq_items" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "client_logos" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "why_rn_wmd_paragraphs" ADD CONSTRAINT "why_rn_wmd_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "why_rn_wmd_photos" ADD CONSTRAINT "why_rn_wmd_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "why_rn_wmd_photos" ADD CONSTRAINT "why_rn_wmd_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE INDEX "team_members_deleted_at_idx" ON "team_members" USING btree ("deleted_at");
  CREATE INDEX "testimonials_deleted_at_idx" ON "testimonials" USING btree ("deleted_at");
  CREATE INDEX "faq_items_deleted_at_idx" ON "faq_items" USING btree ("deleted_at");
  CREATE INDEX "client_logos_deleted_at_idx" ON "client_logos" USING btree ("deleted_at");
  CREATE INDEX "why_rn_wmd_paragraphs_order_idx" ON "why_rn_wmd_paragraphs" USING btree ("_order");
  CREATE INDEX "why_rn_wmd_paragraphs_parent_id_idx" ON "why_rn_wmd_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "why_rn_wmd_photos_order_idx" ON "why_rn_wmd_photos" USING btree ("_order");
  CREATE INDEX "why_rn_wmd_photos_parent_id_idx" ON "why_rn_wmd_photos" USING btree ("_parent_id");
  CREATE INDEX "why_rn_wmd_photos_image_idx" ON "why_rn_wmd_photos" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "why_rn_wmd_paragraphs" DROP CONSTRAINT "why_rn_wmd_paragraphs_parent_id_fk";
  
  ALTER TABLE "why_rn_wmd_photos" DROP CONSTRAINT "why_rn_wmd_photos_image_id_media_id_fk";
  
  ALTER TABLE "why_rn_wmd_photos" DROP CONSTRAINT "why_rn_wmd_photos_parent_id_fk";
  
  DROP INDEX "media_deleted_at_idx";
  DROP INDEX "team_members_deleted_at_idx";
  DROP INDEX "testimonials_deleted_at_idx";
  DROP INDEX "faq_items_deleted_at_idx";
  DROP INDEX "client_logos_deleted_at_idx";
  DROP INDEX "why_rn_wmd_paragraphs_order_idx";
  DROP INDEX "why_rn_wmd_paragraphs_parent_id_idx";
  DROP INDEX "why_rn_wmd_photos_order_idx";
  DROP INDEX "why_rn_wmd_photos_parent_id_idx";
  DROP INDEX "why_rn_wmd_photos_image_idx";
  ALTER TABLE "why_rn_wmd_paragraphs" ADD CONSTRAINT "why_real_numbers_page_what_makes_different_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "why_rn_wmd_photos" ADD CONSTRAINT "why_real_numbers_page_what_makes_different_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "why_rn_wmd_photos" ADD CONSTRAINT "why_real_numbers_page_what_makes_different_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "why_real_numbers_page_what_makes_different_paragraphs_order_idx" ON "why_rn_wmd_paragraphs" USING btree ("_order");
  CREATE INDEX "why_real_numbers_page_what_makes_different_paragraphs_parent_id_idx" ON "why_rn_wmd_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "why_real_numbers_page_what_makes_different_photos_order_idx" ON "why_rn_wmd_photos" USING btree ("_order");
  CREATE INDEX "why_real_numbers_page_what_makes_different_photos_parent_id_idx" ON "why_rn_wmd_photos" USING btree ("_parent_id");
  CREATE INDEX "why_real_numbers_page_what_makes_different_photos_image_idx" ON "why_rn_wmd_photos" USING btree ("image_id");
  ALTER TABLE "media" DROP COLUMN "deleted_at";
  ALTER TABLE "team_members" DROP COLUMN "deleted_at";
  ALTER TABLE "testimonials" DROP COLUMN "deleted_at";
  ALTER TABLE "faq_items" DROP COLUMN "deleted_at";
  ALTER TABLE "client_logos" DROP COLUMN "deleted_at";`)
}
