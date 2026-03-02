import { NextRequest, NextResponse } from 'next/server';
import { getInviteByToken } from '@/services/invite-service';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  const invite = await getInviteByToken(token);
  if (!invite) return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 404 });
  return NextResponse.json({ email: invite.email, role: invite.role, organizationId: invite.organizationId });
}
