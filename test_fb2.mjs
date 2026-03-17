import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { existsSync } from 'fs';

// Try with different config approaches
const projectId = 'logisticsvisionbeta';

// Remove GOOGLE_APPLICATION_CREDENTIALS env var if it points to missing file
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credPath && !existsSync(credPath)) {
  delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

// Force set GCLOUD_PROJECT
process.env.GCLOUD_PROJECT = projectId;
process.env.GOOGLE_CLOUD_PROJECT = projectId;

const { applicationDefault } = await import('firebase-admin/app');

try {
  const app = initializeApp({
    credential: applicationDefault(),
    projectId,
  });
  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  console.log('Firestore initialized');
  
  // Set a 10s timeout
  const timeout = setTimeout(() => {
    console.error('Write timed out after 10 seconds');
    process.exit(1);
  }, 10000);
  
  const result = await db.collection('vehicles').add({make: 'Test', model: 'TestModel', ts: new Date()});
  clearTimeout(timeout);
  console.log('Write successful! Doc ID:', result.id);
  await db.collection('vehicles').doc(result.id).delete();
  console.log('Cleanup done');
  process.exit(0);
} catch(e) {
  console.error('Error:', e.message.substring(0, 200));
  process.exit(1);
}
