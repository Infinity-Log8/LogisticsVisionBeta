'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Trip } from '@/services/trip-service';
import { CancelTripMenuItem } from './cancel-trip-menu-item';
import { CompleteTripMenuItem } from './complete-trip-menu-item';
import { deleteTripAction, bulkDeleteTripAction } from './actions';

type TripTableProps = {
  trips: Trip[];
};

const getStatusVariant = (status: Trip['status']) => {
  switch (status) {
    case 'In Transit': return 'default';
    case 'Delivered': return 'secondary';
    case 'Pending': return 'outline';
    case 'Planned': return 'outline';
    case 'Cancelled': return 'destructive';
    default: return 'default';
  }
};

export function TripTable({ trips }: TripTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const toggleAll = () => {
    if (selected.size === trips.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(trips.map((t) => t.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    setDeleting(true);
    try {
      await deleteTripAction(id);
      toast({ title: 'Trip deleted successfully' });
      router.refresh();
    } catch (err) {
      toast({ title: 'Failed to delete trip', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} trip(s)? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await bulkDeleteTripAction(Array.from(selected));
      toast({ title: `${selected.size} trip(s) deleted` });
      setSelected(new Set());
      router.refresh();
    } catch (err) {
      toast({ title: 'Failed to delete trips', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  if (trips.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No trips found for this category.
      </div>
    );
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted rounded-md mb-2">
          <span className="text-sm text-muted-foreground">{selected.size} selected</span>
          <Button
            size="sm"
            variant="destructive"
            disabled={deleting}
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={trips.length > 0 && selected.size === trips.length}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
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
              <TableRow key={trip.id} data-state={selected.has(trip.id) ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(trip.id)}
                    onCheckedChange={() => toggleOne(trip.id)}
                    aria-label={`Select trip ${trip.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/trips/${trip.id}`} className="text-primary hover:underline">
                    {trip.id}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Link href={`/customers/${trip.customerId}`} className="text-primary hover:underline">
                    {trip.customer}
                  </Link>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {trip.origin} to {trip.destination}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Link href={`/fleet/drivers/${trip.driverId}`} className="text-primary hover:underline">
                    {trip.driver}
                  </Link>
                </TableCell>
                <TableCell>{trip.truck}</TableCell>
                <TableCell className="hidden lg:table-cell text-right">
                  ${trip.revenue.toLocaleString()}
                </TableCell>
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
                      <CompleteTripMenuItem tripId={trip.id} tripStatus={trip.status} />
                      {isCancellable ? (
                        <CancelTripMenuItem tripId={trip.id} />
                      ) : (
                        <DropdownMenuItem disabled>Cancel Trip</DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(trip.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Trip
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
