import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_brand_assets_category" AS ENUM('logos', 'icons', 'numerals', 'colors', 'fonts', 'photography', 'animations', 'documents', 'social');
  CREATE TABLE "brand_assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_brand_assets_category" NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "brand_assets_id" integer;
  CREATE INDEX "brand_assets_updated_at_idx" ON "brand_assets" USING btree ("updated_at");
  CREATE INDEX "brand_assets_created_at_idx" ON "brand_assets" USING btree ("created_at");
  CREATE INDEX "brand_assets_deleted_at_idx" ON "brand_assets" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "brand_assets_filename_idx" ON "brand_assets" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brand_assets_fk" FOREIGN KEY ("brand_assets_id") REFERENCES "public"."brand_assets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_brand_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("brand_assets_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brand_assets" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "brand_assets" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_brand_assets_fk";
  
  DROP INDEX "payload_locked_documents_rels_brand_assets_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "brand_assets_id";
  DROP TYPE "public"."enum_brand_assets_category";`)
}
