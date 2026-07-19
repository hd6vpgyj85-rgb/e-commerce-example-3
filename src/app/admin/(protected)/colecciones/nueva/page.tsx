import { CollectionForm } from "@/components/admin/CollectionForm";

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.08em] text-off-white">
        NUEVA COLECCIÓN
      </h1>
      <div className="mt-8">
        <CollectionForm />
      </div>
    </div>
  );
}
