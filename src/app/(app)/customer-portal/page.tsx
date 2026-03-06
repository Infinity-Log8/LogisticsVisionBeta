import Link from 'next/link';
import { ArrowLeft, Package, FileText, MapPin, Bell, Settings, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockShipments = [
  { id: 'SHP-001', customer: 'ABC Logistics', origin: 'Johannesburg', destination: 'Cape Town', status: 'In Transit', eta: '2025-12-05' },
  { id: 'SHP-002', customer: 'XYZ Manufacturing', origin: 'Durban', destination: 'Pretoria', status: 'Delivered', eta: '2025-11-30' },
  { id: 'SHP-003', customer: 'Fast Freight Co', origin: 'Port Elizabeth', destination: 'Bloemfontein', status: 'Pending', eta: '2025-12-10' },
];

const features = [
  {
    icon: Package,
    title: 'Live Shipment Tracking',
    description: 'Real-time GPS tracking for all active shipments with push notifications.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: FileText,
    title: 'Invoice & Payment Portal',
    description: 'View, download, and pay invoices directly. Full payment history included.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: MapPin,
    title: 'Delivery Status Updates',
    description: 'Automated SMS and email updates at every milestone of your delivery.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Bell,
    title: 'Custom Alerts',
    description: 'Set custom thresholds and get notified for delays, arrivals, and exceptions.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Settings,
    title: 'Account Management',
    description: 'Manage contact details, preferences, and user access for your team.',
    color: 'text-gray-600',
    bg: 'bg-gray-50',
  },
  {
    icon: Users,
    title: 'Multi-User Access',
    description: 'Invite team members with role-based permissions for your organization.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
];

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'Delivered') return 'default';
  if (status === 'In Transit') return 'secondary';
  return 'outline';
}

export default function CustomerPortalPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Customer Portal</h1>
            <p className="text-muted-foreground">A self-service hub for your customers to track, manage, and pay.</p>
          </div>
        </div>
        <Button>
          <ExternalLink className="mr-2 h-4 w-4" />
          Launch Customer Portal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Customers</CardDescription>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Shipments</CardDescription>
            <CardTitle className="text-3xl">18</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Being tracked in real-time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portal Logins (30d)</CardDescription>
            <CardTitle className="text-3xl">142</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+28% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>Latest customer shipment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockShipments.map((shipment) => (
                <div key={shipment.id} className="flex items-start justify-between gap-4 p-3 rounded-lg border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{shipment.id}</span>
                      <Badge variant={getStatusVariant(shipment.status)} className="text-xs">
                        {shipment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{shipment.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {shipment.origin} → {shipment.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="text-sm font-medium">{shipment.eta}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portal Features</CardTitle>
            <CardDescription>What your customers can access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {features.slice(0, 4).map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${feature.bg} flex-shrink-0`}>
                    <feature.icon className={`h-4 w-4 ${feature.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Ready to Launch Your Customer Portal?</h3>
              <p className="text-blue-700 text-sm">
                Give your customers a branded self-service portal to track shipments,
                view invoices, and manage their account — all white-labeled with your logo.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-blue-300">
                View Demo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Enable Portal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
