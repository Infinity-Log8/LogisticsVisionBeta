import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationByUserId } from '@/services/org-service';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  try {
    const org = await getOrganizationByUserId(userId);
    if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    return NextResponse.json({
      organizationId: org.id,
      organizationName: org.name,
      role: org.ownerId === userId ? 'Owner' : 'Member',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
