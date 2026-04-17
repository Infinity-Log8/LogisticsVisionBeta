// src/lib/firebase-admin.ts
import { initializeApp, getApps, App, cert, applicationDefault } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage,  } from "firebase-admin/storage";
import "dotenv/config";
import * as fs from "fs";

let adminApp: App | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: any | null = null;
let initializationError: string | null = null;

function initializeFirebaseAdmin() {
  try {
    // If GOOGLE_APPLICATION_CREDENTIALS points to a missing file, clear it
    // so applicationDefault() falls back to GCP metadata server
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath && !fs.existsSync(credPath)) {
      console.warn(`⚠️ GOOGLE_APPLICATION_CREDENTIALS points to missing file: ${credPath}. Clearing to use metadata server.`);
      delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    // Use existing app if already initialized
    if (getApps().length > 0) {
      adminApp = getApps()[0];
      console.log("✅ Using existing Firebase Admin app.");
    } else {
      // Initialize new app
      // Determine credential: use FIREBASE_SERVICE_ACCOUNT env var if available (for Vercel),
      // otherwise fall back to applicationDefault() (for GCP/Firebase Studio)
      let credential;
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = cert(serviceAccount);
        console.log("✅ Using FIREBASE_SERVICE_ACCOUNT for credentials.");
      } else {
        credential = applicationDefault();
        console.log("✅ Using applicationDefault() for credentials.");
      }

      adminApp = initializeApp({
        credential,
        projectId: process.env.GOOGLE_CLOUD_PROJECT || "logisticsvisionbeta",
        storageBucket: process.env.STORAGE_BUCKET || undefined, // optional
      });
      console.log("✅ Firebase Admin SDK initialized.");
    }

    if (adminApp) {
      auth = getAuth(adminApp);
      db = getFirestore(adminApp, process.env.FIRESTORE_DB_ID || 'logisticsvision');

      console.log("✅ Firestore connected successfully.");

      if (process.env.STORAGE_BUCKET) {
        storage = getStorage(adminApp).bucket(process.env.STORAGE_BUCKET);
        console.log(`✅ Storage connected: ${process.env.STORAGE_BUCKET}`);
      } else {
        console.warn("⚠️ STORAGE_BUCKET not set. Storage unavailable.");
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
