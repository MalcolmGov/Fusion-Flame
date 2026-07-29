"use client";

/** Generic field renderers driven by lib/admin/schema.ts. */

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { Input, Label, Select, Textarea } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import type { FieldDef } from "@/lib/admin/schema";
import { cn } from "@/lib/utils";

export type Doc = Record<string, unknown>;

interface FieldInputProps {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  idPrefix: string;
}

export function FieldsForm({
  fields,
  value,
  onChange,
  idPrefix,
}: {
  fields: FieldDef[];
  value: Doc;
  onChange: (value: Doc) => void;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-5">
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={value?.[field.name]}
          onChange={(v) => onChange({ ...value, [field.name]: v })}
          idPrefix={idPrefix}
        />
      ))}
    </div>
  );
}

export function FieldInput({ field, value, onChange, idPrefix }: FieldInputProps) {
  const id = `${idPrefix}-${field.name}`;

  switch (field.type) {
    case "text":
    case "date":
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <Input
            id={id}
            type={field.type === "date" ? "date" : "text"}
            className={field.type === "date" ? "[color-scheme:dark]" : undefined}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <FieldHelp text={field.help} />
        </div>
      );

    case "textarea":
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <Textarea
            id={id}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <FieldHelp text={field.help} />
        </div>
      );

    case "number":
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <Input
            id={id}
            type="number"
            min={field.min}
            max={field.max}
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) =>
              onChange(e.target.value === "" ? 0 : Number(e.target.value))
            }
          />
          <FieldHelp text={field.help} />
        </div>
      );

    case "boolean":
      return (
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-gold/30"
        >
          <span className="text-sm text-foreground/90">{field.label}</span>
          <span
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              value ? "bg-gold" : "bg-white/15",
            )}
          >
            <input
              id={id}
              type="checkbox"
              className="peer sr-only"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white transition-all",
                value ? "left-[22px]" : "left-0.5",
              )}
            />
          </span>
        </label>
      );

    case "select":
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <Select
            id={id}
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) => {
              const raw = e.target.value;
              const opt = field.options?.find((o) => String(o.value) === raw);
              onChange(opt ? opt.value : raw);
            }}
          >
            {field.options?.map((o) => (
              <option key={String(o.value)} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </Select>
          <FieldHelp text={field.help} />
        </div>
      );

    case "image":
      return (
        <ImageField
          id={id}
          label={field.label}
          value={(value as string) ?? ""}
          onChange={onChange}
          help={field.help}
        />
      );

    case "string-list": {
      const items = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div>
          <Label>{field.label}</Label>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Textarea
                  aria-label={`${field.label} ${i + 1}`}
                  className="min-h-16"
                  value={item}
                  onChange={(e) =>
                    onChange(items.map((s, j) => (j === i ? e.target.value : s)))
                  }
                />
                <button
                  type="button"
                  aria-label={`Remove ${field.label} ${i + 1}`}
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="glass h-10 shrink-0 cursor-pointer rounded-lg px-3 text-muted transition-colors hover:text-flame-red"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([...items, ""])}
            >
              <Plus className="size-3.5" aria-hidden /> Add
            </Button>
          </div>
        </div>
      );
    }

    case "object":
      return (
        <fieldset className="rounded-2xl border border-white/10 p-4">
          <legend className="px-2 text-[11px] uppercase tracking-[0.18em] text-gold">
            {field.label}
          </legend>
          <FieldsForm
            fields={field.subfields ?? []}
            value={(value as Doc) ?? {}}
            onChange={onChange as (v: Doc) => void}
            idPrefix={id}
          />
        </fieldset>
      );

    case "object-list": {
      const items = Array.isArray(value) ? (value as Doc[]) : [];
      return (
        <fieldset className="rounded-2xl border border-white/10 p-4">
          <legend className="px-2 text-[11px] uppercase tracking-[0.18em] text-gold">
            {field.label}
          </legend>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <button
                  type="button"
                  aria-label={`Remove ${field.label} ${i + 1}`}
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="absolute right-3 top-3 cursor-pointer text-muted transition-colors hover:text-flame-red"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
                <FieldsForm
                  fields={field.subfields ?? []}
                  value={item}
                  onChange={(v) => onChange(items.map((s, j) => (j === i ? v : s)))}
                  idPrefix={`${id}-${i}`}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([...items, makeDefaults(field.subfields ?? [])])}
            >
              <Plus className="size-3.5" aria-hidden /> Add
            </Button>
          </div>
        </fieldset>
      );
    }
  }
}

function FieldHelp({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1.5 text-xs text-muted/70">{text}</p>;
}

function ImageField({
  id,
  label,
  value,
  onChange,
  help,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Upload failed");
      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-start gap-3">
        {value ? (
          // Plain img: admin previews arbitrary URLs the optimizer may not allow.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="size-20 shrink-0 rounded-lg border border-white/10 object-cover"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/15 text-muted">
            <ImagePlus className="size-6" aria-hidden />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Input
            id={id}
            placeholder="Paste an image URL…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
              ) : (
                <ImagePlus className="size-3.5" aria-hidden />
              )}
              {uploading ? "Uploading…" : "Upload"}
            </Button>
            <span className="text-xs text-muted/70">
              or use an Unsplash / Pexels URL
            </span>
          </div>
          {error ? (
            <p role="alert" className="text-xs text-flame-red">
              {error}
            </p>
          ) : null}
        </div>
      </div>
      <FieldHelp text={help} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function makeDefaults(fields: FieldDef[]): Doc {
  const out: Doc = {};
  for (const f of fields) {
    switch (f.type) {
      case "number":
        out[f.name] = 0;
        break;
      case "boolean":
        out[f.name] = f.name === "available";
        break;
      case "select":
        out[f.name] = f.options?.[0]?.value ?? "";
        break;
      case "string-list":
      case "object-list":
        out[f.name] = [];
        break;
      case "object":
        out[f.name] = makeDefaults(f.subfields ?? []);
        break;
      default:
        out[f.name] = "";
    }
  }
  return out;
}
