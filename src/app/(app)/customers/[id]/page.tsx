import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Building2, User, FileText, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getCustomerById } from '@/services/customer-service';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  let customer = null;
  try { customer = await getCustomerById(id, ''); } catch (e) {}
  if (!customer) { notFound(); }

  const statusColor = customer.status === 'Active'
    ? 'bg-green-100 text-green-800'
    : customer.status === 'Inactive'
    ? 'bg-red-100 text-red-800'
    : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            {customer.company && <p className="text-muted-foreground">{customer.company}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>{customer.status}</span>
          <Link href={`/customers/edit/${id}`}>
            <Button variant="outline" size="sm">Edit Customer</Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email || '—'}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.phone || '—'}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{customer.address || '—'}</p>
              </div>
            </div>
            {customer.company && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{customer.company}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer ID</p>
              <p className="font-mono text-sm">{id}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${statusColor}`}>{customer.status}</span>
            </div>
            {customer.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="mt-1">{customer.notes}</p>
                </div>
              </>
            )}
            <Separator />
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="font-medium">
                  {customer.createdAt
                    ? new Date(
                        (customer.createdAt as any).toDate
                          ? (customer.createdAt as any).toDate()
                          : customer.createdAt
                      ).toLocaleDateString()
                    : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common actions for this customer</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href={`/customers/edit/${id}`}>
            <Button variant="outline">Edit Customer Info</Button>
          </Link>
          <Link href="/customers">
            <Button variant="ghost">View All Customers</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
