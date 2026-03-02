'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, CreditCard } from 'lucide-react';
import { MarkAsPaidMenuItem } from './mark-as-paid-menu-item';
import { DeleteInvoiceMenuItem } from './delete-invoice-menu-item';
import { useToast } from '@/hooks/use-toast';
import { deleteInvoiceAction, markInvoiceAsPaidAction } from './actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Invoice = {
  id: string;
  customer: string;
  customerId: string;
  dateIssued: string;
  dueDate: string;
  total: number;
  status: string;
};

type InvoiceTableProps = {
  invoices: Invoice[];
};

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Paid': return 'default';
    case 'Overdue': return 'destructive';
    default: return 'secondary';
  }
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkPayDialog, setShowBulkPayDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  if (invoices.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No invoices found for this category.</div>;
  }

  const allSelected = selectedIds.size === invoices.length && invoices.length > 0;
  const someSelected = selectedIds.size > 0 && selectedIds.size < invoices.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(invoices.map((i) => i.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    startTransition(async () => {
      const ids = Array.from(selectedIds);
      let successCount = 0;
      for (const id of ids) {
        const result = await deleteInvoiceAction(id);
        if (result.success) successCount++;
      }
      toast({ title: `Deleted ${successCount} of ${ids.length} invoice(s)` });
      setSelectedIds(new Set());
      setShowBulkDeleteDialog(false);
    });
  };

  const handleBulkPay = () => {
    startTransition(async () => {
      const ids = Array.from(selectedIds);
      let successCount = 0;
      for (const id of ids) {
        const result = await markInvoiceAsPaidAction(id);
        if (result.success) successCount++;
      }
      toast({ title: `Marked ${successCount} of ${ids.length} invoice(s) as paid / reconciled` });
      setSelectedIds(new Set());
      setShowBulkPayDialog(false);
    });
  };

  return (
    <div className="space-y-3">
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium">{selectedIds.size} invoice{selectedIds.size > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => setShowBulkPayDialog(true)}
              disabled={isPending}
            >
              <CreditCard className="h-4 w-4" />
              Mark as Paid / Reconcile
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2"
              onClick={() => setShowBulkDeleteDialog(true)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
              Clear
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={toggleAll}
                aria-label="Select all invoices"
              />
            </TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              data-state={selectedIds.has(invoice.id) ? 'selected' : undefined}
              className={selectedIds.has(invoice.id) ? 'bg-muted/30' : undefined}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(invoice.id)}
                  onCheckedChange={() => toggleOne(invoice.id)}
                  aria-label={`Select invoice ${invoice.id}`}
                />
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/accounting/invoices/${invoice.id}`} className="text-primary hover:underline">{invoice.id}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/customers/${invoice.customerId}`} className="text-primary hover:underline">{invoice.customer}</Link>
              </TableCell>
              <TableCell>{invoice.dateIssued}</TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell className="text-right">{invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/accounting/invoices/${invoice.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/accounting/invoices/edit/${invoice.id}`}>Edit</Link>
                    </DropdownMenuItem>
                    <MarkAsPaidMenuItem invoiceId={invoice.id} invoiceStatus={invoice.status} />
                    <DropdownMenuSeparator />
                    <DeleteInvoiceMenuItem invoiceId={invoice.id} />
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
            <AlertDialogTitle>Delete {selectedIds.size} Invoice(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected invoices. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Delete All Selected'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkPayDialog} onOpenChange={setShowBulkPayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark {selectedIds.size} Invoice(s) as Paid?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark all selected invoices as paid and reconciled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkPay} disabled={isPending}>
              {isPending ? 'Processing...' : 'Confirm Payment / Reconcile'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
