import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest, authErrorResponse } from '@/lib/tenant-auth';
import { acceptInvite, revokeInvite } from '@/lib/tenant-service';

// POST /api/tenant/invite - Accept an invite with a token
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 });

    const result = await acceptInvite(
      token,
      user.uid,
      user.email ?? '',
      user.displayName ?? undefined
    );

    return NextResponse.json({ ...result, message: 'Invite accepted successfully' });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// DELETE /api/tenant/invite - Revoke an invite
export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const inviteId = searchParams.get('inviteId');
    if (!inviteId) return NextResponse.json({ error: 'inviteId required' }, { status: 400 });

    await revokeInvite(user.tenantId, inviteId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
