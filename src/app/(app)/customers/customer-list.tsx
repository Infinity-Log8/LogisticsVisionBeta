'use client';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type Customer } from '@/services/customer-service';
import Link from 'next/link';
import { DeactivateCustomerMenuItem } from './deactivate-customer-menu-item';
import { deleteCustomerAction, bulkDeleteCustomerAction } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

const getStatusVariant = (status: string) => {
  return status === 'Active' ? 'secondary' : 'outline';
};

export function CustomerList({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const allIds = customers.map(c => c.id!).filter(Boolean);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this customer? This cannot be undone.')) return;
    setDeleting(true);
    const res = await deleteCustomerAction(id);
    setDeleting(false);
    if (res.success) { toast({ title: 'Customer deleted' }); router.refresh(); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} customer(s)? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await bulkDeleteCustomerAction(Array.from(selected));
    setDeleting(false);
    if (res.success) {
      toast({ title: `${selected.size} customer(s) deleted` });
      setSelected(new Set());
      router.refresh();
    } else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  }

  if (customers.length === 0) return <p className="text-muted-foreground py-8 text-center">No customers found in the database.</p>;

  return (
    <div className="space-y-2">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-muted/50 border rounded-lg px-4 py-2">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={deleting}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map(customer => (
            <TableRow key={customer.id} className={selected.has(customer.id!) ? 'bg-muted/30' : ''}>
              <TableCell><Checkbox checked={selected.has(customer.id!)} onCheckedChange={() => toggleOne(customer.id!)} /></TableCell>
              <TableCell><Link href={`/customers/${customer.id}`} className="font-medium hover:underline">{customer.name}</Link></TableCell>
              <TableCell>{customer.email || '-'}</TableCell>
              <TableCell>{customer.phone || '-'}</TableCell>
              <TableCell><Badge variant={getStatusVariant(customer.status || '')}>{customer.status || 'Unknown'}</Badge></TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild><Link href={`/customers/${customer.id}`}>View</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href={`/customers/edit/${customer.id}`}>Edit</Link></DropdownMenuItem>
                    <DeactivateCustomerMenuItem customerId={customer.id!} currentStatus={customer.status || ''} />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(customer.id!)} disabled={deleting}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
