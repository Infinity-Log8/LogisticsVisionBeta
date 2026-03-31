
'use server';

import { createEmployee, updateEmployee, getDrivers, type Employee , deleteEmployee } from '@/services/employee-service';
import type { EmployeeData } from '@/services/employee-service';
import { revalidatePath } from 'next/cache';

export async function createEmployeeAction(data: Omit<EmployeeData, 'id' | 'totalTrips' | 'photoUrl'>): Promise<{ success: boolean, error?: string, employeeId?: string }> {
    try {
        const newEmployee = await createEmployee(data);
        revalidatePath('/hr/employees');
        return { success: true, employeeId: newEmployee.id };
    } catch(e: any) {
        let errorMessage = e.message || "Failed to create employee.";
        if (String(e.message).includes('Firestore is not initialized')) {
            errorMessage = "A connection to the database could not be established. Please contact support if the issue persists.";
        }
        return { success: false, error: errorMessage };
    }
}

export async function updateEmployeeAction(id: string, data: Partial<Omit<EmployeeData, 'id' | 'totalTrips' | 'photoUrl'>>): Promise<{ success: boolean, error?: string }> {
    try {
        await updateEmployee(id, data);
        revalidatePath('/hr/employees');
        revalidatePath(`/hr/employees/${id}`);
        return { success: true };
    } catch(e: any) {
        let errorMessage = e.message || "Failed to update employee.";
        if (String(e.message).includes('Firestore is not initialized')) {
            errorMessage = "A connection to the database could not be established. Please contact support if the issue persists.";
        }
        return { success: false, error: errorMessage };
    }
}

export async function getDriversAction(): Promise<Employee[]> {
    return getDrivers();
}

export async function deleteEmployeeAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { requirePermission } = await import('@/lib/tenant-auth');
    const { getTenantDB } = await import('@/lib/tenant-db');
    const user = await requirePermission('employees:delete');
    const tdb = getTenantDB(user.tenantId!);
    await tdb.delete('employees', id);
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/hr/employees');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function bulkDeleteEmployeeAction(
  ids: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { requirePermission } = await import('@/lib/tenant-auth');
    const { getTenantDB } = await import('@/lib/tenant-db');
    const user = await requirePermission('employees:delete');
    const tdb = getTenantDB(user.tenantId!);
    await Promise.all(ids.map((id) => tdb.delete('employees', id)));
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/hr/employees');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
