import { notFound } from "next/navigation";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { getCollectionDef } from "@/lib/admin/schema";

export default async function AdminCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const def = getCollectionDef(collection);
  if (!def) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <CollectionEditor def={def} />
    </div>
  );
}
