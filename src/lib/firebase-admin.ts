// src/lib/firebase-admin.ts
import { initializeApp, getApps, App, cert, applicationDefault } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage,  } from "firebase-admin/storage";
import "dotenv/config";

let adminApp: App | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: any | null = null;
let initializationError: string | null = null;

function initializeFirebaseAdmin() {
  try {
    // Use existing app if already initialized
    if (getApps().length > 0) {
      adminApp = getApps()[0];
      console.log("✅ Using existing Firebase Admin app.");
    } else {
      // Initialize new app
      adminApp = initializeApp({
        credential: applicationDefault(),
        storageBucket: process.env.STORAGE_BUCKET || undefined, // optional
      });
      console.log("✅ Firebase Admin SDK initialized using service account.");
    }

    if (adminApp) {
      auth = getAuth(adminApp);
      db = getFirestore(adminApp);

      console.log("✅ Firestore connected successfully.");

      if (process.env.STORAGE_BUCKET) {
        storage = getStorage(adminApp).bucket(process.env.STORAGE_BUCKET);
        console.log(`✅ Storage connected: ${process.env.STORAGE_BUCKET}`);
      } else {
        console.warn("⚠ STORAGE_BUCKET not set. Storage unavailable.");
      }
    } else {
      auth = undefined;
      db = undefined;
      storage = null;
      initializationError = "Firebase Admin initialization failed.";
    }
  } catch (err: any) {
    initializationError = `Firebase Admin SDK initialization failed: ${err.message}`;
    console.error(initializationError);
  }
}

// Initialize Firebase Admin immediately
initializeFirebaseAdmin();

// Helper to ensure Firestore is available
function ensureDbConnected(): Firestore {
  if (!db) {
    throw new Error(
      initializationError || "Firestore is not initialized. Cannot connect to database."
    );
  }
  return db;
}

// Export everything
export { db, auth, storage, initializationError, ensureDbConnected };
