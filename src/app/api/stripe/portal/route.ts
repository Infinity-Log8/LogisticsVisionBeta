import { NextRequest, NextResponse } from 'next/server';
import { createBillingPortalSession } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Missing required field: tenantId' },
        { status: 400 }
      );
    }

    const tenantDoc = await adminDb.collection('tenants').doc(tenantId).get();
    const tenantData = tenantDoc.data();

    if (!tenantData?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please subscribe to a plan first.' },
        { status: 400 }
      );
    }

    const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

    const session = await createBillingPortalSession(
      tenantData.stripeCustomerId,
      `${baseUrl}/billing`
    );

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Billing portal error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
