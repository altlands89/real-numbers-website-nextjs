import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page_leadership_cards" ADD COLUMN "photo_id" integer;
  ALTER TABLE "_about_page_v_version_leadership_cards" ADD COLUMN "photo_id" integer;
  ALTER TABLE "about_page_leadership_cards" ADD CONSTRAINT "about_page_leadership_cards_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_leadership_cards" ADD CONSTRAINT "_about_page_v_version_leadership_cards_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_page_leadership_cards_photo_idx" ON "about_page_leadership_cards" USING btree ("photo_id");
  CREATE INDEX "_about_page_v_version_leadership_cards_photo_idx" ON "_about_page_v_version_leadership_cards" USING btree ("photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page_leadership_cards" DROP CONSTRAINT "about_page_leadership_cards_photo_id_media_id_fk";
  
  ALTER TABLE "_about_page_v_version_leadership_cards" DROP CONSTRAINT "_about_page_v_version_leadership_cards_photo_id_media_id_fk";
  
  DROP INDEX "about_page_leadership_cards_photo_idx";
  DROP INDEX "_about_page_v_version_leadership_cards_photo_idx";
  ALTER TABLE "about_page_leadership_cards" DROP COLUMN "photo_id";
  ALTER TABLE "_about_page_v_version_leadership_cards" DROP COLUMN "photo_id";`)
}
