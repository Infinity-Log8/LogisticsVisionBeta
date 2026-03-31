import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest, authErrorResponse } from '@/lib/tenant-auth';
import { switchActiveTenant } from '@/lib/tenant-service';

// POST /api/tenant/switch - Switch the active tenant for a user
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { tenantId } = await req.json();
    if (!tenantId) return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });

    await switchActiveTenant(user.uid, tenantId);

    return NextResponse.json({
      success: true,
      message: 'Tenant switched. Refresh your token to pick up new claims.',
    });
  } catch (err) {
    return authErrorResponse(err);
  }
}
