import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getExpenses } from '@/services/expense-service';
import { ExpenseTable } from './expense-table';

export default async function ExpensesPage() {
  const expenses = await getExpenses().catch((e) => {
    console.error('Data fetch error:', e.message); return [];
  });

  const totalAmount = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const byCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    const cat = e.category || 'Other';
    byCategory[cat] = (byCategory[cat] || 0) + (e.amount ?? 0);
  });

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">Track and manage all business expenses.</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/accounting/expenses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl">R {totalAmount.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="text-2xl">{expenses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top Category</CardDescription>
            <CardTitle className="text-2xl">
              {Object.keys(byCategory).length > 0
                ? Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0][0]
                : '—'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            Select expenses to bulk delete. Use the row actions to view or edit individual records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}
