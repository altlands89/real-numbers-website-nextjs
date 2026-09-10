import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "design_tokens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"colors_black" varchar DEFAULT '#191716',
  	"colors_offwhite" varchar DEFAULT '#f0efe8',
  	"colors_red" varchar DEFAULT '#b85840',
  	"colors_red_dark" varchar DEFAULT '#9c4933',
  	"colors_blue" varchar DEFAULT '#353e5b',
  	"colors_blue_dark" varchar DEFAULT '#2a3148',
  	"colors_stone" varchar DEFAULT '#cfc9bc',
  	"colors_horizon" varchar DEFAULT '#5c6787',
  	"colors_jet" varchar DEFAULT '#0d0d0d',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "design_tokens" CASCADE;`)
}
