import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Receipt, TrendingUp, RefreshCw, FileCheck, ArrowRight, PlusCircle } from 'lucide-react';

export default function AccountingPage() {
  const sections = [
    { title: 'Invoices', description: 'Create and manage customer invoices. Track payment status and send reminders.', icon: FileText, href: '/accounting/invoices', addHref: '/accounting/invoices/new', color: 'text-blue-500' },
    { title: 'Expenses', description: 'Record and categorize business expenses. Attach receipts and track spending by trip.', icon: Receipt, href: '/accounting/expenses', addHref: '/accounting/expenses/new', color: 'text-red-500' },
    { title: 'Quotes', description: 'Generate and send price quotes to customers. Convert accepted quotes to invoices.', icon: FileCheck, href: '/accounting/quotes', addHref: '/accounting/quotes/new', color: 'text-purple-500' },
    { title: 'Reconciliation', description: 'Reconcile payments and match transactions to ensure accurate financial records.', icon: RefreshCw, href: '/accounting/reconciliation', addHref: null, color: 'text-amber-500' },
    { title: 'Profit & Loss', description: 'View detailed P&L reports, revenue vs expenses breakdown, and trend analysis.', icon: TrendingUp, href: '/accounting/pnl', addHref: null, color: 'text-green-500' },
  ];

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounting</h1>
          <p className="text-muted-foreground">Full financial management — invoices, expenses, quotes, reconciliation, and P&L.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/accounting/invoices/new" className="gap-2"><PlusCircle className="h-4 w-4" />New Invoice</Link>
          </Button>
          <Button asChild>
            <Link href="/accounting/expenses/new" className="gap-2"><PlusCircle className="h-4 w-4" />Add Expense</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${section.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-sm">{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end gap-2">
                <Button asChild className="w-full gap-2">
                  <Link href={section.href}><ArrowRight className="h-4 w-4" />Open {section.title}</Link>
                </Button>
                {section.addHref && (
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link href={section.addHref}><PlusCircle className="h-4 w-4" />Add New</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
