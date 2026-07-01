"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { productCategories } from "@/lib/types";
import type { Product } from "@/lib/types";
import type { ProductActionState } from "@/app/admin/actions";
import { slugify } from "@/lib/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TagInput from "@/components/admin/TagInput";
import ProductGalleryManager from "@/components/admin/ProductGalleryManager";

type ProductFormProps = {
  action: (state: ProductActionState, formData: FormData) => Promise<ProductActionState>;
  product?: Product;
};

export default function ProductForm({ action, product }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const fieldErrors = state.fieldErrors ?? {};

  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return;
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={() => setIsDirty(true)}
      onSubmit={() => setIsDirty(false)}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-cinzel text-2xl text-charcoal">{product ? "Edit Product" : "New Product"}</h2>
        <div className="flex items-center gap-3">
          {isDirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : product ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Couldn&apos;t save product</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-taupe">Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field
            name="name"
            label="Product name"
            defaultValue={product?.name}
            error={fieldErrors.name}
            onValueChange={(value) => {
              if (!slugTouched) setSlug(slugify(value));
            }}
          />
          <div>
            <Label htmlFor="slug" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              URL slug
            </Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              aria-invalid={Boolean(fieldErrors.slug)}
            />
            {fieldErrors.slug && <p className="mt-1 text-xs text-destructive">{fieldErrors.slug}</p>}
          </div>

          <div>
            <Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Category
            </Label>
            <Select name="category" defaultValue={product?.category}>
              <SelectTrigger className="w-full" aria-invalid={Boolean(fieldErrors.category)}>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.category && <p className="mt-1 text-xs text-destructive">{fieldErrors.category}</p>}
          </div>

          <div>
            <Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Publishing status
            </Label>
            <Select name="status" value={status} onValueChange={(value) => setStatus(value as typeof status)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            {status === "published" && (
              <p className="mt-1 text-xs text-muted-foreground">
                Publishing requires a name, slug, category, price, inventory, image and description.
              </p>
            )}
          </div>

          <Field name="price" label="Selling price" type="number" defaultValue={product?.price} error={fieldErrors.price} />
          <Field name="compareAtPrice" label="Compare-at price" type="number" defaultValue={product?.compareAtPrice} />
          <Field
            name="inventory"
            label="Inventory quantity"
            type="number"
            defaultValue={product?.inventory}
            error={fieldErrors.inventory}
          />
          <Field name="badge" label="Product badge" placeholder="Festive Edit / Ready To Ship" defaultValue={product?.badge} />
          <Field name="dispatch" label="Dispatch window" placeholder="2-4 days / 21-35 days" defaultValue={product?.dispatch} />
          <Field name="fabric" label="Fabric" defaultValue={product?.fabric} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-taupe">Variants</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <TagInput name="craft" label="Craft tags" placeholder="Zardozi, Aari, Mirror work" defaultValue={product?.craft} />
          <TagInput name="sizes" label="Sizes" placeholder="XS, S, M, L, XL" defaultValue={product?.sizes} />
          <TagInput name="colors" label="Colours" placeholder="Crimson, Antique Gold" defaultValue={product?.colors} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-taupe">Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductGalleryManager defaultImages={product?.gallery?.length ? product.gallery : product?.image ? [product.image] : []} />
          {fieldErrors.image && <p className="mt-2 text-xs text-destructive">{fieldErrors.image}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-taupe">Storytelling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextField name="story" label="Short story" rows={3} defaultValue={product?.story} />
          <TextField
            name="description"
            label="Full description"
            rows={4}
            defaultValue={product?.description}
            error={fieldErrors.description}
          />
          <TextField name="care" label="Care notes" rows={3} defaultValue={product?.care} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-taupe">SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field name="seoTitle" label="SEO title" defaultValue={product?.seoTitle} />
          <Field name="seoDescription" label="SEO description" defaultValue={product?.seoDescription} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap gap-6 pt-6 text-sm text-charcoal">
          <CheckboxField name="customizable" label="Customizable / made-to-measure" defaultChecked={product?.customizable} />
          <CheckboxField name="bestseller" label="Bestseller" defaultChecked={product?.bestseller} />
          <CheckboxField name="newArrival" label="New arrival" defaultChecked={product?.newArrival} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} size="lg">
          {pending ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  defaultValue,
  error,
  onValueChange,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string | number;
  error?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function TextField({
  label,
  name,
  rows,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Textarea id={name} name={name} rows={rows} defaultValue={defaultValue} aria-invalid={Boolean(error)} />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <Label className="flex items-center gap-3 font-normal">
      <Checkbox name={name} defaultChecked={defaultChecked} />
      {label}
    </Label>
  );
}
