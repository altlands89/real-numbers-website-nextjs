/**
 * One-off: creates (or resets the password on) a dedicated admin user for
 * automated/agent use against the local dev database, so testing the
 * visual editor doesn't require a human to log in by hand after every
 * `next dev` restart (each restart is a fresh browser-tool session with no
 * carried-over cookie). Credentials are read from / written to
 * RN_DEV_ADMIN_EMAIL / RN_DEV_ADMIN_PASSWORD in .env.local (gitignored,
 * same trust boundary as DATABASE_URI etc.) — never hardcoded here.
 *
 * Run with: npx tsx --env-file=.env.local payload/create-dev-admin.ts
 */
import { getPayload } from "payload";
import config from "../payload.config";

async function run() {
  const email = process.env.RN_DEV_ADMIN_EMAIL;
  const password = process.env.RN_DEV_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set RN_DEV_ADMIN_EMAIL and RN_DEV_ADMIN_PASSWORD in .env.local first.");
  }

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (existing.docs.length) {
    await payload.update({
      collection: "users",
      id: existing.docs[0].id,
      data: { password },
    });
    console.log(`Password reset for existing user ${email}`);
  } else {
    await payload.create({
      collection: "users",
      data: { email, password },
    });
    console.log(`Created new admin user ${email}`);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
