import type { CollectionConfig } from "payload";

// Payload's built-in auth collection — powers /admin login only, entirely
// separate from the Supabase client used for the contact form's `leads` table.
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: {
    // Payload's default is 2 hours, which forces frequent re-logins for a
    // small internal editor team. This is a content admin panel, not a
    // high-security banking app — 30 days trades a little security margin
    // for a lot less login friction.
    tokenExpiration: 60 * 60 * 24 * 30,
  },
  fields: [],
};
