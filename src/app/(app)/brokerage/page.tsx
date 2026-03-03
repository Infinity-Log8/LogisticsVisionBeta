import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandshakeIcon, DollarSign, ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';

export default function BrokeragePage() {
  return (
    <div className="flex-1 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brokerage</h1>
        <p className="text-muted-foreground">Manage freight broker commissions, agent payouts, and carrier relationships.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-blue-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Commissions</CardTitle>
                <CardDescription>Track and manage broker commissions earned on freight loads.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full gap-2">
              <Link href="/brokerage/commissions">
                <ArrowRight className="h-4 w-4" />
                View Commissions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-green-500">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Payouts</CardTitle>
                <CardDescription>Manage carrier and agent payout processing and history.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full gap-2">
              <Link href="/brokerage/payouts">
                <ArrowRight className="h-4 w-4" />
                View Payouts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Brokerage Overview
          </CardTitle>
          <CardDescription>Summary of broker performance and financial activity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Total Commissions</span>
            <Button asChild variant="link" size="sm"><Link href="/brokerage/commissions">View Details</Link></Button>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Pending Payouts</span>
            <Button asChild variant="link" size="sm"><Link href="/brokerage/payouts">View Details</Link></Button>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground">Financial P&L</span>
            <Button asChild variant="link" size="sm"><Link href="/accounting/pnl">View P&L</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
