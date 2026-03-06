'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Trash2, CheckSquare, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { deleteExpenseAction } from './actions';
import type { Expense } from '@/services/expense-service';

const CATEGORY_COLORS: Record<string, string> = {
  fuel: 'bg-orange-100 text-orange-800',
  maintenance: 'bg-blue-100 text-blue-800',
  tolls: 'bg-purple-100 text-purple-800',
  accommodation: 'bg-green-100 text-green-800',
  meals: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
};

interface ExpenseTableProps {
  expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const allSelected = expenses.length > 0 && selectedIds.size === expenses.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < expenses.length;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(expenses.map((e) => e.id!).filter(Boolean)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  }

  function handleBulkDelete() {
    startTransition(async () => {
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map((id) => deleteExpenseAction(id)));
      setSelectedIds(new Set());
      setShowBulkDeleteDialog(false);
      router.refresh();
    });
  }

  return (
    <>
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-muted border rounded-md mb-2">
          <span className="text-sm font-medium">
            {selectedIds.size} expense{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteDialog(true)}
              disabled={isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => { if (el) el.dataset.indeterminate = String(someSelected); }}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Trip</TableHead>
            <TableHead>Paid By</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No expenses found.
              </TableCell>
            </TableRow>
          )}
          {expenses.map((expense) => (
            <TableRow
              key={expense.id}
              className={selectedIds.has(expense.id!) ? 'bg-muted/50' : ''}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(expense.id!)}
                  onCheckedChange={() => toggleOne(expense.id!)}
                  aria-label="Select expense"
                />
              </TableCell>
              <TableCell className="text-sm">
                {expense.date instanceof Date
                  ? expense.date.toLocaleDateString()
                  : new Date(expense.date as unknown as string).toLocaleDateString()}
              </TableCell>
              <TableCell>{expense.description || '—'}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    CATEGORY_COLORS[expense.category?.toLowerCase() ?? 'other'] ??
                    CATEGORY_COLORS.other
                  }`}
                >
                  {expense.category || 'Other'}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {expense.tripId || '—'}
              </TableCell>
              <TableCell className="text-sm">{expense.paidBy || '—'}</TableCell>
              <TableCell className="text-right font-medium">
                R {expense.amount != null ? expense.amount.toFixed(2) : '0.00'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/accounting/expenses/${expense.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/accounting/expenses/edit/${expense.id}`}>Edit</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Expense{selectedIds.size !== 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All selected expenses will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting…' : 'Delete All Selected'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
