'use client';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { type Employee } from '@/services/employee-service';
import Link from 'next/link';
import { deleteEmployeeAction, bulkDeleteEmployeeAction } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export function EmployeeList({ employees }: { employees: Employee[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const allIds = employees.map(e => e.id!).filter(Boolean);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));

  function toggleAll() { if (allSelected) setSelected(new Set()); else setSelected(new Set(allIds)); }
  function toggleOne(id: string) { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  async function handleDelete(id: string) {
    if (!confirm('Delete this employee? This cannot be undone.')) return;
    setDeleting(true);
    const res = await deleteEmployeeAction(id);
    setDeleting(false);
    if (res.success) { toast({ title: 'Employee deleted' }); router.refresh(); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} employee(s)? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await bulkDeleteEmployeeAction(Array.from(selected));
    setDeleting(false);
    if (res.success) { toast({ title: `${selected.size} employee(s) deleted` }); setSelected(new Set()); router.refresh(); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  }

  if (employees.length === 0) return <p className="text-muted-foreground py-8 text-center">No employees found.</p>;

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
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map(emp => (
            <TableRow key={emp.id} className={selected.has(emp.id!) ? 'bg-muted/30' : ''}>
              <TableCell><Checkbox checked={selected.has(emp.id!)} onCheckedChange={() => toggleOne(emp.id!)} /></TableCell>
              <TableCell><Link href={`/hr/employees/${emp.id}`} className="font-medium hover:underline">{emp.name}</Link></TableCell>
              <TableCell>{emp.role || '-'}</TableCell>
              <TableCell>{emp.department || '-'}</TableCell>
              <TableCell>{emp.phone || '-'}</TableCell>
              <TableCell><Badge variant={emp.status === 'Active' ? 'secondary' : 'outline'}>{emp.status || 'Unknown'}</Badge></TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild><Link href={`/hr/employees/${emp.id}`}>View</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href={`/hr/employees/edit/${emp.id}`}>Edit</Link></DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(emp.id!)} disabled={deleting}>
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
