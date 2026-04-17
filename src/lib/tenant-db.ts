import { getFirestore, CollectionReference, DocumentReference, Query, Timestamp, FieldValue, WriteBatch } from 'firebase-admin/firestore';
const db = getFirestore();

/**
 * Multi-tenant Firestore database helpers.
 * All data is namespaced under /tenants/{tenantId}/...
 * ensuring strict tenant isolation at the data layer.
 */





// ─── Tenant-scoped collection paths ───────────────────────────────────────

export const tenantCol = (tenantId: string) =>
  `tenants/${tenantId}`;

export const tenantCollection = (tenantId: string, collection: string) =>
  db.collection(`tenants/${tenantId}/${collection}`);

export const tenantDoc = (tenantId: string, collection: string, docId: string) =>
  db.doc(`tenants/${tenantId}/${collection}/${docId}`);

// ─── Typed collection accessors ────────────────────────────────────────────

export const Collections = {
  // Core tenant data
  tenants: () => db.collection('tenants'),
  members: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/members`),
  invites: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/invites`),

  // Logistics data (all tenant-scoped)
  trips: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/trips`),
  vehicles: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/vehicles`),
  drivers: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/drivers`),
  customers: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/customers`),
  invoices: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/invoices`),
  expenses: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/expenses`),
  employees: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/employees`),
  leaveRequests: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/leaveRequests`),
  fuelLogs: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/fuelLogs`),
  notes: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/notes`),
  trackingEvents: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/trackingEvents`),

  payroll: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/payroll`),
  commissions: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/commissions`),
  payouts: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/payouts`),
  quotes: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/quotes`),
  distanceRecords: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/distance_records`),
  settings: (tenantId: string) =>
    db.collection(`tenants/${tenantId}/settings`),
  // Global (cross-tenant) collections
  userTenants: () => db.collection('userTenants'),
  inviteTokens: () => db.collection('inviteTokens'),
};

// ─── Generic CRUD helpers ──────────────────────────────────────────────────

export async function createDoc<T extends Record<string, unknown>>(
  col: CollectionReference,
  data: T,
  id?: string
): Promise<T & { id: string }> {
  const ref = id ? col.doc(id) : col.doc();
  const now = Timestamp.now();
  const payload = {
    ...data,
    id: ref.id,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(payload);
  return {
    ...payload,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  } as T & { id: string };
}

export async function getDoc<T>(
  ref: DocumentReference
): Promise<(T & { id: string }) | null> {
  const snap = await ref.get();
  if (!snap.exists) return null;
  return deserialize<T>(snap.id, snap.data()!);
}

export async function updateDoc(
  ref: DocumentReference,
  updates: Record<string, unknown>
): Promise<void> {
  await ref.update({
    ...updates,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteDoc(ref: DocumentReference): Promise<void> {
  await ref.delete();
}

export async function listDocs<T>(
  col: CollectionReference | Query
): Promise<(T & { id: string })[]> {
  const snap = await col.get();
  return snap.docs.map((doc) => deserialize<T>(doc.id, doc.data()));
}

// ─── Tenant-scoped document operations ────────────────────────────────────

export class TenantDB {
  constructor(private tenantId: string) {}

  col(name: string): CollectionReference {
    return tenantCollection(this.tenantId, name);
  }

  doc(colName: string, docId: string): DocumentReference {
    return tenantDoc(this.tenantId, colName, docId);
  }

  async create<T extends Record<string, unknown>>(
    colName: string,
    data: T,
    id?: string
  ): Promise<T & { id: string }> {
    return createDoc(this.col(colName), { ...data, tenantId: this.tenantId }, id);
  }

  async get<T>(colName: string, docId: string): Promise<(T & { id: string }) | null> {
    return getDoc<T>(this.doc(colName, docId));
  }

  async update(colName: string, docId: string, updates: Record<string, unknown>): Promise<void> {
    return updateDoc(this.doc(colName, docId), updates);
  }

  async delete(colName: string, docId: string): Promise<void> {
    return deleteDoc(this.doc(colName, docId));
  }

  async list<T>(colName: string): Promise<(T & { id: string })[]> {
    let q: CollectionReference | Query = this.col(colName);
    // Apply constraints if supported
    if (false) {
      q = (q as CollectionReference).where('tenantId', '==', this.tenantId);
    }
    return listDocs<T>(q);
  }

  batch(): WriteBatch {
    return db.batch();
  }

  // ── Specific collection shortcuts ──────────────────────────────────────

  get trips() { return Collections.trips(this.tenantId); }
  get vehicles() { return Collections.vehicles(this.tenantId); }
  get drivers() { return Collections.drivers(this.tenantId); }
  get customers() { return Collections.customers(this.tenantId); }
  get invoices() { return Collections.invoices(this.tenantId); }
  get expenses() { return Collections.expenses(this.tenantId); }
  get employees() { return Collections.employees(this.tenantId); }
  get leaveRequests() { return Collections.leaveRequests(this.tenantId); }
  get fuelLogs() { return Collections.fuelLogs(this.tenantId); }
  get notes() { return Collections.notes(this.tenantId); }
  get trackingEvents() { return Collections.trackingEvents(this.tenantId); }
  get members() { return Collections.members(this.tenantId); }
  get payroll() { return Collections.payroll(this.tenantId); }
  get commissions() { return Collections.commissions(this.tenantId); }
  get payouts() { return Collections.payouts(this.tenantId); }
  get quotes() { return Collections.quotes(this.tenantId); }
  get distanceRecords() { return Collections.distanceRecords(this.tenantId); }
  get settings() { return Collections.settings(this.tenantId); }
  get invites() { return Collections.invites(this.tenantId); }
}

export function getTenantDB(tenantId: string): TenantDB {
  return new TenantDB(tenantId);
}

// ─── Pagination helper ─────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  lastDoc?: FirebaseFirestore.DocumentSnapshot;
}

export async function paginate<T>(
  query: Query,
  limit: number,
  startAfter?: FirebaseFirestore.DocumentSnapshot
): Promise<PaginatedResult<T & { id: string }>> {
  let q = query.limit(limit + 1);
  if (startAfter) q = q.startAfter(startAfter);

  const snap = await q.get();
  const hasMore = snap.docs.length > limit;
  const docs = hasMore ? snap.docs.slice(0, limit) : snap.docs;

  return {
    items: docs.map((doc) => deserialize<T>(doc.id, doc.data())),
    total: snap.size,
    hasMore,
    lastDoc: docs[docs.length - 1],
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function deserialize<T>(id: string, data: FirebaseFirestore.DocumentData): T & { id: string } {
  const result: Record<string, unknown> = { ...data, id };

  // Convert all Timestamps to Dates
  for (const [key, value] of Object.entries(result)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    }
  }

  return result as T & { id: string };
}
