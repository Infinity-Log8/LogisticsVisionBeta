// Multi-tenant types for Logistics Visions

export type TenantRole = 'owner' | 'admin' | 'manager' | 'driver' | 'viewer';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise' | 'trial';
  status: 'active' | 'suspended' | 'trial';
  ownerId: string;
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
  trialEndsAt?: Date;
  subscriptionId?: string;
}

export interface TenantSettings {
  allowedDomains?: string[];
  maxUsers: number;
  maxVehicles: number;
  features: {
    gpsTracking: boolean;
    invoicing: boolean;
    hrModule: boolean;
    expenseTracking: boolean;
    advancedReporting: boolean;
    apiAccess: boolean;
  };
  branding?: {
    logo?: string;
    primaryColor?: string;
    companyName?: string;
  };
}

export interface TenantMember {
  userId: string;
  tenantId: string;
  role: TenantRole;
  email: string;
  displayName?: string;
  photoURL?: string;
  status: 'active' | 'invited' | 'suspended';
  joinedAt: Date;
  invitedBy?: string;
  lastLoginAt?: Date;
  permissions?: string[];
}

export interface TenantInvite {
  id: string;
  tenantId: string;
  email: string;
  role: TenantRole;
  invitedBy: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tenantId: string | null;
  role: TenantRole | null;
  permissions: string[];
  isOwner: boolean;
  isAdmin: boolean;
}

export const ROLE_PERMISSIONS: Record<TenantRole, string[]> = {
  owner: ['*'],
  admin: [
    'users:read', 'users:write', 'users:invite', 'users:remove',
    'trips:read', 'trips:write', 'trips:delete',
    'fleet:read', 'fleet:write', 'fleet:delete',
    'hr:read', 'hr:write',
    'finance:read', 'finance:write',
    'reports:read', 'settings:read', 'settings:write',
  ],
  manager: [
    'users:read', 'users:invite',
    'trips:read', 'trips:write',
    'fleet:read', 'fleet:write',
    'hr:read',
    'finance:read',
    'reports:read', 'settings:read',
  ],
  driver: [
    'trips:read', 'trips:write:own',
    'fleet:read',
    'profile:read', 'profile:write',
  ],
  viewer: [
    'trips:read',
    'fleet:read',
    'reports:read',
  ],
};

export function hasPermission(role: TenantRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (perms.includes('*')) return true;
  if (perms.includes(permission)) return true;
  // Check wildcard namespace (e.g., 'trips:*' covers 'trips:read')
  const [namespace] = permission.split(':');
  return perms.includes(`${namespace}:*`);
}
