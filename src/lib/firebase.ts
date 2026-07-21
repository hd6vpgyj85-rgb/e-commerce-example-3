import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

export const isFirebaseConfigured =
  useEmulators || Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// When Firebase hasn't been configured yet (no env vars set), fall back to a
// syntactically valid placeholder so SDK initialization doesn't throw at
// import time — e.g. during `next build` before the real project is wired up.
// Real calls will simply fail until NEXT_PUBLIC_FIREBASE_* env vars are set.
const appConfig: FirebaseOptions = isFirebaseConfigured
  ? {
      apiKey: firebaseConfig.apiKey || "demo-api-key",
      authDomain: firebaseConfig.authDomain || "demo-netly.firebaseapp.com",
      projectId: firebaseConfig.projectId || "demo-netly",
      messagingSenderId: firebaseConfig.messagingSenderId || "0",
      appId: firebaseConfig.appId || "1:0:web:0",
    }
  : {
      apiKey: "placeholder-api-key",
      authDomain: "placeholder.firebaseapp.com",
      projectId: "placeholder-project",
      messagingSenderId: "0",
      appId: "1:0:web:0",
    };

export const firebaseApp = getApps().length ? getApp() : initializeApp(appConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

declare global {
  var __netlyEmulatorsConnected: boolean | undefined;
}

if (useEmulators && !globalThis.__netlyEmulatorsConnected) {
  globalThis.__netlyEmulatorsConnected = true;
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}
