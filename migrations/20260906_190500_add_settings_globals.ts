import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ai_integrations_provider" AS ENUM('openai', 'anthropic', 'google');
  CREATE TABLE "ai_integrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"provider" "enum_ai_integrations_provider" DEFAULT 'openai',
  	"api_key" varchar,
  	"last_verified_at" timestamp(3) with time zone,
  	"last_verified_ok" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "account_handoff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"github_transfer_done" boolean DEFAULT false,
  	"github_transfer_notes" varchar,
  	"vercel_transfer_done" boolean DEFAULT false,
  	"vercel_transfer_notes" varchar,
  	"supabase_transfer_done" boolean DEFAULT false,
  	"supabase_transfer_notes" varchar,
  	"domain_transfer_done" boolean DEFAULT false,
  	"domain_transfer_notes" varchar DEFAULT 'Not applicable yet — the site currently runs on its default *.vercel.app domain.',
  	"client_admin_account_done" boolean DEFAULT false,
  	"client_admin_account_notes" varchar,
  	"agency_access_removed_done" boolean DEFAULT false,
  	"agency_access_removed_notes" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "ai_integrations" CASCADE;
  DROP TABLE "account_handoff" CASCADE;
  DROP TYPE "public"."enum_ai_integrations_provider";`)
}
