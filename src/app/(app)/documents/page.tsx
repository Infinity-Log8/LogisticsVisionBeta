import Link from 'next/link';
import { ArrowLeft, FileText, Upload, FolderOpen, Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const mockDocuments = [
  { id: '1', name: 'Vehicle Registration - TRK-001.pdf', type: 'Registration', size: '245 KB', date: '2025-11-15', category: 'Fleet', status: 'Active' },
  { id: '2', name: 'Insurance Policy 2025.pdf', type: 'Insurance', size: '1.2 MB', date: '2025-01-01', category: 'Compliance', status: 'Active' },
  { id: '3', name: 'Driver License - John Smith.pdf', type: 'License', size: '180 KB', date: '2025-06-30', category: 'HR', status: 'Expiring Soon' },
  { id: '4', name: 'Trip Invoice - TRP-2025-001.pdf', type: 'Invoice', size: '95 KB', date: '2025-11-20', category: 'Accounting', status: 'Active' },
  { id: '5', name: 'Maintenance Report - TRK-003.pdf', type: 'Maintenance', size: '320 KB', date: '2025-10-05', category: 'Fleet', status: 'Active' },
  { id: '6', name: 'Load Agreement - AGR-2025-012.pdf', type: 'Agreement', size: '450 KB', date: '2025-11-18', category: 'Brokerage', status: 'Active' },
];

const categories = [
  { name: 'Fleet', count: 12, icon: '🚛', color: 'bg-blue-50 text-blue-700' },
  { name: 'HR', count: 8, icon: '👥', color: 'bg-green-50 text-green-700' },
  { name: 'Compliance', count: 5, icon: '📋', color: 'bg-yellow-50 text-yellow-700' },
  { name: 'Accounting', count: 23, icon: '💰', color: 'bg-purple-50 text-purple-700' },
  { name: 'Brokerage', count: 9, icon: '🤝', color: 'bg-orange-50 text-orange-700' },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'Expiring Soon': return 'destructive';
    case 'Active': return 'default';
    default: return 'secondary';
  }
}

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">Manage all business documents, licenses, and compliance files.</p>
          </div>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Card key={cat.name} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex flex-col items-center text-center gap-2">
                <span className="text-2xl">{cat.icon}</span>
                <p className="font-medium text-sm">{cat.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>
                  {cat.count} files
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>Search and manage your document library</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search documents..." className="pl-8 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 p-2 bg-red-50 rounded-lg">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.type} · {doc.size} · {doc.date}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {doc.category}
                </Badge>
                <Badge variant={getStatusBadge(doc.status) as any} className="text-xs">
                  {doc.status}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-1">Upload New Documents</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Drag and drop files here, or click to browse
          </p>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
