// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';

// Support both file path (local) and direct JSON content (Vercel)
let serviceAccount: object;

if (process.env.FIREBASE_ADMIN_KEY_JSON) {
  // Direct JSON content from environment variable (Vercel)
  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY_JSON);
} else if (process.env.FIREBASE_ADMIN_KEY_PATH) {
  // File path (local development)
  const serviceAccountPath = process.env.FIREBASE_ADMIN_KEY_PATH;
  if (existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  } else {
    throw new Error(`Firebase admin key file not found: ${serviceAccountPath}`);
  }
} else {
  throw new Error('FIREBASE_ADMIN_KEY_JSON or FIREBASE_ADMIN_KEY_PATH environment variable is required');
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

export const adminAuth = getAuth();
