import { createClient } from "@supabase/supabase-js";

// Browser-safe Supabase client. Uses the public URL + anon key, which are
// safe to expose client-side (Row Level Security policies enforce access).
//
// Set these in .env.local (see .env.example):
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// Nothing calls this yet — the contact form currently just does client-side
// validation. When you're ready to persist leads, create a `leads` table in
// Supabase and call supabase.from("leads").insert(...) from
// components/FinalCta.tsx.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
