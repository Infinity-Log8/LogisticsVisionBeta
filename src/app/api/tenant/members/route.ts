import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest, authErrorResponse } from '@/lib/tenant-auth';
import {
  listTenantMembers,
  updateMemberRole,
  removeTenantMember,
  createInvite,
} from '@/lib/tenant-service';
import type { TenantRole } from '@/lib/tenant-types';

// GET /api/tenant/members - List all members
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const members = await listTenantMembers(user.tenantId);
    return NextResponse.json({ members });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// POST /api/tenant/members - Invite a new member
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!user.isAdmin && user.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, role } = await req.json();
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const invite = await createInvite(
      user.tenantId,
      email,
      role as TenantRole,
      user.uid
    );

    return NextResponse.json({ invite }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// PATCH /api/tenant/members - Update member role
export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    await updateMemberRole(user.tenantId, userId, role as TenantRole, user.uid);
    return NextResponse.json({ success: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// DELETE /api/tenant/members - Remove a member
export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    await removeTenantMember(user.tenantId, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
