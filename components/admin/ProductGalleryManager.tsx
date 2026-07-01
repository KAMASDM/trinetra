"use client";

import { useRef, useState, useTransition, type DragEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadProductImageAction } from "@/app/admin/actions";
import { toast } from "sonner";

type ProductGalleryManagerProps = {
  defaultImages?: string[];
};

export default function ProductGalleryManager({ defaultImages = [] }: ProductGalleryManagerProps) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    startTransition(async () => {
      for (const file of list) {
        const fd = new FormData();
        fd.set("file", file);
        const result = await uploadProductImageAction(fd);
        if ("error" in result) {
          toast.error(result.error);
        } else {
          setImages((prev) => [...prev, result.url]);
        }
      }
    });
  }

  function removeAt(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function moveTo(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function setPrimary(index: number) {
    setImages((prev) => {
      if (index === 0) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Gallery images
      </p>

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-[3/4] overflow-hidden rounded-md border border-border bg-muted"
            >
              <Image src={url} alt="" fill sizes="160px" className="object-cover object-top" />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Primary
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-charcoal/70 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  title="Move left"
                  onClick={() => moveTo(index, -1)}
                  disabled={index === 0}
                  className="rounded p-1 text-warm-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Set as primary"
                  onClick={() => setPrimary(index)}
                  disabled={index === 0}
                  className="rounded p-1 text-gold hover:bg-white/20 disabled:opacity-30"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Remove"
                  onClick={() => removeAt(index)}
                  className="rounded p-1 text-crimson hover:bg-white/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Move right"
                  onClick={() => moveTo(index, 1)}
                  disabled={index === images.length - 1}
                  className="rounded p-1 text-warm-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center text-sm transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-5 w-5 text-muted-foreground" />
        )}
        <p className="text-muted-foreground">Drag & drop images here, or</p>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={isPending}>
          Choose files
        </Button>
        <p className="text-xs text-muted-foreground/70">JPEG, PNG or WebP, up to 5MB each.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      <input type="hidden" name="image" value={images[0] ?? ""} />
      {images.map((url) => (
        <input key={url} type="hidden" name="gallery" value={url} />
      ))}
    </div>
  );
}
