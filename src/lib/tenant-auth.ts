import { cookies, headers } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
const auth = getAuth();
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { AuthUser, TenantRole } from './tenant-types';
import { hasPermission } from './tenant-types';
import { getTenantMember } from './tenant-service';

// ─── Token verification ────────────────────────────────────────────────────

export async function verifyToken(
  token: string
): Promise<DecodedIdToken | null> {
  try {
    return await auth.verifyIdToken(token, true);
  } catch {
    return null;
  }
}

export async function getTokenFromRequest(): Promise<string | null> {
  // Try Authorization header first (API routes)
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Fall back to session cookie (SSR pages)
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (sessionToken) {
    try {
      const decoded = await auth.verifySessionCookie(sessionToken, true);
      // For session cookies we need to return a fresh token - return uid as marker
      return decoded.uid ? `session:${decoded.uid}` : null;
    } catch {
      return null;
    }
  }

  return null;
}

// ─── Current User (Server Components) ─────────────────────────────────────

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return buildAuthUser(decoded);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  return user;
}

export async function requireTenantMember(
  tenantId?: string
): Promise<AuthUser> {
  const user = await requireAuth();
  const tid = tenantId ?? user.tenantId;

  if (!tid) throw new Error('NO_TENANT');
  if (user.tenantId !== tid) {
    // Verify membership directly
    const member = await getTenantMember(tid, user.uid);
    if (!member || member.status !== 'active') {
      throw new Error('FORBIDDEN');
    }
  }

  return { ...user, tenantId: tid };
}

export async function requirePermission(
  permission: string,
  tenantId?: string
): Promise<AuthUser> {
  const user = await requireTenantMember(tenantId);
  if (!user.role || !hasPermission(user.role, permission)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export async function requireAdmin(tenantId?: string): Promise<AuthUser> {
  const user = await requireTenantMember(tenantId);
  if (!user.isAdmin) throw new Error('FORBIDDEN');
  return user;
}

export async function requireOwner(tenantId?: string): Promise<AuthUser> {
  const user = await requireTenantMember(tenantId);
  if (!user.isOwner) throw new Error('FORBIDDEN');
  return user;
}

// ─── API Route helper ──────────────────────────────────────────────────────

export async function authenticateApiRequest(
  req: Request
): Promise<AuthUser | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const decoded = await verifyToken(token);
  if (!decoded) return null;

  return buildAuthUser(decoded);
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildAuthUser(decoded: DecodedIdToken): AuthUser {
  const role = (decoded.role as TenantRole) ?? null;
  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
    displayName: decoded.name ?? null,
    photoURL: decoded.picture ?? null,
    tenantId: (decoded.tenantId as string) ?? null,
    role,
    permissions: role ? getRolePermissions(role) : [],
    isOwner: decoded.isOwner === true || role === 'owner',
    isAdmin:
      decoded.isAdmin === true || role === 'admin' || role === 'owner',
  };
}

function getRolePermissions(role: TenantRole): string[] {
  const { ROLE_PERMISSIONS } = require('./tenant-types');
  return ROLE_PERMISSIONS[role] ?? [];
}

// ─── Session cookie management ─────────────────────────────────────────────

export async function createSessionCookie(
  idToken: string,
  expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
): Promise<string> {
  return auth.createSessionCookie(idToken, { expiresIn });
}

export function getSessionCookieOptions(expiresIn: number) {
  return {
    name: 'session',
    value: '',
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax' as const,
  };
}

// ─── Error helpers ─────────────────────────────────────────────────────────

export function authErrorResponse(error: unknown): Response {
  const msg = error instanceof Error ? error.message : String(error);
  const statusMap: Record<string, number> = {
    UNAUTHENTICATED: 401,
    NO_TENANT: 403,
    FORBIDDEN: 403,
  };
  return Response.json(
    { error: msg },
    { status: statusMap[msg] ?? 500 }
  );
}
