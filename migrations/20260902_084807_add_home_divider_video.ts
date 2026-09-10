import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "divider_video_id" integer;
  ALTER TABLE "_home_v" ADD COLUMN "version_divider_video_id" integer;
  ALTER TABLE "home" ADD CONSTRAINT "home_divider_video_id_media_id_fk" FOREIGN KEY ("divider_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_divider_video_id_media_id_fk" FOREIGN KEY ("version_divider_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_divider_divider_video_idx" ON "home" USING btree ("divider_video_id");
  CREATE INDEX "_home_v_version_divider_version_divider_video_idx" ON "_home_v" USING btree ("version_divider_video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP CONSTRAINT "home_divider_video_id_media_id_fk";
  
  ALTER TABLE "_home_v" DROP CONSTRAINT "_home_v_version_divider_video_id_media_id_fk";
  
  DROP INDEX "home_divider_divider_video_idx";
  DROP INDEX "_home_v_version_divider_version_divider_video_idx";
  ALTER TABLE "home" DROP COLUMN "divider_video_id";
  ALTER TABLE "_home_v" DROP COLUMN "version_divider_video_id";`)
}
