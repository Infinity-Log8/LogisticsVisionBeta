const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}

const db = admin.firestore();

async function migrateVehicles() {
  console.log('Fetching all vehicles...');
  const snap = await db.collection('vehicles').get();
  const vehicles = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
  
  console.log('Found', vehicles.length, 'vehicles:');
  vehicles.forEach(v => console.log(' -', v.firestoreId));
  
  // Sort: VEH-NNNNN first by number, then others
  vehicles.sort((a, b) => {
    const aMatch = a.firestoreId.match(/VEH-0*(\d+)/);
    const bMatch = b.firestoreId.match(/VEH-0*(\d+)/);
    const aNum = aMatch ? parseInt(aMatch[1]) : 99999;
    const bNum = bMatch ? parseInt(bMatch[1]) : 99999;
    return aNum - bNum;
  });
  
  console.log('\nPlanned renames:');
  const renames = [];
  for (let i = 0; i < vehicles.length; i++) {
    const newId = 'VEH-' + String(i + 1).padStart(5, '0');
    const oldId = vehicles[i].firestoreId;
    if (oldId !== newId) {
      renames.push({ oldId, newId, data: vehicles[i] });
      console.log(' ', oldId, '->', newId);
    } else {
      console.log(' ', oldId, '(no change)');
    }
  }
  
  if (renames.length === 0) {
    console.log('No renames needed!');
    return;
  }
  
  // Execute renames - create new, delete old
  const batch = db.batch();
  for (const { oldId, newId, data } of renames) {
    const { firestoreId, ...cleanData } = data;
    batch.set(db.collection('vehicles').doc(newId), cleanData);
    batch.delete(db.collection('vehicles').doc(oldId));
  }
  
  console.log('\nCommitting batch...');
  await batch.commit();
  console.log('SUCCESS! All', renames.length, 'vehicles renumbered.');
}

migrateVehicles().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
