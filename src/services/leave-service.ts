'use server';
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

export async function getLeaveRequests(organizationId?: string): Promise<LeaveRequest[]> {


  const db = await ensureDbConnected();
  const leaveQuery = organizationId ? db.collection('leave_requests').where('organizationId', '==', organizationId).orderBy('startDate', 'desc') : db.collection('leave_requests').orderBy('startDate', 'desc'); const snap = await leaveQuery.get();
  return snap.docs.map(d => { const data = d.data(); if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate().toISOString(); if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate().toISOString(); return { id: d.id, ...data } as LeaveRequest; });
}

export async function createLeaveRequest(data: Partial<LeaveRequest> | Omit<LeaveRequest, 'id'>): Promise<LeaveRequest> {
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

export async function getPendingLeaveCount(): Promise<number> {
  const db = await ensureDbConnected();
  const snap = await db.collection('leave_requests').where('status', '==', 'Pending').get();
  return snap.size;
}

// LeaveRequestData is an alias for LeaveRequest data shape without id
export type LeaveRequestData = Omit<LeaveRequest, "id">;

export async function updateLeaveRequestStatus(id: string, status: string): Promise<void> {
  const db = await ensureDbConnected();
  await db.collection('leaveRequests').doc(id).update({ status, updatedAt: new Date() });
}
