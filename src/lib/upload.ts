import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadProductImage(file: File): Promise<string> {
  const path = `products/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadCollectionImage(file: File): Promise<string> {
  const path = `collections/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
