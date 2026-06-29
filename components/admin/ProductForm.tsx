"use client";

import { useActionState } from "react";
import Image from "next/image";
import { productCategories } from "@/lib/types";
import type { Product } from "@/lib/types";
import type { ProductActionState } from "@/app/admin/actions";

type ProductFormProps = {
  action: (state: ProductActionState, formData: FormData) => Promise<ProductActionState>;
  product?: Product;
};

export default function ProductForm({ action, product }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="border border-gold/20 bg-warm-white p-6">
      <h2 className="font-cinzel text-2xl text-charcoal">{product ? "Edit Product" : "New Product"}</h2>
      {state.error && (
        <p className="mt-4 border border-crimson/25 bg-crimson/5 px-4 py-3 text-sm text-crimson">
          {state.error}
        </p>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field name="name" label="Product name" defaultValue={product?.name} required />
        <Field name="slug" label="URL slug" defaultValue={product?.slug} required />
        <label>
          <span className="admin-label">Category</span>
          <select name="category" defaultValue={product?.category} className="admin-input" required>
            {productCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span className="admin-label">Publishing status</span>
          <select name="status" defaultValue={product?.status ?? "draft"} className="admin-input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <Field name="price" label="Selling price" type="number" defaultValue={product?.price} required />
        <Field name="compareAtPrice" label="Compare-at price" type="number" defaultValue={product?.compareAtPrice} />
        <Field name="inventory" label="Inventory quantity" type="number" defaultValue={product?.inventory} required />
        <Field name="badge" label="Product badge" placeholder="Festive Edit / Ready To Ship" defaultValue={product?.badge} />
        <Field name="dispatch" label="Dispatch window" placeholder="2-4 days / 21-35 days" defaultValue={product?.dispatch} />
        <Field name="fabric" label="Fabric" defaultValue={product?.fabric} />
        <Field name="craft" label="Craft tags" placeholder="Zardozi, Aari, Mirror work" defaultValue={product?.craft?.join(", ")} />
        <Field name="sizes" label="Sizes" placeholder="XS, S, M, L, XL" defaultValue={product?.sizes?.join(", ")} />
        <Field name="colors" label="Colours" placeholder="Crimson, Antique Gold" defaultValue={product?.colors?.join(", ")} />
        <Field name="seoTitle" label="SEO title" defaultValue={product?.seoTitle} />
        <Field name="seoDescription" label="SEO description" defaultValue={product?.seoDescription} />
      </div>

      {product?.image && (
        <div className="mt-4 relative h-24 w-20 overflow-hidden border border-gold/20">
          <Image src={product.image} alt="" fill sizes="80px" className="object-cover object-top" />
        </div>
      )}
      <label className="mt-4 block">
        <span className="admin-label">{product ? "Replace main image" : "Main image"}</span>
        <input name="image" type="file" accept="image/*" className="admin-input" />
      </label>
      <label className="mt-4 block">
        <span className="admin-label">Short story</span>
        <textarea name="story" rows={3} defaultValue={product?.story} className="admin-input" />
      </label>
      <label className="mt-4 block">
        <span className="admin-label">Full description</span>
        <textarea name="description" rows={4} defaultValue={product?.description} className="admin-input" />
      </label>
      <label className="mt-4 block">
        <span className="admin-label">Care notes</span>
        <textarea name="care" rows={3} defaultValue={product?.care} className="admin-input" />
      </label>

      <div className="mt-5 flex flex-wrap gap-6 text-sm text-charcoal">
        <label className="flex items-center gap-3">
          <input name="customizable" type="checkbox" defaultChecked={product?.customizable} className="h-4 w-4 accent-crimson" />
          Customizable / made-to-measure
        </label>
        <label className="flex items-center gap-3">
          <input name="bestseller" type="checkbox" defaultChecked={product?.bestseller} className="h-4 w-4 accent-crimson" />
          Bestseller
        </label>
        <label className="flex items-center gap-3">
          <input name="newArrival" type="checkbox" defaultChecked={product?.newArrival} className="h-4 w-4 accent-crimson" />
          New arrival
        </label>
      </div>

      <button type="submit" disabled={pending} className="btn-gold mt-6">
        {pending ? "Saving" : product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string | number;
}) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="admin-input"
      />
    </label>
  );
}
