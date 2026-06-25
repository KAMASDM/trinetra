/**
 * One-off migration: pushes the static product catalog (lib/products.ts)
 * into Firestore so the storefront can read from the database.
 *
 * Usage: npx tsx scripts/seed-products.ts
 * Requires FIREBASE_ADMIN_* env vars (see .env.local.example).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { adminDb } from "@/lib/firebase-admin";
import { products } from "@/lib/products";

async function main() {
  const collection = adminDb.collection("products");
  const existing = await collection.get();
  const existingSlugs = new Set(existing.docs.map((doc) => doc.data().slug));

  let created = 0;
  for (const product of products) {
    if (existingSlugs.has(product.slug)) {
      console.log(`Skipping ${product.slug} (already exists)`);
      continue;
    }
    const { id: _id, ...rest } = product;
    await collection.add({
      ...rest,
      status: "published",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    created += 1;
    console.log(`Seeded ${product.slug}`);
  }

  console.log(`Done. Created ${created} product(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
