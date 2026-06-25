"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { productCategories } from "@/lib/products";

const panels = [
  ["Orders", "New, paid, packed, shipped, delivered, returned"],
  ["Catalog", "Products, variants, price books, collections"],
  ["Production", "Cutting, embroidery, stitching, QC, dispatch"],
  ["Customers", "Wishlists, measurements, bridal consultations"],
  ["Marketing", "Coupons, gift cards, banners, SEO"],
  ["Reports", "Sales, stock ageing, low inventory, bestsellers"],
];

export default function AdminConsole() {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const stockAlerts = useMemo(
    () => [
      "3 bridal lehengas below made-to-measure capacity",
      "12 orders require measurement confirmation",
      "5 dress materials ready for photoshoot upload",
    ],
    [],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const image = form.get("image");
    let imageUrl = "";

    try {
      if (image instanceof File && image.size > 0) {
        const storageRef = ref(storage, `products/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "products"), {
        name: form.get("name"),
        slug: String(form.get("slug") ?? "").toLowerCase().trim(),
        category: form.get("category"),
        price: Number(form.get("price")),
        compareAtPrice: Number(form.get("compareAtPrice") || 0),
        inventory: Number(form.get("inventory")),
        fabric: form.get("fabric"),
        craft: String(form.get("craft") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
        sizes: String(form.get("sizes") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
        colors: String(form.get("colors") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
        dispatch: form.get("dispatch"),
        care: form.get("care"),
        story: form.get("story"),
        description: form.get("description"),
        seoTitle: form.get("seoTitle"),
        seoDescription: form.get("seoDescription"),
        status: form.get("status"),
        image: imageUrl,
        customizable: form.get("customizable") === "on",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      event.currentTarget.reset();
      setStatus("success");
      setMessage("Product uploaded to Firebase Firestore. Image stored in Firebase Storage.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Firebase rejected the upload. Check Storage/Firestore rules and admin authentication.");
    }
  }

  return (
    <section className="min-h-screen bg-ivory pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow-stitch mb-4">Firebase Admin</p>
            <h1 className="heading-stitched text-4xl">Trinetra Commerce Desk</h1>
            <p className="mt-5 max-w-2xl text-taupe leading-relaxed">
              Operational foundation for catalog uploads, inventory, production tracking, orders, customers and promotions.
            </p>
          </div>
          <Link href="/shop" className="btn-outline-gold !border-crimson/40 !text-crimson">View Storefront</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {panels.map(([title, desc]) => (
            <div key={title} className="border border-gold/20 bg-warm-white p-4">
              <p className="font-cinzel text-base text-crimson">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-taupe">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="border border-gold/20 bg-warm-white p-6">
            <h2 className="font-cinzel text-2xl text-charcoal">Upload Product</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field name="name" label="Product name" required />
              <Field name="slug" label="URL slug" required />
              <label>
                <span className="admin-label">Category</span>
                <select name="category" className="admin-input" required>
                  {productCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label>
                <span className="admin-label">Publishing status</span>
                <select name="status" className="admin-input" defaultValue="draft">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <Field name="price" label="Selling price" type="number" required />
              <Field name="compareAtPrice" label="Compare-at price" type="number" />
              <Field name="inventory" label="Inventory quantity" type="number" required />
              <Field name="dispatch" label="Dispatch window" placeholder="2-4 days / 21-35 days" />
              <Field name="fabric" label="Fabric" />
              <Field name="craft" label="Craft tags" placeholder="Zardozi, Aari, Mirror work" />
              <Field name="sizes" label="Sizes" placeholder="XS, S, M, L, XL" />
              <Field name="colors" label="Colours" placeholder="Crimson, Antique Gold" />
              <Field name="seoTitle" label="SEO title" />
              <Field name="seoDescription" label="SEO description" />
            </div>
            <label className="mt-4 block">
              <span className="admin-label">Main image</span>
              <input name="image" type="file" accept="image/*" className="admin-input" />
            </label>
            <label className="mt-4 block">
              <span className="admin-label">Short story</span>
              <textarea name="story" rows={3} className="admin-input" />
            </label>
            <label className="mt-4 block">
              <span className="admin-label">Full description</span>
              <textarea name="description" rows={4} className="admin-input" />
            </label>
            <label className="mt-4 block">
              <span className="admin-label">Care notes</span>
              <textarea name="care" rows={3} className="admin-input" />
            </label>
            <label className="mt-5 flex items-center gap-3 text-sm text-charcoal">
              <input name="customizable" type="checkbox" className="h-4 w-4 accent-crimson" />
              Customizable / made-to-measure available
            </label>
            <button type="submit" disabled={status === "saving"} className="btn-gold mt-6">
              {status === "saving" ? "Uploading" : "Upload Product"}
            </button>
            {message && (
              <p className={`mt-4 text-sm ${status === "error" ? "text-crimson" : "text-taupe"}`}>{message}</p>
            )}
          </form>

          <aside className="space-y-5">
            <div className="border border-gold/25 bg-charcoal p-6 text-warm-white">
              <p className="font-cinzel text-2xl text-gold">Today</p>
              <div className="divider-dash my-5" />
              {[
                ["New Orders", "18"],
                ["Pending Stitching", "42"],
                ["Low Stock SKUs", "7"],
                ["Revenue", "Rs. 4.8L"],
              ].map(([label, value]) => (
                <div key={label} className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-warm-white/55">{label}</span>
                  <span className="font-cinzel text-gold">{value}</span>
                </div>
              ))}
            </div>
            <div className="border border-gold/20 bg-warm-white p-6">
              <p className="font-cinzel text-xl text-crimson">Action Queue</p>
              <ul className="mt-4 space-y-3">
                {stockAlerts.map((alert) => (
                  <li key={alert} className="border-l-2 border-gold pl-3 text-sm leading-relaxed text-taupe">{alert}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      <input name={name} type={type} placeholder={placeholder} required={required} className="admin-input" />
    </label>
  );
}
