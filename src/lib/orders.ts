import {
  collection,
  doc,
  getDocs,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

const ORDERS_PATH = "orders";

function mapOrder(id: string, data: Record<string, unknown>): Order {
  return {
    id,
    items: (data.items as OrderItem[]) ?? [],
    total: (data.total as number) ?? 0,
    status: (data.status as OrderStatus) ?? "pendiente",
    customerName: (data.customerName as string) ?? "",
    customerPhone: (data.customerPhone as string) ?? "",
    customerEmail: (data.customerEmail as string) ?? "",
    contactMessage: (data.contactMessage as string) ?? "",
    createdAt: (data.createdAt as Timestamp | undefined)?.toMillis?.(),
  };
}

export async function createOrder(
  items: OrderItem[],
  total: number,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  contactMessage: string
): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_PATH), {
    items,
    total,
    status: "pendiente" as OrderStatus,
    customerName,
    customerPhone,
    customerEmail,
    contactMessage,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, ORDERS_PATH), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapOrder(d.id, d.data()));
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  await updateDoc(doc(db, ORDERS_PATH, id), { status });
}
