"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Copy,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-fields";
import { FieldsForm, makeDefaults, type Doc } from "@/components/admin/fields";
import type { CollectionDef, FieldDef } from "@/lib/admin/schema";
import { cn } from "@/lib/utils";

/* ── data hooks ─────────────────────────────────────────────── */

async function fetchCollection(key: string) {
  const res = await fetch(`/api/admin/content/${key}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Failed to load content");
  return body.data as unknown;
}

async function saveCollection(key: string, data: unknown) {
  const res = await fetch(`/api/admin/content/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Save failed");
}

function newItem(def: CollectionDef): Doc {
  const item = makeDefaults(def.fields);
  if (def.hiddenIdField) {
    item[def.hiddenIdField] = `itm-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;
  }
  return item;
}

/* ── shared list editor ─────────────────────────────────────── */

function ListItems({
  items,
  fields,
  labelField,
  onChange,
  makeNew,
  addLabel,
}: {
  items: Doc[];
  fields: FieldDef[];
  labelField?: string;
  onChange: (items: Doc[]) => void;
  makeNew: () => Doc;
  addLabel: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIndex(null);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        const label =
          (labelField && (item[labelField] as string)) || `Item ${i + 1}`;
        return (
          <div
            key={i}
            className={cn(
              "rounded-2xl border transition-colors",
              open ? "border-gold/40 bg-white/[0.03]" : "border-white/10",
            )}
          >
            <div className="flex items-center gap-1 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex flex-1 cursor-pointer items-center gap-3 text-left"
              >
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted transition-transform",
                    open && "rotate-180 text-gold",
                  )}
                  aria-hidden
                />
                <span className="truncate text-sm font-medium text-foreground/90">
                  {label}
                </span>
              </button>
              <IconBtn label={`Move ${label} up`} onClick={() => move(i, -1)} disabled={i === 0}>
                <ArrowUp className="size-3.5" aria-hidden />
              </IconBtn>
              <IconBtn
                label={`Move ${label} down`}
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
              >
                <ArrowDown className="size-3.5" aria-hidden />
              </IconBtn>
              <IconBtn
                label={`Duplicate ${label}`}
                onClick={() => {
                  const copy = { ...item };
                  const withId = makeNew();
                  for (const k of Object.keys(withId)) {
                    if (!(k in copy)) copy[k] = withId[k];
                  }
                  onChange([...items.slice(0, i + 1), copy, ...items.slice(i + 1)]);
                }}
              >
                <Copy className="size-3.5" aria-hidden />
              </IconBtn>
              <IconBtn
                label={`Delete ${label}`}
                danger
                onClick={() => {
                  if (window.confirm(`Delete “${label}”?`)) {
                    onChange(items.filter((_, j) => j !== i));
                    setOpenIndex(null);
                  }
                }}
              >
                <Trash2 className="size-3.5" aria-hidden />
              </IconBtn>
            </div>
            {open ? (
              <div className="border-t border-white/5 p-5">
                <FieldsForm
                  fields={fields}
                  value={item}
                  onChange={(v) => onChange(items.map((s, j) => (j === i ? v : s)))}
                  idPrefix={`item-${i}`}
                />
              </div>
            ) : null}
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          onChange([...items, makeNew()]);
          setOpenIndex(items.length);
        }}
      >
        <Plus className="size-4" aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg p-2 text-muted transition-colors disabled:opacity-30",
        danger ? "hover:text-flame-red" : "hover:text-gold-light",
      )}
    >
      {children}
    </button>
  );
}

/* ── menu editor (categories → items) ───────────────────────── */

interface MenuCategoryDoc extends Doc {
  id: string;
  label: string;
  items: Doc[];
}

function MenuEditor({
  def,
  value,
  onChange,
}: {
  def: CollectionDef;
  value: MenuCategoryDoc[];
  onChange: (v: MenuCategoryDoc[]) => void;
}) {
  const [activeId, setActiveId] = useState(value[0]?.id ?? "");
  const active = value.find((c) => c.id === activeId) ?? value[0];

  const updateCategory = (id: string, patch: Partial<MenuCategoryDoc>) =>
    onChange(value.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {value.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveId(category.id)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
              category.id === active?.id
                ? "bg-gold text-black"
                : "glass text-muted hover:text-gold-light",
            )}
          >
            {category.label} ({category.items.length})
          </button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const label = window.prompt("New category name?");
            if (!label) return;
            const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            if (!id || value.some((c) => c.id === id)) return;
            onChange([...value, { id, label, items: [] }]);
            setActiveId(id);
          }}
        >
          <Plus className="size-3.5" aria-hidden /> Category
        </Button>
      </div>

      {active ? (
        <>
          <div className="mb-5 flex items-end gap-3">
            <div className="flex-1">
              <label
                htmlFor="category-label"
                className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted"
              >
                Category name
              </label>
              <Input
                id="category-label"
                value={active.label}
                onChange={(e) => updateCategory(active.id, { label: e.target.value })}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-flame-red"
              onClick={() => {
                if (
                  window.confirm(
                    `Delete the whole “${active.label}” category and its ${active.items.length} dishes?`,
                  )
                ) {
                  const next = value.filter((c) => c.id !== active.id);
                  onChange(next);
                  setActiveId(next[0]?.id ?? "");
                }
              }}
            >
              <Trash2 className="size-3.5" aria-hidden /> Delete category
            </Button>
          </div>

          <ListItems
            items={active.items}
            fields={def.fields}
            labelField={def.itemLabelField}
            onChange={(items) => updateCategory(active.id, { items })}
            makeNew={() => newItem(def)}
            addLabel={`Add dish to ${active.label}`}
          />
        </>
      ) : (
        <p className="text-sm text-muted">Add a category to get started.</p>
      )}
    </div>
  );
}

/* ── main editor ────────────────────────────────────────────── */

export function CollectionEditor({ def }: { def: CollectionDef }) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["admin-content", def.key],
    queryFn: () => fetchCollection(def.key),
  });

  const [draft, setDraft] = useState<unknown>(undefined);
  const value = draft !== undefined ? draft : query.data;
  const dirty = useMemo(
    () => draft !== undefined && JSON.stringify(draft) !== JSON.stringify(query.data),
    [draft, query.data],
  );

  const mutation = useMutation({
    mutationFn: (data: unknown) => saveCollection(def.key, data),
    onSuccess: () => {
      queryClient.setQueryData(["admin-content", def.key], value);
      setDraft(undefined);
    },
  });

  if (query.isPending) {
    return (
      <div className="space-y-4" aria-label="Loading content">
        <div className="skeleton h-12 rounded-xl" />
        <div className="skeleton h-40 rounded-2xl" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }
  if (query.isError) {
    return (
      <p role="alert" className="text-sm text-flame-red">
        {query.error instanceof Error ? query.error.message : "Failed to load"}
      </p>
    );
  }

  return (
    <div>
      {/* Sticky save bar */}
      <div className="glass-strong sticky top-4 z-20 mb-8 flex items-center justify-between gap-4 rounded-2xl px-5 py-3">
        <div className="min-w-0">
          <h1 className="truncate font-heading text-xl text-foreground">
            {def.label}
          </h1>
          <p className="truncate text-xs text-muted">{def.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {mutation.isSuccess && !dirty ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400" role="status">
              <CheckCircle2 className="size-3.5" aria-hidden /> Published
            </span>
          ) : dirty ? (
            <span className="text-xs text-gold-light">Unsaved changes</span>
          ) : null}
          <Button
            type="button"
            size="sm"
            disabled={!dirty || mutation.isPending}
            onClick={() => mutation.mutate(value)}
          >
            {mutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Save className="size-3.5" aria-hidden />
            )}
            {mutation.isPending ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </div>

      {mutation.isError ? (
        <p role="alert" className="mb-6 rounded-xl border border-flame-red/40 bg-flame-red/10 px-4 py-3 text-sm text-flame-red">
          {mutation.error instanceof Error ? mutation.error.message : "Save failed"}
        </p>
      ) : null}

      {def.kind === "singleton" ? (
        <div className="max-w-2xl">
          <FieldsForm
            fields={def.fields}
            value={(value as Doc) ?? {}}
            onChange={(v) => setDraft(v)}
            idPrefix={def.key}
          />
        </div>
      ) : def.kind === "menu" ? (
        <MenuEditor
          def={def}
          value={(value as MenuCategoryDoc[]) ?? []}
          onChange={(v) => setDraft(v)}
        />
      ) : (
        <ListItems
          items={(value as Doc[]) ?? []}
          fields={def.fields}
          labelField={def.itemLabelField}
          onChange={(v) => setDraft(v)}
          makeNew={() => newItem(def)}
          addLabel={`Add ${def.label.replace(/s$/, "").toLowerCase()}`}
        />
      )}
    </div>
  );
}
