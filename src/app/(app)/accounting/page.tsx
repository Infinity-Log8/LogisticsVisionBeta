import Link from 'next/link';
import { ArrowLeft, FileText, DollarSign, TrendingUp, BarChart2, CreditCard, RefreshCw, Receipt, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getInvoices } from '@/services/invoice-service';
import { getExpenses } from '@/services/expense-service';

export default async function AccountingPage() {
  const [invoices, expenses] = await Promise.all([
    getInvoices().catch(() => []),
    getExpenses().catch(() => []),
  ]);

  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + (i.amount ?? 0), 0);
  const totalPending = invoices
    .filter((i) => i.status === 'pending' || i.status === 'sent')
    .reduce((s, i) => s + (i.amount ?? 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount ?? 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const recentInvoices = invoices.slice(0, 5);
  const recentExpenses = expenses.slice(0, 5);

  const sections = [
    {
      title: 'Invoices',
      description: 'Create, send, and track invoices',
      href: '/accounting/invoices',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      count: invoices.length,
      label: 'total invoices',
    },
    {
      title: 'Expenses',
      description: 'Log and categorize business expenses',
      href: '/accounting/expenses',
      icon: Receipt,
      color: 'text-red-600',
      bg: 'bg-red-50',
      count: expenses.length,
      label: 'total expenses',
    },
    {
      title: 'Quotes',
      description: 'Create and manage customer quotes',
      href: '/accounting/quotes',
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      count: null,
      label: 'manage quotes',
    },
    {
      title: 'Profit & Loss',
      description: 'View detailed P&L statements',
      href: '/accounting/pnl',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      count: null,
      label: 'view report',
    },
    {
      title: 'Reconciliation',
      description: 'Match bank statements with records',
      href: '/accounting/reconciliation',
      icon: RefreshCw,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      count: null,
      label: 'reconcile now',
    },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Accounting</h1>
          <p className="text-muted-foreground">Financial overview and accounting management.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl text-green-600">R {totalRevenue.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">From paid invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Revenue</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">R {totalPending.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Outstanding invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl text-red-600">R {totalExpenses.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{expenses.length} expense records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Profit</CardDescription>
            <CardTitle className={`text-2xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R {netProfit.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Revenue minus expenses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {sections.map((sec) => (
          <Link key={sec.title} href={sec.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-lg ${sec.bg} flex items-center justify-center`}>
                    <sec.icon className={`h-5 w-5 ${sec.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold">{sec.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sec.description}</p>
                  </div>
                  {sec.count !== null && (
                    <span className="text-lg font-bold">{sec.count}</span>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {sec.label} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Invoices</CardTitle>
              <Link href="/accounting/invoices">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No invoices yet.</p>
            ) : (
              <div className="space-y-3">
                {recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between gap-2 text-sm">
                    <div>
                      <p className="font-medium">{inv.invoiceNumber || inv.id}</p>
                      <p className="text-xs text-muted-foreground">{inv.customerName || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R {(inv.amount ?? 0).toFixed(2)}</p>
                      <Badge
                        variant={inv.status === 'paid' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {inv.status || 'draft'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Expenses</CardTitle>
              <Link href="/accounting/expenses">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No expenses yet.</p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between gap-2 text-sm">
                    <div>
                      <p className="font-medium">{exp.description || 'Expense'}</p>
                      <p className="text-xs text-muted-foreground">{exp.category || 'Other'}</p>
                    </div>
                    <p className="font-medium text-red-600">
                      -R {(exp.amount ?? 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
