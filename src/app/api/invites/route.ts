import { NextRequest, NextResponse } from 'next/server';
import { createInvite, getInvitesByOrg, deleteInvite } from '@/services/invite-service';

export async function GET(req: NextRequest) {
  const organizationId = req.nextUrl.searchParams.get('organizationId');
  if (!organizationId) return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
  try {
    const invites = await getInvitesByOrg(organizationId);
    return NextResponse.json({ invites });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, organizationId, invitedBy, role } = await req.json();
    if (!email || !organizationId || !invitedBy) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const invite = await createInvite(email, organizationId, invitedBy, role || 'Member');
    return NextResponse.json(invite);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await deleteInvite(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
