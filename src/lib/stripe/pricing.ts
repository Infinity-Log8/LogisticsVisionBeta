// Stripe Pricing Configuration for Logistic Visions
// These price IDs should match your Stripe Dashboard products

export type PlanTier = 'free' | 'basic' | 'premium';

export interface PricingPlan {
  id: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: string[];
  limits: {
    trucks: number;
    drivers: number;
    trips: number;       // per month
    users: number;
    aiRequests: number;  // per month
    storage: string;
  };
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for small operations getting started with fleet management.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceIdMonthly: '',
    stripePriceIdYearly: '',
    features: [
      'Up to 5 trucks',
      'Up to 5 drivers',
      '50 trips per month',
      '2 team members',
      'Basic dashboard & analytics',
      'Trip tracking',
      'Customer management',
      'Email support',
    ],
    limits: {
      trucks: 5,
      drivers: 5,
      trips: 50,
      users: 2,
      aiRequests: 10,
      storage: '1 GB',
    },
  },
  {
    id: 'basic',
    name: 'Professional',
    description: 'For growing logistics companies that need more power and automation.',
    monthlyPrice: 49,
    yearlyPrice: 470,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY || '',
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY || '',
    features: [
      'Up to 25 trucks',
      'Up to 30 drivers',
      'Unlimited trips',
      '10 team members',
      'Advanced analytics & reports',
      'AI Maintenance predictions',
      'AI Financial analyst',
      'Document management',
      'Brokerage module',
      'Priority email support',
    ],
    limits: {
      trucks: 25,
      drivers: 30,
      trips: -1, // unlimited
      users: 10,
      aiRequests: 200,
      storage: '10 GB',
    },
    popular: true,
  },
  {
    id: 'premium',
    name: 'Enterprise',
    description: 'For large fleets that need unlimited access and premium support.',
    monthlyPrice: 149,
    yearlyPrice: 1430,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY || '',
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY || '',
    features: [
      'Unlimited trucks',
      'Unlimited drivers',
      'Unlimited trips',
      'Unlimited team members',
      'All AI features (maintenance, finance, routes)',
      'Advanced brokerage tools',
      'HR & payroll module',
      'Custom integrations',
      'API access',
      'Dedicated account manager',
      'Phone & priority support',
      'Custom branding',
    ],
    limits: {
      trucks: -1,
      drivers: -1,
      trips: -1,
      users: -1,
      aiRequests: -1,
      storage: '100 GB',
    },
  },
];

export const FREE_TRIAL_DAYS = 14;

export function getPlanByTier(tier: PlanTier): PricingPlan | undefined {
  return PRICING_PLANS.find((plan) => plan.id === tier);
}

export function formatPrice(amount: number, interval?: 'month' | 'year'): string {
  if (amount === 0) return 'Free';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
  return interval ? `${formatted}/${interval === 'month' ? 'mo' : 'yr'}` : formatted;
}
