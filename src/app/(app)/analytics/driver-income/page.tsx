import { getTrips } from '@/services/trip-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
export const dynamic = 'force-dynamic';

const BASE_SALARY = 6000;
const OT_RATE_LOW = 0.40;

export default async function DriverIncomePage() {
  const trips = await getTrips();
  const fmt = (n: number) => 'N$ ' + n.toLocaleString('en-NA', { minimumFractionDigits:2, maximumFractionDigits:2 });

  // Group by driver
  const driverMap: Record<string, {
    name: string; ow: number; rt: number;
    owRevenue: number; rtRevenue: number;
    owKm: number; rtKm: number;
    owOT: number; rtOT: number;
  }> = {};

  for (const t of trips) {
    const key = t.driverId || t.driver;
    if (!driverMap[key]) driverMap[key] = { name: t.driver, ow:0, rt:0, owRevenue:0, rtRevenue:0, owKm:0, rtKm:0, owOT:0, rtOT:0 };
    const d = driverMap[key];
    const km = t.distance || 0;
    const ot = (t.driverOTCost || km * OT_RATE_LOW);
    if (t.tripType === 'round-trip') { d.rt++; d.rtRevenue += t.revenue||0; d.rtKm += km; d.rtOT += ot; }
    else                             { d.ow++; d.owRevenue += t.revenue||0; d.owKm += km; d.owOT += ot; }
  }

  const drivers = Object.values(driverMap).sort((a,b) => (b.owRevenue+b.rtRevenue) - (a.owRevenue+a.rtRevenue));

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/analytics"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div><h1 className="text-3xl font-bold">Driver Income Analysis</h1><p className="text-muted-foreground">Revenue and earnings per driver by trip type</p></div>
      </div>
      {drivers.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No trip data yet</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {drivers.map(d => {
            const totalKm = d.owKm + d.rtKm;
            const totalOT = d.owOT + d.rtOT;
            const totalRev = d.owRevenue + d.rtRevenue;
            const totalTrips = d.ow + d.rt;
            return (
              <Card key={d.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>{d.name}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">{totalTrips} trips</Badge>
                      <Badge variant="outline">{totalKm.toLocaleString()} km</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1 border rounded-lg p-3 bg-blue-50">
                      <p className="text-xs text-muted-foreground font-medium">One-Way ({d.ow})</p>
                      <p className="font-bold text-blue-700">{fmt(d.owRevenue)}</p>
                      <p className="text-xs text-muted-foreground">{d.owKm.toLocaleString()} km</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-green-50">
                      <p className="text-xs text-muted-foreground font-medium">Round-Trip ({d.rt})</p>
                      <p className="font-bold text-green-700">{fmt(d.rtRevenue)}</p>
                      <p className="text-xs text-muted-foreground">{d.rtKm.toLocaleString()} km</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
                      <p className="font-bold text-green-600">{fmt(totalRev)}</p>
                      <p className="text-xs text-muted-foreground">Base: {fmt(BASE_SALARY)}/mo</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium">Driver OT Est.</p>
                      <p className="font-bold">{fmt(totalOT)}</p>
                      <p className="text-xs text-muted-foreground">@ N$0.40/km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
