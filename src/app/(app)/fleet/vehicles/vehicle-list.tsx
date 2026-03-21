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
import { type Vehicle } from '@/services/vehicle-service';
import Link from 'next/link';
import { deleteVehicleAction, bulkDeleteVehicleAction } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const allIds = vehicles.map(v => v.id!).filter(Boolean);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  }
  function toggleOne(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this vehicle? This cannot be undone.')) return;
    setDeleting(true);
    const res = await deleteVehicleAction(id);
    setDeleting(false);
    if (res.success) { toast({ title: 'Vehicle deleted' }); router.refresh(); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} vehicle(s)? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await bulkDeleteVehicleAction(Array.from(selected));
    setDeleting(false);
    if (res.success) { toast({ title: `${selected.size} vehicle(s) deleted` }); setSelected(new Set()); router.refresh(); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  }

  if (vehicles.length === 0) return <p className="text-muted-foreground py-8 text-center">No vehicles found in the database.</p>;

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
            <TableHead>Vehicle ID</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Maintenance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map(vehicle => (
            <TableRow key={vehicle.id} className={selected.has(vehicle.id!) ? 'bg-muted/30' : ''}>
              <TableCell><Checkbox checked={selected.has(vehicle.id!)} onCheckedChange={() => toggleOne(vehicle.id!)} /></TableCell>
              <TableCell><Link href={`/fleet/vehicles/${vehicle.id}`} className="font-medium text-primary hover:underline">{vehicle.id}</Link></TableCell>
              <TableCell>{vehicle.make} {vehicle.model} ({vehicle.year})</TableCell>
              <TableCell>{vehicle.driverName ? <Link href="#" className="text-primary hover:underline">{vehicle.driverName}</Link> : <span className="text-muted-foreground">Unassigned</span>}</TableCell>
              <TableCell><Badge variant={vehicle.status === 'Operational' ? 'secondary' : 'outline'}>{vehicle.status}</Badge></TableCell>
              <TableCell>{vehicle.maintenanceDue ? String(vehicle.maintenanceDue).substring(0,10) : '-'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild><Link href={`/fleet/vehicles/${vehicle.id}`}>View Details</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href={`/fleet/vehicles/edit/${vehicle.id}`}>Edit</Link></DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(vehicle.id!)} disabled={deleting}>
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
