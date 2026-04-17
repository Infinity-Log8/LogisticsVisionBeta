import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, getOrCreateStripeCustomer } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import { FREE_TRIAL_DAYS } from '@/lib/stripe/pricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, tenantId, userId, email, companyName, interval } = body;

    if (!priceId || !tenantId || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, tenantId, userId, email' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const tenantRef = adminDb.collection('tenants').doc(tenantId);
    const tenantDoc = await tenantRef.get();
    const tenantData = tenantDoc.data();
    const existingCustomerId = tenantData?.stripeCustomerId;

    const customerId = await getOrCreateStripeCustomer(
      tenantId,
      email,
      companyName,
      existingCustomerId
    );

    // Store the Stripe customer ID on the tenant if new
    if (!existingCustomerId || existingCustomerId !== customerId) {
      await tenantRef.update({ stripeCustomerId: customerId });
    }

    // Determine if eligible for free trial
    const isNewCustomer = !tenantData?.subscription?.stripeSubscriptionId;
    const trialDays = isNewCustomer ? FREE_TRIAL_DAYS : undefined;

    const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';

    const session = await createCheckoutSession({
      customerId,
      priceId,
      tenantId,
      successUrl: `${baseUrl}/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancelUrl: `${baseUrl}/billing?canceled=true`,
      trialDays,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
