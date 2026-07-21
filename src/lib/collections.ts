import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Collection } from "@/lib/types";

const COLLECTIONS_PATH = "collections";

function mapCollection(id: string, data: Record<string, unknown>): Collection {
  return {
    id,
    name: (data.name as string) ?? "",
    slug: (data.slug as string) ?? "",
    imageUrl: (data.imageUrl as string) ?? "",
    order: (data.order as number) ?? 0,
    visible: (data.visible as boolean) ?? true,
    createdAt: (data.createdAt as Timestamp | undefined)?.toMillis?.(),
  };
}

export async function getVisibleCollections(): Promise<Collection[]> {
  // Filter/sort in JS instead of combining where()+orderBy() in the query —
  // that combination needs a composite Firestore index to be created first.
  const q = query(collection(db, COLLECTIONS_PATH), where("visible", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => mapCollection(d.id, d.data()))
    .sort((a, b) => a.order - b.order);
}

export async function getAllCollections(): Promise<Collection[]> {
  const q = query(collection(db, COLLECTIONS_PATH), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapCollection(d.id, d.data()));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const q = query(collection(db, COLLECTIONS_PATH), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return mapCollection(d.id, d.data());
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  const d = await getDoc(doc(db, COLLECTIONS_PATH, id));
  if (!d.exists()) return null;
  return mapCollection(d.id, d.data());
}

export interface CollectionInput {
  name: string;
  slug: string;
  imageUrl?: string;
  order: number;
  visible: boolean;
}

export async function createCollection(input: CollectionInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS_PATH), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCollection(
  id: string,
  input: Partial<CollectionInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS_PATH, id), { ...input });
}

export async function deleteCollection(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS_PATH, id));
}
