import { getTrips } from '@/services/trip-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BarChart3, Route, Users, TrendingUp } from 'lucide-react';
export const dynamic = 'force-dynamic';

function groupByMonth(trips: Awaited<ReturnType<typeof getTrips>>) {
  const map: Record<string, { month: string; trips: number; distance: number; revenue: number }> = {};
  for (const t of trips) {
    const key = t.date ? t.date.slice(0, 7) : 'unknown';
    if (!map[key]) map[key] = { month: key, trips: 0, distance: 0, revenue: 0 };
    map[key].trips++;
    map[key].distance += t.distance || 0;
    map[key].revenue  += t.revenue  || 0;
  }
  return Object.values(map).sort((a, b) => b.month.localeCompare(a.month));
}

export default async function AnalyticsPage() {
  const trips = await getTrips();
  const monthly = groupByMonth(trips);
  const totalRevenue = trips.reduce((s, t) => s + (t.revenue || 0), 0);
  const totalDistance = trips.reduce((s, t) => s + (t.distance || 0), 0);
  const roundTrips = trips.filter(t => t.tripType === 'round-trip').length;
  const oneWay     = trips.filter(t => t.tripType === 'one-way').length;
  const hired      = trips.filter(t => t.hiredTransportation).length;
  const fmt = (n: number) => 'N$ ' + n.toLocaleString('en-NA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Trip performance, revenue and distance insights</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/analytics/trip-classify">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-200">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Route className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base">Trip Classification Analysis</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Round-trip vs One-way breakdown, revenue and distance by type</p></CardContent>
          </Card>
        </Link>
        <Link href="/analytics/driver-income">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Users className="h-5 w-5 text-green-500" />
              <CardTitle className="text-base">Driver Income Analysis</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Income per driver broken down by trip classification</p></CardContent>
          </Card>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Trips</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{trips.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{fmt(totalRevenue)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Distance</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{totalDistance.toLocaleString()} km</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Hired Transport</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{hired}</p></CardContent></Card>
      </div>

      {/* Trip type summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Route className="h-4 w-4" />Trip Types</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">One-Way</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: trips.length ? oneWay/trips.length*100+'%' : '0%'}} /></div>
                <Badge variant="secondary">{oneWay}</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Round-Trip</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: trips.length ? roundTrips/trips.length*100+'%' : '0%'}} /></div>
                <Badge variant="secondary">{roundTrips}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Avg per Trip</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Revenue</span><span className="font-semibold">{fmt(trips.length ? totalRevenue/trips.length : 0)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Avg Distance</span><span className="font-semibold">{trips.length ? (totalDistance/trips.length).toFixed(0) : 0} km</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly breakdown table */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Monthly Breakdown</CardTitle></CardHeader>
        <CardContent>
          {monthly.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No trip data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-4">Month</th>
                  <th className="text-right py-2 pr-4">Trips</th>
                  <th className="text-right py-2 pr-4">Distance (km)</th>
                  <th className="text-right py-2">Revenue</th>
                </tr></thead>
                <tbody>
                  {monthly.map(m => (
                    <tr key={m.month} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-2 pr-4 font-medium">{m.month}</td>
                      <td className="text-right py-2 pr-4">{m.trips}</td>
                      <td className="text-right py-2 pr-4">{m.distance.toLocaleString()}</td>
                      <td className="text-right py-2 text-green-600 font-semibold">{fmt(m.revenue)}</td>
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
