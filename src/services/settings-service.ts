import { db } from '@/lib/firebase-admin';

export type TaxRate = { name: string; rate: number; };

export type AppSettings = {
  id: string;
  companyName: string;
  companyAddress: string;
  currency: string;
  taxId: string;
  defaultPaymentTerms: number;
  invoiceFooter: string;
  taxRates: TaxRate[];
  loadRatePerKm: number;
  fuelPricePerLitre: number;
  driverOTRateLow: number;
  driverOTRateHigh: number;
  fuelEfficiencyLPer100Km: number;
  brokerCommissionRate: number;
};

export const DEFAULT_SETTINGS: Omit<AppSettings, 'id'> = {
  companyName: 'Logistics Vision',
  companyAddress: '',
  currency: 'NAD',
  taxId: '',
  defaultPaymentTerms: 30,
  invoiceFooter: 'Thank you for your business.',
  taxRates: [],
  loadRatePerKm: 23.76,
  fuelPricePerLitre: 19.00,
  driverOTRateLow: 0.40,
  driverOTRateHigh: 0.50,
  fuelEfficiencyLPer100Km: 2.7,
  brokerCommissionRate: 0.05,
};

export async function getSettings(): Promise<AppSettings> {
  const doc = await db.collection('settings').doc('app').get();
  if (!doc.exists) return { id: 'app', ...DEFAULT_SETTINGS };
  return { id: 'app', ...DEFAULT_SETTINGS, ...doc.data() } as AppSettings;
}

export async function updateSettings(data: Partial<Omit<AppSettings, 'id'>>): Promise<void> {
  await db.collection('settings').doc('app').set(data, { merge: true });
}
