import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Renames 2 tables to shorten them: enabling Drafts on this Global (next
// migration) generates a parallel "versions" table for every array field,
// and the original names were long enough that the versions-table variant
// exceeded Postgres's 63-character identifier limit. Pure renames — no data
// is touched, no columns change.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "why_real_numbers_page_what_makes_different_paragraphs" RENAME TO "why_rn_wmd_paragraphs";
  ALTER TABLE "why_real_numbers_page_what_makes_different_photos" RENAME TO "why_rn_wmd_photos";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "why_rn_wmd_paragraphs" RENAME TO "why_real_numbers_page_what_makes_different_paragraphs";
  ALTER TABLE "why_rn_wmd_photos" RENAME TO "why_real_numbers_page_what_makes_different_photos";
  `)
}
