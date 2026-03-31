import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest, authErrorResponse } from '@/lib/tenant-auth';
import {
  createTenant,
  getTenant,
  updateTenant,
  getUserTenants,
} from '@/lib/tenant-service';

// GET /api/tenant - Get current tenant info
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!user.tenantId) return NextResponse.json({ error: 'No tenant' }, { status: 403 });

    const tenant = await getTenant(user.tenantId);
    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

    return NextResponse.json({ tenant });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// POST /api/tenant - Create a new tenant
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, plan } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const tenant = await createTenant(
      user.uid,
      user.email ?? '',
      name,
      plan ?? 'trial'
    );

    return NextResponse.json({ tenant }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// PATCH /api/tenant - Update tenant settings
export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateApiRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!user.tenantId) return NextResponse.json({ error: 'No tenant' }, { status: 403 });

    const body = await req.json();
    await updateTenant(user.tenantId, body);

    return NextResponse.json({ success: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
