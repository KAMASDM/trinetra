/**
 * One-time setup: grants the `admin: true` custom claim to a Firebase user
 * so they can log into /admin. Run after creating the user in the Firebase
 * Console (Authentication > Users > Add user).
 *
 * Usage: npx tsx scripts/set-admin-claim.ts someone@example.com
 * Requires FIREBASE_ADMIN_* env vars (see .env.local.example).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { adminAuth } from "@/lib/firebase-admin";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/set-admin-claim.ts <email>");
    process.exit(1);
  }

  const user = await adminAuth.getUserByEmail(email);
  await adminAuth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`Granted admin claim to ${email} (uid: ${user.uid}).`);
  console.log("They must log out and back in for the new claim to take effect.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
