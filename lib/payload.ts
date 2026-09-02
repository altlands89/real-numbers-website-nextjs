import { getPayload } from "payload";
import config from "@/payload.config";

// Payload memoizes internally per config object, so calling this per
// request/page is cheap — no separate connection-pool management needed.
export async function getCMS() {
  return getPayload({ config });
}
