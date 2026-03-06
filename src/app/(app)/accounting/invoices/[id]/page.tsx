import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { getInvoiceById } from '@/services/invoice-service';
import { MarkAsPaidButton } from '../mark-as-paid-button';

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const invoice = await getInvoiceById(id).catch(() => null);

  if (!invoice) {
    notFound();
  }

  const lineItems: Array<{ item?: string; description?: string; quantity?: number; unitPrice?: number }> =
    Array.isArray(invoice.items) ? invoice.items : [];

  const subtotal = lineItems.reduce((s, item) => s + (item.quantity ?? 0) * (item.unitPrice ?? 0), 0);

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/invoices">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-4">
              Invoice #{invoice.invoiceNumber || invoice.id}
            </h1>
            <p className="text-muted-foreground">Details for invoice to {invoice.customerName || invoice.customerId}.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print/Export
          </Button>
          <MarkAsPaidButton invoiceId={invoice.id!} invoiceStatus={invoice.status} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Bill To</CardTitle></CardHeader>
          <CardContent>
            <p className="font-semibold">{invoice.customerName || 'Customer'}</p>
            <p className="text-sm text-muted-foreground">{invoice.customerId || ''}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Invoice Details</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Issue Date:</span>
              <span>
                {invoice.issueDate instanceof Date
                  ? invoice.issueDate.toLocaleDateString()
                  : invoice.issueDate
                    ? new Date(invoice.issueDate as unknown as string).toLocaleDateString()
                    : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Due Date:</span>
              <span>
                {invoice.dueDate instanceof Date
                  ? invoice.dueDate.toLocaleDateString()
                  : invoice.dueDate
                    ? new Date(invoice.dueDate as unknown as string).toLocaleDateString()
                    : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={invoice.status === 'paid' ? 'default' : 'outline'}>
                {invoice.status || 'draft'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Amount</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R {(invoice.amount ?? 0).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
        <CardContent>
          {lineItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No line items recorded.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => {
                  const amount = (item.quantity ?? 0) * (item.unitPrice ?? 0);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.item || '—'}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">R {(item.unitPrice ?? 0).toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">R {amount.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          <Separator className="my-4" />
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>R {subtotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>R {(invoice.amount ?? subtotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {invoice.notes && (
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
