import { cookies } from 'next/headers';

export async function getServerOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('orgId')?.value ?? null;
}
