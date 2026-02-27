/**
 * seed-customers.ts
 * -----------------
 * Seed script: populates the Firestore `customers` collection with initial
 * sample customer data for the LogisticsVisionBeta application.
 *
 * Usage (NOT accessible via web routes):
 *   npm run setup:customers
 *   npx tsx src/lib/seed-customers.ts
 *
 * Requires FIREBASE_ADMIN_SDK_PATH environment variable pointing to a valid
 * Firebase Admin SDK service account JSON file.
 */

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_PATH;
if (!serviceAccountPath) {
  console.error('Error: FIREBASE_ADMIN_SDK_PATH environment variable is not set.');
  console.error('Set it in .env.local pointing to your Firebase service account JSON.');
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: Service account file not found at: ${resolvedPath}`);
  process.exit(1);
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

interface CustomerSeed {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
  createdAt: admin.firestore.FieldValue;
  updatedAt: admin.firestore.FieldValue;
}

const sampleCustomers: Omit<CustomerSeed, 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Acme Logistics Ltd',
    email: 'contact@acmelogistics.com',
    phone: '+1-555-0101',
    address: '123 Freight Way',
    city: 'Chicago',
    country: 'USA',
    status: 'active',
  },
  {
    name: 'Blue Ocean Shipping',
    email: 'info@blueoceanship.com',
    phone: '+1-555-0202',
    address: '456 Harbor Drive',
    city: 'Los Angeles',
    country: 'USA',
    status: 'active',
  },
  {
    name: 'Summit Supply Chain',
    email: 'ops@summitsupply.com',
    phone: '+1-555-0303',
    address: '789 Mountain Blvd',
    city: 'Denver',
    country: 'USA',
    status: 'active',
  },
  {
    name: 'Global Freight Partners',
    email: 'hello@globalfreight.com',
    phone: '+1-555-0404',
    address: '321 International Ave',
    city: 'New York',
    country: 'USA',
    status: 'active',
  },
  {
    name: 'Swift Carriers Inc',
    email: 'dispatch@swiftcarriers.com',
    phone: '+1-555-0505',
    address: '654 Express Lane',
    city: 'Dallas',
    country: 'USA',
    status: 'inactive',
  },
];

async function seedCustomers(): Promise<void> {
  console.log('Starting customer seed...');

  const customersRef = db.collection('customers');
  const batch = db.batch();

  for (const customer of sampleCustomers) {
    const docRef = customersRef.doc();
    const customerData: CustomerSeed = {
      ...customer,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    batch.set(docRef, customerData);
    console.log(`  Queued: ${customer.name}`);
  }

  await batch.commit();
  console.log(`\nSuccessfully seeded ${sampleCustomers.length} customers into Firestore.`);
  console.log('Customer seeding complete!');
}

seedCustomers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding customers:', error);
    process.exit(1);
  });
