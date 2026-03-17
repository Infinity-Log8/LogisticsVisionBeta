import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { applicationDefault } from 'firebase-admin/app';
import { readFileSync, existsSync } from 'fs';

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credPath && !existsSync(credPath)) {
  console.log('Clearing missing cred path:', credPath);
  delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
console.log('GOOGLE_APPLICATION_CREDENTIALS now:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

try {
  const app = initializeApp({credential: applicationDefault(), projectId: 'logisticsvisionbeta'});
  const db = getFirestore(app);
  console.log('Firestore initialized');
  const result = await db.collection('vehicles').add({test: true, make: 'Test', model: 'TestModel', createdAt: new Date()});
  console.log('Write successful! Doc ID:', result.id);
  // Clean up
  await db.collection('vehicles').doc(result.id).delete();
  console.log('Cleanup done');
} catch(e) {
  console.error('Error:', e.message);
}
