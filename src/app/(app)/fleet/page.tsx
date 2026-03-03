import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Users, Fuel, ArrowRight, PlusCircle, BarChart3, Wrench } from 'lucide-react';

export default function FleetPage() {
  const sections = [
    {
      title: 'Vehicles',
      description: 'Manage your fleet of trucks, trailers and other vehicles. Track status, mileage and maintenance schedules.',
      icon: Truck,
      href: '/fleet/vehicles',
      addHref: '/fleet/vehicles/new',
      color: 'text-blue-500',
    },
    {
      title: 'Drivers',
      description: 'Manage driver profiles, licenses, certifications, and assignments. Track driver performance and compliance.',
      icon: Users,
      href: '/fleet/drivers',
      addHref: '/fleet/drivers/new',
      color: 'text-green-500',
    },
    {
      title: 'Fuel Efficiency',
      description: 'Monitor fuel consumption, track refuels, and analyze fuel efficiency across your fleet.',
      icon: Fuel,
      href: '/fleet/fuel-efficiency',
      addHref: null,
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">Oversee your vehicles, drivers, and fuel efficiency in one place.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${section.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end gap-2">
                <Button asChild variant="default" className="w-full gap-2">
                  <Link href={section.href}>
                    <ArrowRight className="h-4 w-4" />
                    View {section.title}
                  </Link>
                </Button>
                {section.addHref && (
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link href={section.addHref}>
                      <PlusCircle className="h-4 w-4" />
                      Add New
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Fleet Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Total Vehicles</span>
              <Button asChild variant="link" size="sm"><Link href="/fleet/vehicles">View All</Link></Button>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Active Drivers</span>
              <Button asChild variant="link" size="sm"><Link href="/fleet/drivers">View All</Link></Button>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Fuel Reports</span>
              <Button asChild variant="link" size="sm"><Link href="/fleet/fuel-efficiency">View All</Link></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Maintenance & AI Insights
            </CardTitle>
            <CardDescription>Use AI to predict and schedule vehicle maintenance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full gap-2">
              <Link href="/ai-maintenance">
                <Wrench className="h-4 w-4" />
                Open AI Maintenance Planner
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
