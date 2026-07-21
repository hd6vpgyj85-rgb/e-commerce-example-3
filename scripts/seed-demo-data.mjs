import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Faltan las variables NEXT_PUBLIC_FIREBASE_* — revisa tu .env.local"
  );
  process.exit(1);
}
if (!email || !password) {
  console.error(
    "Define SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD (las credenciales de tu " +
      "usuario admin de Firebase Auth) antes de correr este script."
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (useEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

async function uploadImage(fileName, storagePath) {
  const localPath = path.join(__dirname, "seed-assets", fileName);
  const bytes = readFileSync(localPath);
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, bytes, { contentType: "image/jpeg" });
  return getDownloadURL(storageRef);
}

const products = [
  {
    name: "Print Spider Punk",
    slug: "print-spider-punk",
    description:
      "Ilustración digital estilo punk, impresión de alta calidad lista para enmarcar.",
    price: 350,
    discountPrice: null,
    stock: 8,
    file: "spider-punk.jpg",
    variants: [{ name: "Tamaño", options: ["Chico", "Mediano", "Grande"] }],
  },
  {
    name: "Fotografía Mural No Drugs",
    slug: "fotografia-mural-no-drugs",
    description:
      "Fotografía de arte urbano en gran formato, impresión mate sobre papel fotográfico.",
    price: 280,
    discountPrice: 240,
    stock: 6,
    file: "graffiti-no-drugs.jpg",
    variants: [{ name: "Tamaño", options: ["Chico", "Mediano"] }],
  },
  {
    name: "Pintura Guardián Abstracto",
    slug: "pintura-guardian-abstracto",
    description: "Pintura original acrílica sobre lienzo, pieza única.",
    price: 600,
    discountPrice: null,
    stock: 1,
    file: "pintura-abstracta.jpg",
    variants: [],
  },
];

async function main() {
  await signInWithEmailAndPassword(auth, email, password);
  console.log("Sesión iniciada como", email);

  const collectionRef = await addDoc(collection(db, "collections"), {
    name: "Arte Urbano",
    slug: "arte-urbano",
    imageUrl: "",
    order: 0,
    visible: true,
    createdAt: serverTimestamp(),
  });
  console.log("Colección creada:", collectionRef.id);

  for (const p of products) {
    const url = await uploadImage(p.file, `products/seed-${Date.now()}-${p.file}`);
    const docRef = await addDoc(collection(db, "products"), {
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      stock: p.stock,
      images: [url],
      collectionIds: [collectionRef.id],
      variants: p.variants,
      visible: true,
      createdAt: serverTimestamp(),
    });
    console.log("Producto creado:", p.name, docRef.id);
  }

  console.log("Listo — datos de ejemplo creados.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
