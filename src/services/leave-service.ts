import { ensureDbConnected } from '@/lib/firebase-admin';

export interface LeaveRequest {
  id?: string;
  organizationId: string;
  employeeId?: string;
  employeeName?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getLeaveRequests(organizationId: string): Promise<LeaveRequest[]> {
  const db = await ensureDbConnected();
  const snap = await db.collection('leave_requests').where('organizationId', '==', organizationId).orderBy('startDate', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as LeaveRequest));
}

export async function createLeaveRequest(data: Omit<LeaveRequest, 'id'>): Promise<LeaveRequest> {
  const db = await ensureDbConnected();
  const ref = await db.collection('leave_requests').add({ ...data, createdAt: new Date(), updatedAt: new Date() });
  return { id: ref.id, ...data };
}

export async function updateLeaveRequest(id: string, data: Partial<LeaveRequest>): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('leave_requests').doc(id).update({ ...data, updatedAt: new Date() });
}

export async function deleteLeaveRequest(id: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('leave_requests').doc(id).delete();
}
