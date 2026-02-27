import { getTrips } from '@/services/trip-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
export const dynamic = 'force-dynamic';

export default async function TripClassifyPage() {
  const trips = await getTrips().catch((e) => { console.error('Data fetch error:', e.message); return []; });
  const fmt = (n: number) => 'N$ ' + n.toLocaleString('en-NA', { minimumFractionDigits:2, maximumFractionDigits:2 });

  const oneWay   = trips.filter(t => t.tripType === 'one-way');
  const roundT   = trips.filter(t => t.tripType === 'round-trip');
  const noType   = trips.filter(t => !t.tripType);

  const stats = (arr: typeof trips) => ({
    count:    arr.length,
    revenue:  arr.reduce((s,t) => s + (t.revenue||0), 0),
    distance: arr.reduce((s,t) => s + (t.distance||0), 0),
    loadCost: arr.reduce((s,t) => s + (t.loadRateCost||0), 0),
    messC:    arr.reduce((s,t) => s + (t.messDistanceCost||0), 0),
    tireC:    arr.reduce((s,t) => s + (t.tireCost||0), 0),
    fuelC:    arr.reduce((s,t) => s + (t.fuelCost||0), 0),
    otC:      arr.reduce((s,t) => s + (t.driverOTCost||0), 0),
  });

  const owStats = stats(oneWay);
  const rtStats = stats(roundT);

  const StatCard = ({ title, s, color }: { title:string; s:ReturnType<typeof stats>; color:string }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
          {title}
          <Badge variant="outline" className="ml-auto">{s.count} trips</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Total Revenue</span><span className="font-semibold text-green-600">{fmt(s.revenue)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Total Distance</span><span className="font-semibold">{s.distance.toLocaleString()} km</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Load Rate Cost</span><span>{fmt(s.loadCost)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Mess Distance</span><span>{fmt(s.messC)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Tire Wear</span><span>{fmt(s.tireC)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Fuel Cost</span><span>{fmt(s.fuelC)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Driver OT</span><span>{fmt(s.otC)}</span></div>
        <div className="flex justify-between border-t pt-2"><span className="font-medium">Est. Net Profit</span><span className={`font-bold ${(s.revenue - s.messC - s.tireC - s.fuelC - s.otC) >= 0 ? 'text-green-600':'text-red-600'}`}>{fmt(s.revenue - s.messC - s.tireC - s.fuelC - s.otC)}</span></div>
        {s.count > 0 && <div className="flex justify-between text-xs text-muted-foreground"><span>Avg per trip</span><span>{fmt(s.revenue / s.count)}</span></div>}
      </CardContent>
    </Card>
  );

  // Per-month by type
  const monthMap: Record<string, {ow:number;rt:number;owRev:number;rtRev:number}> = {};
  for (const t of trips) {
    const key = t.date?.slice(0,7) || 'unknown';
    if (!monthMap[key]) monthMap[key] = {ow:0,rt:0,owRev:0,rtRev:0};
    if (t.tripType === 'one-way')    { monthMap[key].ow++; monthMap[key].owRev += t.revenue||0; }
    if (t.tripType === 'round-trip') { monthMap[key].rt++; monthMap[key].rtRev += t.revenue||0; }
  }
  const months = Object.entries(monthMap).sort((a,b) => b[0].localeCompare(a[0]));

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/analytics"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div><h1 className="text-3xl font-bold">Trip Classification Analysis</h1><p className="text-muted-foreground">One-way vs Round-trip performance</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="One-Way Trips" s={owStats} color="bg-blue-500" />
        <StatCard title="Round-Trip Trips" s={rtStats} color="bg-green-500" />
      </div>
      {noType.length > 0 && <p className="text-xs text-muted-foreground">{noType.length} trip(s) have no classification (legacy data)</p>}
      <Card>
        <CardHeader><CardTitle>Monthly Breakdown by Type</CardTitle></CardHeader>
        <CardContent>
          {months.length === 0 ? <p className="text-muted-foreground text-sm">No data yet</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-4">Month</th>
                  <th className="text-right py-2 pr-2">OW Trips</th>
                  <th className="text-right py-2 pr-2">OW Revenue</th>
                  <th className="text-right py-2 pr-2">RT Trips</th>
                  <th className="text-right py-2">RT Revenue</th>
                </tr></thead>
                <tbody>
                  {months.map(([m,d]) => (
                    <tr key={m} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-2 pr-4 font-medium">{m}</td>
                      <td className="text-right py-2 pr-2">{d.ow}</td>
                      <td className="text-right py-2 pr-2 text-blue-600">{fmt(d.owRev)}</td>
                      <td className="text-right py-2 pr-2">{d.rt}</td>
                      <td className="text-right py-2 text-green-600">{fmt(d.rtRev)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
