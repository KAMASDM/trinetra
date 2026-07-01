"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type TagInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string[];
};

export default function TagInput({ name, label, placeholder, defaultValue = [] }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  function addTag(value: string) {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setDraft("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setDraft("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-foreground/10"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={tags.length ? "" : placeholder}
          className="h-7 flex-1 border-none p-0 shadow-none focus-visible:ring-0"
        />
      </div>
      {tags.map((tag) => (
        <input key={tag} type="hidden" name={name} value={tag} />
      ))}
    </div>
  );
}
