import { NextRequest, NextResponse } from 'next/server';
import { getInvoices } from '@/services/invoice-service';

export async function GET(req: NextRequest) {
  const organizationId = req.nextUrl.searchParams.get('organizationId');
  if (!organizationId) return NextResponse.json({ count: 0 });
  try {
    const invoices = await getInvoices(organizationId);
    const count = invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue').length;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
