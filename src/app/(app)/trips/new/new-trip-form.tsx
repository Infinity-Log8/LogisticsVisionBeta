"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import type { Customer } from "@/services/customer-service";
import type { Employee } from "@/services/employee-service";
import type { Vehicle } from "@/services/vehicle-service";
import { createTripAction } from "./actions";

const LOAD_RATE_PER_KM = 23.76;
const MESS_RATE = 66.6 / 100;
const TIRE_RATE = 0.30;
const FUEL_L_PER_KM = 2.7;
const FUEL_PRICE = 19.00;
const OT_RATE = 0.40;

const tripSchema = z.object({
  customerId: z.string().min(1, "Customer required"),
  driverId: z.string().min(1, "Driver required"),
  vehicleId: z.string().min(1, "Vehicle required"),
  origin: z.string().min(1, "Origin required"),
  destination: z.string().min(1, "Destination required"),
  pickupTime: z.string().min(1, "Pickup time required"),
  estimatedDelivery: z.string().min(1, "Delivery time required"),
  status: z.enum(["Planned","In Transit","Delivered","Cancelled","Pending"]),
  distance: z.coerce.number().min(0),
  revenue: z.coerce.number().min(0),
  tripType: z.enum(["round-trip","one-way"]),
  brokerRef: z.string().optional(),
  hiredTransportation: z.boolean().default(false),
  notes: z.string().optional(),
});
type TripFormValues = z.infer<typeof tripSchema>;

type Props = { customers: Customer[]; drivers: Employee[]; vehicles: Vehicle[] };

export function NewTripForm({ customers, drivers, vehicles }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [costs, setCosts] = useState({ load:0, mess:0, tire:0, fuel:0, ot:0, net:0 });

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: { status:"Planned", distance:0, revenue:0, tripType:"one-way", hiredTransportation:false, notes:"", brokerRef:"" },
  });

  const distance = form.watch("distance");
  const revenue = form.watch("revenue");

  useEffect(() => {
    const km = Number(distance) || 0;
    const load = km * LOAD_RATE_PER_KM;
    const mess = km * MESS_RATE;
    const tire = km * TIRE_RATE;
    const fuel = km * FUEL_L_PER_KM * FUEL_PRICE;
    const ot   = km * OT_RATE;
    const net  = load - mess - tire - fuel - ot;
    setCosts({ load, mess, tire, fuel, ot, net });
    form.setValue("revenue", parseFloat(load.toFixed(2)), { shouldValidate:true, shouldDirty:true });
  }, [distance]);

  const fmt = (n: number) => `N$ ${n.toFixed(2)}`;

  async function onSubmit(data: TripFormValues) {
    setLoading(true);
    const km = Number(data.distance) || 0;
    const customer = customers.find(c => c.id === data.customerId);
    const driver   = drivers.find(d => d.id === data.driverId);
    const vehicle  = vehicles.find(v => v.id === data.vehicleId);
    const result = await createTripAction({
      ...data,
      customer: customer?.name || "Unknown",
      driver:   driver?.name   || "Unknown",
      truck:    vehicle?.licensePlate || "Unknown",
      date:     data.pickupTime.split("T")[0],
      loadRateCost:     parseFloat((km * LOAD_RATE_PER_KM).toFixed(2)),
      messDistanceCost: parseFloat((km * MESS_RATE).toFixed(2)),
      tireCost:         parseFloat((km * TIRE_RATE).toFixed(2)),
      fuelCost:         parseFloat((km * FUEL_L_PER_KM * FUEL_PRICE).toFixed(2)),
      driverOTCost:     parseFloat((km * OT_RATE).toFixed(2)),
    });
    setLoading(false);
    if (result.success) {
      toast({ title:"Trip Created", description:"New trip added successfully." });
      router.push("/trips");
      router.refresh();
    } else {
      toast({ variant:"destructive", title:"Error", description: result.error });
    }
  }

  const custOpts = customers.map(c => ({ value:c.id, label:c.name }));
  const drvOpts  = drivers.map(d => ({ value:d.id, label:d.name }));
  const vehOpts  = vehicles.map(v => ({ value:v.id, label:`${v.model} (${v.licensePlate})` }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Trip Details</CardTitle><CardDescription>Fill in the trip information.</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="customerId" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Customer</FormLabel>
                  <Combobox options={custOpts} value={field.value} onChange={field.onChange} placeholder="Select customer..." searchPlaceholder="Search..." emptyPlaceholder="No customer." disabled={loading} />
                  <FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="driverId" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Driver</FormLabel>
                  <Combobox options={drvOpts} value={field.value} onChange={field.onChange} placeholder="Select driver..." searchPlaceholder="Search..." emptyPlaceholder="No driver." disabled={loading} />
                  <FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="vehicleId" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Vehicle</FormLabel>
                  <Combobox options={vehOpts} value={field.value} onChange={field.onChange} placeholder="Select vehicle..." searchPlaceholder="Search..." emptyPlaceholder="No vehicle." disabled={loading} />
                  <FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="origin" render={({ field }) => (
                <FormItem><FormLabel>Origin</FormLabel><FormControl><Input placeholder="City / Location" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="destination" render={({ field }) => (
                <FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="City / Location" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="pickupTime" render={({ field }) => (
                <FormItem><FormLabel>Pickup Date & Time</FormLabel><FormControl><Input type="datetime-local" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="estimatedDelivery" render={({ field }) => (
                <FormItem><FormLabel>Estimated Delivery</FormLabel><FormControl><Input type="datetime-local" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField control={form.control} name="distance" render={({ field }) => (
                <FormItem><FormLabel>Distance (km)</FormLabel><FormControl><Input type="number" placeholder="0" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="revenue" render={({ field }) => (
                <FormItem><FormLabel>Revenue (N$)</FormLabel><FormControl><Input type="number" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tripType" render={({ field }) => (
                <FormItem><FormLabel>Trip Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="one-way">One-Way</SelectItem>
                      <SelectItem value="round-trip">Round-Trip</SelectItem>
                    </SelectContent>
                  </Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="brokerRef" render={({ field }) => (
                <FormItem><FormLabel>Broker Reference (optional)</FormLabel><FormControl><Input placeholder="Broker name / ID" {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="hiredTransportation" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-8">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={loading} /></FormControl>
                  <FormLabel className="font-normal">Hired Transportation</FormLabel>
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem><FormLabel>Notes (optional)</FormLabel><FormControl><Textarea placeholder="Additional notes..." {...field} disabled={loading} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        {(Number(distance) > 0) && (
          <Card>
            <CardHeader><CardTitle>Cost Breakdown</CardTitle><CardDescription>Auto-calculated from distance</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1"><p className="text-muted-foreground">Load Rate (N$23.76/km)</p><p className="font-semibold text-green-600">{fmt(costs.load)}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground">Mess Distance</p><p className="font-semibold text-red-500">-{fmt(costs.mess)}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground">Tire Wear (N$0.30/km)</p><p className="font-semibold text-red-500">-{fmt(costs.tire)}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground">Fuel (2.7L × N$19)</p><p className="font-semibold text-red-500">-{fmt(costs.fuel)}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground">Driver OT (N$0.40/km)</p><p className="font-semibold text-red-500">-{fmt(costs.ot)}</p></div>
                <div className="space-y-1 border-t pt-2"><p className="text-muted-foreground font-medium">Est. Net Profit</p><p className={`font-bold text-lg ${costs.net >= 0 ? "text-green-600":"text-red-600"}`}>{fmt(costs.net)}</p></div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/trips")} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Trip</Button>
        </div>
      </form>
    </Form>
  );
}
