import { NextRequest, NextResponse } from 'next/server';
import { createOrganization, getOrganizationByUserId } from '@/services/org-service';
import { getInviteByToken, acceptInvite } from '@/services/invite-service';
import { ensureDbConnected } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, companyName, inviteToken } = await req.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    const safeEmail = (email || '').trim();

    const db = await ensureDbConnected();

    // Check if user already has an org
    const existingOrg = await getOrganizationByUserId(userId);
    if (existingOrg) {
      return NextResponse.json({ organizationId: existingOrg.id, message: 'Already registered' });
    }

    if (inviteToken) {
      // Join existing org via invite
      const invite = await getInviteByToken(inviteToken);
      if (!invite) return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 });
      if (invite.email && safeEmail && invite.email !== safeEmail) return NextResponse.json({ error: 'Email does not match invite' }, { status: 400 });

      // Link user to org
      await db.collection('users').doc(userId).set({
        organizationId: invite.organizationId,
        role: invite.role || 'Member',
        email: safeEmail,
      }, { merge: true });

      // Mark invite as accepted
      await acceptInvite(inviteToken, userId);

      return NextResponse.json({ organizationId: invite.organizationId, role: invite.role });
    } else {
      // Create new org
      if (!companyName) return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
      const org = await createOrganization(companyName, userId, safeEmail);
      return NextResponse.json({ organizationId: org.id, organizationName: org.name });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
