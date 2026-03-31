
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
const db = getFirestore();
const auth = getAuth();
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import type {
  Tenant,
  TenantMember,
  TenantInvite,
  TenantRole,
  TenantSettings,
} from './tenant-types';

// ─── Firestore path helpers ────────────────────────────────────────────────

export const tenantRef = (tenantId: string) =>
  db.collection('tenants').doc(tenantId);

export const memberRef = (tenantId: string, userId: string) =>
  db.collection('tenants').doc(tenantId).collection('members').doc(userId);

export const inviteRef = (tenantId: string, inviteId: string) =>
  db.collection('tenants').doc(tenantId).collection('invites').doc(inviteId);

// ─── Tenant CRUD ───────────────────────────────────────────────────────────

export async function createTenant(
  ownerId: string,
  ownerEmail: string,
  name: string,
  plan: Tenant['plan'] = 'starter'
): Promise<Tenant> {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  const tenantId = db.collection('tenants').doc().id;
  const now = Timestamp.now();

  const defaultSettings: TenantSettings = {
    maxUsers: plan === 'enterprise' ? 500 : plan === 'professional' ? 50 : 10,
    maxVehicles: plan === 'enterprise' ? 1000 : plan === 'professional' ? 100 : 20,
    features: {
      gpsTracking: true,
      invoicing: plan !== 'starter',
      hrModule: plan !== 'starter',
      expenseTracking: true,
      advancedReporting: plan === 'enterprise',
      apiAccess: plan === 'enterprise',
    },
  };

  const tenant: Omit<Tenant, 'createdAt' | 'updatedAt' | 'trialEndsAt'> & {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    trialEndsAt: Timestamp;
  } = {
    id: tenantId,
    name,
    slug,
    plan,
    status: 'trial',
    ownerId,
    settings: defaultSettings,
    createdAt: now,
    updatedAt: now,
    trialEndsAt: Timestamp.fromDate(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    ),
  };

  const batch = db.batch();

  // Create tenant document
  batch.set(db.collection('tenants').doc(tenantId), tenant);

  // Create owner member record
  batch.set(
    db.collection('tenants').doc(tenantId).collection('members').doc(ownerId),
    {
      userId: ownerId,
      tenantId,
      role: 'owner' as TenantRole,
      email: ownerEmail,
      status: 'active',
      joinedAt: now,
    }
  );

  // Create user-tenant mapping for quick lookup
  batch.set(db.collection('userTenants').doc(`${ownerId}_${tenantId}`), {
    userId: ownerId,
    tenantId,
    role: 'owner',
    isPrimary: true,
    joinedAt: now,
  });

  await batch.commit();

  // Set custom claims on Firebase Auth user
  await setTenantClaims(ownerId, tenantId, 'owner');

  return {
    ...tenant,
    createdAt: tenant.createdAt.toDate(),
    updatedAt: tenant.updatedAt.toDate(),
    trialEndsAt: tenant.trialEndsAt.toDate(),
  };
}

export async function getTenant(tenantId: string): Promise<Tenant | null> {
  const snap = await db.collection('tenants').doc(tenantId).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    ...data,
    id: snap.id,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    trialEndsAt: data.trialEndsAt?.toDate?.(),
  } as Tenant;
}

export async function updateTenant(
  tenantId: string,
  updates: Partial<Pick<Tenant, 'name' | 'plan' | 'status' | 'settings'>>
): Promise<void> {
  await db.collection('tenants').doc(tenantId).update({
    ...updates,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

// ─── Member Management ─────────────────────────────────────────────────────

export async function getTenantMember(
  tenantId: string,
  userId: string
): Promise<TenantMember | null> {
  const snap = await memberRef(tenantId, userId).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    ...data,
    joinedAt: data.joinedAt?.toDate?.() ?? new Date(),
    lastLoginAt: data.lastLoginAt?.toDate?.(),
  } as TenantMember;
}

export async function listTenantMembers(
  tenantId: string
): Promise<TenantMember[]> {
  const snap = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('members')
    .orderBy('joinedAt', 'asc')
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      joinedAt: data.joinedAt?.toDate?.() ?? new Date(),
      lastLoginAt: data.lastLoginAt?.toDate?.(),
    } as TenantMember;
  });
}

export async function updateMemberRole(
  tenantId: string,
  userId: string,
  newRole: TenantRole,
  updatedByUid: string
): Promise<void> {
  // Prevent changing owner role
  const member = await getTenantMember(tenantId, userId);
  if (member?.role === 'owner') {
    throw new Error('Cannot change the role of the tenant owner.');
  }

  await memberRef(tenantId, userId).update({ role: newRole });
  await db
    .collection('userTenants')
    .doc(`${userId}_${tenantId}`)
    .update({ role: newRole });

  // Update Firebase Auth custom claims
  await setTenantClaims(userId, tenantId, newRole);
}

export async function removeTenantMember(
  tenantId: string,
  userId: string
): Promise<void> {
  const member = await getTenantMember(tenantId, userId);
  if (member?.role === 'owner') {
    throw new Error('Cannot remove the tenant owner.');
  }

  const batch = db.batch();
  batch.delete(memberRef(tenantId, userId));
  batch.delete(db.collection('userTenants').doc(`${userId}_${tenantId}`));
  await batch.commit();

  // Remove tenant claims from Firebase Auth
  const user = await auth.getUser(userId);
  const claims = user.customClaims ?? {};
  if (claims.tenantId === tenantId) {
    await auth.setCustomUserClaims(userId, {
      ...claims,
      tenantId: null,
      role: null,
    });
  }
}

// ─── Invite System ─────────────────────────────────────────────────────────

export async function createInvite(
  tenantId: string,
  email: string,
  role: TenantRole,
  invitedByUid: string
): Promise<TenantInvite> {
  const inviteId = uuidv4();
  const token = uuidv4();
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const invite = {
    id: inviteId,
    tenantId,
    email,
    role,
    invitedBy: invitedByUid,
    token,
    status: 'pending' as const,
    expiresAt,
    createdAt: now,
  };

  await inviteRef(tenantId, inviteId).set(invite);

  // Also index by token for quick lookup
  await db.collection('inviteTokens').doc(token).set({
    tenantId,
    inviteId,
    email,
    expiresAt,
  });

  return {
    ...invite,
    expiresAt: expiresAt.toDate(),
    createdAt: now.toDate(),
  };
}

export async function acceptInvite(
  token: string,
  userId: string,
  userEmail: string,
  displayName?: string
): Promise<{ tenantId: string; role: TenantRole }> {
  // Look up token
  const tokenDoc = await db.collection('inviteTokens').doc(token).get();
  if (!tokenDoc.exists) throw new Error('Invalid or expired invite token.');

  const tokenData = tokenDoc.data()!;
  const { tenantId, inviteId, email } = tokenData;

  if (email.toLowerCase() !== userEmail.toLowerCase()) {
    throw new Error('This invite was sent to a different email address.');
  }

  const inviteDoc = await inviteRef(tenantId, inviteId).get();
  if (!inviteDoc.exists) throw new Error('Invite not found.');

  const invite = inviteDoc.data() as TenantInvite & {
    expiresAt: Timestamp;
    createdAt: Timestamp;
  };

  if (invite.status !== 'pending') {
    throw new Error(`Invite is ${invite.status}.`);
  }

  if (invite.expiresAt.toDate() < new Date()) {
    await inviteRef(tenantId, inviteId).update({ status: 'expired' });
    throw new Error('Invite has expired.');
  }

  const now = Timestamp.now();
  const batch = db.batch();

  // Add member
  batch.set(memberRef(tenantId, userId), {
    userId,
    tenantId,
    role: invite.role,
    email: userEmail,
    displayName: displayName ?? null,
    status: 'active',
    joinedAt: now,
    invitedBy: invite.invitedBy,
  });

  // Create user-tenant mapping
  batch.set(db.collection('userTenants').doc(`${userId}_${tenantId}`), {
    userId,
    tenantId,
    role: invite.role,
    isPrimary: false,
    joinedAt: now,
  });

  // Mark invite as accepted
  batch.update(inviteRef(tenantId, inviteId), { status: 'accepted' });
  batch.delete(db.collection('inviteTokens').doc(token));

  await batch.commit();

  // Set auth claims
  await setTenantClaims(userId, tenantId, invite.role);

  return { tenantId, role: invite.role };
}

export async function revokeInvite(
  tenantId: string,
  inviteId: string
): Promise<void> {
  const inviteDoc = await inviteRef(tenantId, inviteId).get();
  if (!inviteDoc.exists) throw new Error('Invite not found.');

  const invite = inviteDoc.data()!;
  await inviteRef(tenantId, inviteId).update({ status: 'revoked' });
  await db.collection('inviteTokens').doc(invite.token).delete();
}

// ─── Auth Claims ───────────────────────────────────────────────────────────

export async function setTenantClaims(
  userId: string,
  tenantId: string,
  role: TenantRole
): Promise<void> {
  const user = await auth.getUser(userId);
  const existingClaims = user.customClaims ?? {};

  await auth.setCustomUserClaims(userId, {
    ...existingClaims,
    tenantId,
    role,
    // Admin flag for Firestore security rules
    isAdmin: role === 'admin' || role === 'owner',
    isOwner: role === 'owner',
  });
}

// ─── User Tenant Lookup ────────────────────────────────────────────────────

export async function getUserTenants(userId: string): Promise<
  Array<{ tenantId: string; role: TenantRole; isPrimary: boolean }>
> {
  const snap = await db
    .collection('userTenants')
    .where('userId', '==', userId)
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      tenantId: data.tenantId,
      role: data.role as TenantRole,
      isPrimary: data.isPrimary ?? false,
    };
  });
}

export async function switchActiveTenant(
  userId: string,
  tenantId: string
): Promise<void> {
  const membership = await getTenantMember(tenantId, userId);
  if (!membership || membership.status !== 'active') {
    throw new Error('User is not an active member of this tenant.');
  }
  await setTenantClaims(userId, tenantId, membership.role);
}
