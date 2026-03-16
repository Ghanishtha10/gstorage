
"use client";

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HardDrive, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'link';
import { AdminContentManager } from '@/components/admin-content-manager';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();

  const filesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'files'), orderBy('uploadedAt', 'desc'));
  }, [db]);

  const { data: files, isLoading } = useCollection(filesQuery);

  const totalSize = files?.reduce((acc, f) => acc + (f.size || 0), 0) || 0;
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

  const stats = [
    { label: 'Total Files', value: files?.length || 0, icon: FileText, color: 'text-primary' },
    { label: 'Storage Used', value: `${totalSizeMB} MB`, icon: HardDrive, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">System Overview</h1>
          <p className="text-muted-foreground">Manage your repository and assets in one place.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold px-6 shadow-lg shadow-primary/20">
          <Link href="/admin/upload">
            <Plus className="h-5 w-5" /> New Upload
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/30" /> : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading library...</p>
        </div>
      ) : (
        <AdminContentManager initialFiles={files || []} />
      )}
    </div>
  );
}
