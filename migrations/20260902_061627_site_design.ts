import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_typography_h1_size_scale" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_typography_h1_weight" AS ENUM('400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_typography_h2_size_scale" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_typography_h2_weight" AS ENUM('400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_typography_h3_size_scale" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_typography_h3_weight" AS ENUM('400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_typography_eyebrow_size_scale" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_typography_eyebrow_weight" AS ENUM('400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_typography_lede_size_scale" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_typography_lede_weight" AS ENUM('400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_typography_body_size_scale" AS ENUM('1', '2', '3', '4', '5');
  CREATE TYPE "public"."enum_typography_body_weight" AS ENUM('400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_layout_motion_container_width" AS ENUM('80', '86', '92', '96', '100');
  CREATE TYPE "public"."enum_layout_motion_corner_roundness" AS ENUM('0', '50', '100', '150', '200');
  CREATE TYPE "public"."enum_layout_motion_spacing_density" AS ENUM('80', '90', '100', '115', '130');
  CREATE TYPE "public"."enum_layout_motion_motion_speed" AS ENUM('150', '125', '100', '75', '50');
  CREATE TABLE "typography" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"h1_size_scale" "enum_typography_h1_size_scale" DEFAULT '3',
  	"h1_line_height" numeric DEFAULT 0.92,
  	"h1_letter_spacing" numeric DEFAULT -0.035,
  	"h1_weight" "enum_typography_h1_weight" DEFAULT '800',
  	"h2_size_scale" "enum_typography_h2_size_scale" DEFAULT '3',
  	"h2_line_height" numeric DEFAULT 1,
  	"h2_letter_spacing" numeric DEFAULT -0.028,
  	"h2_weight" "enum_typography_h2_weight" DEFAULT '700',
  	"h3_size_scale" "enum_typography_h3_size_scale" DEFAULT '3',
  	"h3_line_height" numeric DEFAULT 1.15,
  	"h3_letter_spacing" numeric DEFAULT -0.016,
  	"h3_weight" "enum_typography_h3_weight" DEFAULT '700',
  	"eyebrow_size_scale" "enum_typography_eyebrow_size_scale" DEFAULT '3',
  	"eyebrow_line_height" numeric DEFAULT 1.333,
  	"eyebrow_letter_spacing" numeric DEFAULT 0.14,
  	"eyebrow_weight" "enum_typography_eyebrow_weight" DEFAULT '700',
  	"lede_size_scale" "enum_typography_lede_size_scale" DEFAULT '3',
  	"lede_line_height" numeric DEFAULT 1.5,
  	"lede_letter_spacing" numeric DEFAULT 0,
  	"lede_weight" "enum_typography_lede_weight" DEFAULT '400',
  	"body_size_scale" "enum_typography_body_size_scale" DEFAULT '3',
  	"body_line_height" numeric DEFAULT 1.625,
  	"body_letter_spacing" numeric DEFAULT 0,
  	"body_weight" "enum_typography_body_weight" DEFAULT '400',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "layout_motion" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"container_width" "enum_layout_motion_container_width" DEFAULT '92',
  	"corner_roundness" "enum_layout_motion_corner_roundness" DEFAULT '100',
  	"spacing_density" "enum_layout_motion_spacing_density" DEFAULT '100',
  	"motion_speed" "enum_layout_motion_motion_speed" DEFAULT '100',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "design_tokens" ADD COLUMN "colors_white" varchar DEFAULT '#ffffff';
  ALTER TABLE "design_tokens" ADD COLUMN "colors_clay" varchar DEFAULT '#ce8570';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "typography" CASCADE;
  DROP TABLE "layout_motion" CASCADE;
  ALTER TABLE "design_tokens" DROP COLUMN "colors_white";
  ALTER TABLE "design_tokens" DROP COLUMN "colors_clay";
  DROP TYPE "public"."enum_typography_h1_size_scale";
  DROP TYPE "public"."enum_typography_h1_weight";
  DROP TYPE "public"."enum_typography_h2_size_scale";
  DROP TYPE "public"."enum_typography_h2_weight";
  DROP TYPE "public"."enum_typography_h3_size_scale";
  DROP TYPE "public"."enum_typography_h3_weight";
  DROP TYPE "public"."enum_typography_eyebrow_size_scale";
  DROP TYPE "public"."enum_typography_eyebrow_weight";
  DROP TYPE "public"."enum_typography_lede_size_scale";
  DROP TYPE "public"."enum_typography_lede_weight";
  DROP TYPE "public"."enum_typography_body_size_scale";
  DROP TYPE "public"."enum_typography_body_weight";
  DROP TYPE "public"."enum_layout_motion_container_width";
  DROP TYPE "public"."enum_layout_motion_corner_roundness";
  DROP TYPE "public"."enum_layout_motion_spacing_density";
  DROP TYPE "public"."enum_layout_motion_motion_speed";`)
}
