import Link from 'next/link';
import { ArrowLeft, Truck, Users, Fuel, MapPin, ArrowRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getVehicles } from '@/services/vehicle-service';

export default async function FleetPage() {
  const vehicles = await getVehicles().catch(() => []);

  const activeVehicles = vehicles.filter((v) => v.status === 'active' || v.status === 'Active');
  const inactiveVehicles = vehicles.filter((v) => v.status === 'inactive' || v.status === 'Inactive');
  const maintenanceVehicles = vehicles.filter((v) =>
    v.status === 'maintenance' || v.status === 'Maintenance' || v.status === 'in_maintenance'
  );

  const sections = [
    {
      title: 'Vehicles',
      description: 'Manage your truck and vehicle fleet',
      href: '/fleet/vehicles',
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      stat: vehicles.length,
      statLabel: 'total vehicles',
    },
    {
      title: 'Drivers',
      description: 'Driver profiles and assignments',
      href: '/fleet/drivers',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50',
      stat: null,
      statLabel: 'manage drivers',
    },
    {
      title: 'Driver Scorecard',
      description: 'Monitor driver performance metrics',
      href: '/fleet/drivers/scorecard',
      icon: CheckCircle2,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      stat: null,
      statLabel: 'view scorecards',
    },
    {
      title: 'Fuel Efficiency',
      description: 'Track fuel consumption and costs',
      href: '/fleet/fuel-efficiency',
      icon: Fuel,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      stat: null,
      statLabel: 'view reports',
    },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">Manage vehicles, drivers, and operational efficiency.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Vehicles</CardDescription>
            <CardTitle className="text-3xl">{vehicles.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">In your fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">{activeVehicles.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" /> Ready for dispatch
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Maintenance</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{maintenanceVehicles.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3 text-yellow-600" /> Being serviced
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-3xl text-gray-500">{inactiveVehicles.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-gray-500" /> Off the road
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((sec) => (
          <Link key={sec.title} href={sec.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-lg ${sec.bg} flex items-center justify-center`}>
                    <sec.icon className={`h-5 w-5 ${sec.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold">{sec.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sec.description}</p>
                  </div>
                  {sec.stat !== null && (
                    <span className="text-2xl font-bold">{sec.stat}</span>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {sec.statLabel} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {vehicles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Vehicles</CardTitle>
              <Link href="/fleet/vehicles">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.slice(0, 5).map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Truck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-xs text-muted-foreground">{vehicle.licensePlate || 'No plate'}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      vehicle.status === 'active' || vehicle.status === 'Active'
                        ? 'default'
                        : vehicle.status === 'maintenance' || vehicle.status === 'Maintenance'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {vehicle.status || 'Unknown'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
