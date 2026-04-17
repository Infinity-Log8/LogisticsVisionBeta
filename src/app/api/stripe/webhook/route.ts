import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      default:
        console.log('Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const tenantId = session.metadata?.tenantId;
  if (!tenantId) return;

  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await adminDb.collection('tenants').doc(tenantId).update({
    'subscription.stripeSubscriptionId': subscriptionId,
    'subscription.stripeCustomerId': session.customer as string,
    'subscription.status': subscription.status,
    'subscription.plan': determinePlanFromPrice(subscription),
    'subscription.currentPeriodStart': new Date(subscription.current_period_start * 1000),
    'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
    'subscription.updatedAt': new Date(),
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const tenantId = subscription.metadata?.tenantId;
  if (!tenantId) return;

  await adminDb.collection('tenants').doc(tenantId).update({
    'subscription.status': subscription.status,
    'subscription.plan': determinePlanFromPrice(subscription),
    'subscription.currentPeriodStart': new Date(subscription.current_period_start * 1000),
    'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
    'subscription.updatedAt': new Date(),
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const tenantId = subscription.metadata?.tenantId;
  if (!tenantId) return;

  await adminDb.collection('tenants').doc(tenantId).update({
    'subscription.status': 'canceled',
    'subscription.cancelAtPeriodEnd': false,
    'subscription.updatedAt': new Date(),
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const tenantsSnapshot = await adminDb
    .collection('tenants')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (tenantsSnapshot.empty) return;

  const tenantDoc = tenantsSnapshot.docs[0];
  await tenantDoc.ref.collection('invoices').add({
    stripeInvoiceId: invoice.id,
    amountPaid: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: 'paid',
    invoiceUrl: invoice.hosted_invoice_url,
    invoicePdf: invoice.invoice_pdf,
    periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
    periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
    createdAt: new Date(),
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const tenantsSnapshot = await adminDb
    .collection('tenants')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (tenantsSnapshot.empty) return;

  const tenantDoc = tenantsSnapshot.docs[0];
  await tenantDoc.ref.update({
    'subscription.status': 'past_due',
    'subscription.updatedAt': new Date(),
  });
}

function determinePlanFromPrice(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) return 'free';

  const basicMonthly = process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY;
  const basicYearly = process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY;
  const premiumMonthly = process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY;
  const premiumYearly = process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY;

  if (priceId === basicMonthly || priceId === basicYearly) return 'basic';
  if (priceId === premiumMonthly || priceId === premiumYearly) return 'premium';
  return 'basic';
}
