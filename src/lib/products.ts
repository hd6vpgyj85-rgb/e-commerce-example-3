import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product, ProductVariant } from "@/lib/types";

const PRODUCTS_PATH = "products";

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: (data.name as string) ?? "",
    slug: (data.slug as string) ?? "",
    description: (data.description as string) ?? "",
    price: (data.price as number) ?? 0,
    discountPrice: (data.discountPrice as number | null | undefined) ?? null,
    stock: (data.stock as number) ?? 0,
    images: (data.images as string[]) ?? [],
    collectionIds: (data.collectionIds as string[]) ?? [],
    variants: (data.variants as ProductVariant[]) ?? [],
    visible: (data.visible as boolean) ?? true,
    createdAt: (data.createdAt as Timestamp | undefined)?.toMillis?.(),
  };
}

export async function getVisibleProducts(): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_PATH),
    where("visible", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
}

export async function getAllProducts(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS_PATH), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
}

export async function getProductsByCollectionId(
  collectionId: string
): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_PATH),
    where("visible", "==", true),
    where("collectionIds", "array-contains", collectionId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Also filter on visible so the security rule can evaluate this "list"
  // query per-document (it depends on the same field being queried).
  const q = query(
    collection(db, PRODUCTS_PATH),
    where("slug", "==", slug),
    where("visible", "==", true)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return mapProduct(d.id, d.data());
}

export async function getProductById(id: string): Promise<Product | null> {
  const d = await getDoc(doc(db, PRODUCTS_PATH, id));
  if (!d.exists()) return null;
  return mapProduct(d.id, d.data());
}

export async function getRandomRelatedProducts(
  excludeId: string,
  count = 4
): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_PATH),
    where("visible", "==", true),
    fbLimit(50)
  );
  const snap = await getDocs(q);
  const pool = snap.docs
    .map((d) => mapProduct(d.id, d.data()))
    .filter((p) => p.id !== excludeId);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  images: string[];
  collectionIds: string[];
  variants: ProductVariant[];
  visible: boolean;
}

export async function createProduct(input: ProductInput): Promise<string> {
  const docRef = await addDoc(collection(db, PRODUCTS_PATH), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_PATH, id), { ...input });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_PATH, id));
}
