'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PRICING_PLANS, formatPrice, FREE_TRIAL_DAYS } from '@/lib/stripe/pricing';
import type { PricingPlan } from '@/lib/stripe/pricing';
import { Check, Loader2, CreditCard, ExternalLink, Zap } from 'lucide-react';

type BillingInterval = 'month' | 'year';

interface SubscriptionData {
  plan: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
}

export default function BillingPage() {
  const { user, organizationId: tenantId } = useAuth();
  const [interval, setInterval] = useState<BillingInterval>('month');
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    // Check URL params for success/cancel
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      // Could show a success toast here
      window.history.replaceState({}, '', '/billing');
    }
  }, []);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.id === 'free' || !user || !tenantId) return;

    const priceId = interval === 'month' ? plan.stripePriceIdMonthly : plan.stripePriceIdYearly;
    if (!priceId) {
      alert('Stripe pricing is not configured yet. Please contact support.');
      return;
    }

    setLoading(plan.id);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          tenantId,
          userId: user.uid,
          email: user.email,
          interval,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    if (!tenantId) return;
    setPortalLoading(true);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const currentPlan = subscription?.plan || 'free';

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current Plan Status */}
      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  You are on the <strong className="text-foreground">{
                    PRICING_PLANS.find(p => p.id === currentPlan)?.name || 'Starter'
                  }</strong> plan.
                </CardDescription>
              </div>
              <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                {subscription.status === 'trialing' ? 'Free Trial' : subscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {subscription.stripeSubscriptionId && (
                <Button onClick={handleManageBilling} disabled={portalLoading} variant="outline">
                  {portalLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  Manage Billing
                </Button>
              )}
              {subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  Your plan will cancel on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Interval Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={interval === 'month' ? 'font-semibold' : 'text-muted-foreground'}>
          Monthly
        </span>
        <button
          onClick={() => setInterval(interval === 'month' ? 'year' : 'month')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            interval === 'year' ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              interval === 'year' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={interval === 'year' ? 'font-semibold' : 'text-muted-foreground'}>
          Yearly
          <Badge variant="secondary" className="ml-2 text-xs">Save 20%</Badge>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const price = interval === 'month' ? plan.monthlyPrice : plan.yearlyPrice;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular ? 'border-primary shadow-lg ring-1 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Zap className="mr-1 h-3 w-3" /> Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {price === 0 ? 'Free' : formatPrice(price)}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground ml-1">
                      /{interval === 'month' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : plan.id === 'free' ? (
                  <Button className="w-full" variant="outline" disabled={currentPlan === 'free'}>
                    {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading !== null}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {currentPlan === 'free'
                      ? `Start ${FREE_TRIAL_DAYS}-Day Trial`
                      : 'Upgrade'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ / Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Can I change plans later?</p>
            <p>Yes, you can upgrade or downgrade at any time. Changes take effect at the next billing cycle.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">What happens when my trial ends?</p>
            <p>After your {FREE_TRIAL_DAYS}-day trial, you will be automatically charged. You can cancel anytime before the trial ends.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Do you offer refunds?</p>
            <p>We offer a 30-day money-back guarantee on all paid plans. Contact support for assistance.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
