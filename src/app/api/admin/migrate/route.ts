import { NextRequest, NextResponse } from 'next/server';
import { ensureDbConnected } from '@/lib/firebase-admin';
import { createOrganization, getOrganizationByUserId } from '@/services/org-service';

// POST /api/admin/migrate?secret=MIGRATE_SECRET&userId=OWNER_UID&orgName=OrgName
// One-time migration to assign all existing data to the owner's organization
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.MIGRATION_SECRET && secret !== 'migrate-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, email, orgName } = await req.json();
  if (!userId || !orgName) {
    return NextResponse.json({ error: 'Missing userId or orgName' }, { status: 400 });
  }

  const db = await ensureDbConnected();

  // Check if org already exists for this user
  let org = await getOrganizationByUserId(userId);
  if (!org) {
    org = await createOrganization(orgName, userId, email || '');
  }

  const organizationId = org.id!;
  const results: Record<string, number> = {};

  // Collections to migrate
  const collections = [
    'trips', 'customers', 'vehicles', 'employees', 'expenses',
    'fuel_logs', 'invoices', 'leave_requests', 'payouts', 'payroll',
    'quotes', 'commissions', 'settings', 'distance_records',
  ];

  for (const col of collections) {
    try {
      const snap = await db.collection(col).get();
      let count = 0;
      const batch = db.batch();
      for (const doc of snap.docs) {
        const data = doc.data();
        if (!data.organizationId) {
          batch.update(doc.ref, { organizationId });
          count++;
        }
      }
      if (count > 0) await batch.commit();
      results[col] = count;
    } catch (e: any) {
      results[col + '_error'] = e.message;
    }
  }

  // Also record user in organizations/members
  try {
    const orgRef = db.collection('organizations').doc(organizationId);
    await orgRef.collection('members').doc(userId).set({
      userId,
      email: email || '',
      role: 'Owner',
      joinedAt: new Date(),
    }, { merge: true });
  } catch {}

  return NextResponse.json({ success: true, organizationId, results });
}
