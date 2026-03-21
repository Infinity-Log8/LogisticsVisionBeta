
import Link from 'next/link';
import { Trash2,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { Trip } from '@/services/trip-service';
import { deleteTripAction, bulkDeleteTripAction } from './actions';
import { CancelTripMenuItem } from './cancel-trip-menu-item';
import { CompleteTripMenuItem } from './complete-trip-menu-item';

type TripTableProps = {
  trips: Trip[];
};

const getStatusVariant = (status: Trip['status']) => {
  switch (status) {
    case 'In Transit':
      return 'default';
    case 'Delivered':
      return 'secondary';
    case 'Pending':
      return 'outline';
    case 'Planned':
      return 'outline';
    case 'Cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

export function TripTable({ trips }: TripTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const allIds = trips.map(t => t.id!).filter(Boolean);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));
  function toggleAll() { if (allSelected) setSelected(new Set()); else setSelected(new Set(allIds)); }
  function toggleOne(id: string) { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  async function handleDelete(id: string) {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    setDeleting(true);
    const res = await deleteTripAction(id);
    setDeleting(false);
    if (res.success) { toast({ title: 'Trip deleted' }); router.refresh(); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  }
  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm('Delete ' + selected.size + ' trip(s)? This cannot be undone.')) return;
    setDeleting(true);
    const res = await bulkDeleteTripAction(Array.from(selected));
    setDeleting(false);
    if (res.success) { toast({ title: selected.size + ' trip(s) deleted' }); setSelected(new Set()); router.refresh(); }
    else toast({ title: 'Error', description: res.error, variant: 'destructive' });
  }
  if (trips.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No trips found for this category.
      </div>
    );
  }

  return (
    {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-muted/50 border rounded-lg px-4 py-2 mb-2">
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
            <TableHead>Trip ID</TableHead>
          <TableHead className="hidden sm:table-cell">Customer</TableHead>
          <TableHead className="hidden lg:table-cell">Route</TableHead>
          <TableHead className="hidden md:table-cell">Driver</TableHead>
          <TableHead>Truck</TableHead>
          <TableHead className="hidden lg:table-cell text-right">Revenue</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.map((trip) => {
          const isCancellable = trip.status !== 'Delivered' && trip.status !== 'Cancelled';
          return (
          <TableRow key={trip.id}>
              <TableCell><Checkbox checked={selected.has(trip.id!)} onCheckedChange={() => toggleOne(trip.id!)} /></TableCell>
            <TableCell className="font-medium">
              <Link
                href={`/trips/${trip.id}`}
                className="text-primary hover:underline"
              >
                {trip.id}
              </Link>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
               <Link href={`/customers/${trip.customerId}`} className="text-primary hover:underline">{trip.customer}</Link>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                {trip.origin} to {trip.destination}
            </TableCell>
            <TableCell className="hidden md:table-cell">
               <Link href={`/fleet/drivers/${trip.driverId}`} className="text-primary hover:underline">{trip.driver}</Link>
            </TableCell>
            <TableCell>{trip.truck}</TableCell>
            <TableCell className="hidden lg:table-cell text-right">${trip.revenue.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(trip.status) as 'default' | 'secondary' | 'outline' | 'destructive'}>
                {trip.status}
              </Badge>
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
                    <Link href={`/trips/${trip.id}`}>View Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/trips/edit/${trip.id}`}>Edit Trip</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(trip.id!)} disabled={deleting}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                    <CompleteTripMenuItem tripId={trip.id} tripStatus={trip.status} />
                  {isCancellable ? (
                    <CancelTripMenuItem tripId={trip.id} />
                  ) : (
                    <DropdownMenuItem disabled>Cancel Trip</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
    </Table>
  );
}
