import { z } from "zod";
import { productCategories } from "@/lib/types";

const numberFromInput = z.preprocess((value) => {
  if (typeof value === "string") {
    if (value.trim() === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  }
  return value;
}, z.number().optional());

const stringArray = z
  .preprocess((value) => {
    if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v.trim());
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }, z.array(z.string()))
  .default([]);

const optionalString = z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().optional());

/** Loose schema: a product can always be saved with this — nothing here blocks a draft save. */
export const productDraftSchema = z.object({
  name: optionalString.default(""),
  slug: z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
    z.string().optional().default(""),
  ),
  category: optionalString,
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  price: numberFromInput,
  compareAtPrice: numberFromInput,
  inventory: numberFromInput,
  badge: optionalString,
  fabric: optionalString,
  craft: stringArray,
  sizes: stringArray,
  colors: stringArray,
  dispatch: optionalString,
  care: optionalString,
  story: optionalString,
  description: optionalString,
  seoTitle: optionalString,
  seoDescription: optionalString,
  image: optionalString,
  gallery: stringArray,
  customizable: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
});

export type ProductDraftInput = z.infer<typeof productDraftSchema>;

/** Strict schema: only enforced when an admin flips status to "published". */
export const productPublishSchema = productDraftSchema
  .extend({
    name: z.string().trim().min(1, "Product name is required to publish."),
    slug: z
      .string()
      .trim()
      .min(1, "URL slug is required to publish.")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers and hyphens."),
    category: z.enum(productCategories as [string, ...string[]], {
      message: "Choose a valid product category before publishing.",
    }),
    price: z
      .number({ error: "Selling price is required to publish." })
      .gt(0, "Selling price must be greater than zero."),
    inventory: z
      .number({ error: "Inventory quantity is required to publish." })
      .min(0, "Inventory cannot be negative."),
    description: z.string().trim().min(1, "Full description is required to publish."),
  })
  .refine((data) => Boolean(data.image) || data.gallery.length > 0, {
    message: "Add at least one product image before publishing.",
    path: ["image"],
  });

export type ProductPublishInput = z.infer<typeof productPublishSchema>;

export function zodIssuesToFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
