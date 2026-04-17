import Stripe from 'stripe';

// Server-side Stripe instance - only use in API routes and server components
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  console.warn('STRIPE_SECRET_KEY is not set. Billing features will not work.');
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
  typescript: true,
});

// Helper to get or create a Stripe customer for a tenant
export async function getOrCreateStripeCustomer(
  tenantId: string,
  email: string,
  name?: string,
  existingCustomerId?: string
): Promise<string> {
  if (existingCustomerId) {
    // Verify it still exists
    try {
      await stripe.customers.retrieve(existingCustomerId);
      return existingCustomerId;
    } catch {
      // Customer was deleted, create a new one
    }
  }

  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      tenantId,
      platform: 'logistic-visions',
    },
  });

  return customer.id;
}

// Create a checkout session for subscription
export async function createCheckoutSession({
  customerId,
  priceId,
  tenantId,
  successUrl,
  cancelUrl,
  trialDays,
}: {
  customerId: string;
  priceId: string;
  tenantId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: trialDays,
      metadata: {
        tenantId,
      },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      tenantId,
    },
  });

  return session;
}

// Create a billing portal session
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Get subscription details
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'latest_invoice'],
    });
  } catch {
    return null;
  }
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}
