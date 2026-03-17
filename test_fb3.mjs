import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { applicationDefault } from 'firebase-admin/app';
import { existsSync } from 'fs';

// Remove GOOGLE_APPLICATION_CREDENTIALS if file missing
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credPath && !existsSync(credPath)) {
  delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

// Explicitly set project
process.env.GOOGLE_CLOUD_PROJECT = 'logisticsvisionbeta';

try {
  const app = initializeApp({
    credential: applicationDefault(),
    projectId: 'logisticsvisionbeta',
  });
  const db = getFirestore(app);
  
  // Set shorter deadline
  db.settings({ 
    ignoreUndefinedProperties: true,
    timeout: 15000 
  });
  
  console.log('DB initialized for project:', app.options.projectId);
  
  const t1 = Date.now();
  const result = await db.collection('vehicles').limit(1).get();
  console.log(`Read success in ${Date.now()-t1}ms! Docs:`, result.size);
  process.exit(0);
} catch(e) {
  console.error('Error:', e.code, e.message?.substring(0, 150));
  process.exit(1);
}
