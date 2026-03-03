import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CalendarOff, DollarSign, ArrowRight, PlusCircle, ClipboardList } from 'lucide-react';

export default function HRPage() {
  const sections = [
    {
      title: 'Employees',
      description: 'Manage employee records, roles, departments, and onboarding. Keep track of all staff information.',
      icon: Users,
      href: '/hr/employees',
      addHref: '/hr/employees/new',
      color: 'text-blue-500',
    },
    {
      title: 'Leave Management',
      description: 'Track employee leave requests, approvals, and balances. Manage time-off policies and schedules.',
      icon: CalendarOff,
      href: '/hr/leave',
      addHref: null,
      color: 'text-orange-500',
    },
    {
      title: 'Payroll',
      description: 'Process payroll, manage salary structures, deductions, and generate pay slips for all employees.',
      icon: DollarSign,
      href: '/hr/payroll',
      addHref: null,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
          <p className="text-muted-foreground">Manage your workforce — employees, leave, and payroll in one place.</p>
        </div>
        <Button asChild>
          <Link href="/hr/employees/new" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Employee
          </Link>
        </Button>
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
                <Button asChild className="w-full gap-2">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline"><Link href="/hr/employees/new">New Employee</Link></Button>
          <Button asChild variant="outline"><Link href="/hr/leave">Review Leave Requests</Link></Button>
          <Button asChild variant="outline"><Link href="/hr/payroll">Process Payroll</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
