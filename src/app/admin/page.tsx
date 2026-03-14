import { getFiles } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, HardDrive, TrendingUp, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ContentCard } from '@/components/content-card';

export default async function AdminDashboard() {
  const files = await getFiles();
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

  const stats = [
    { label: 'Total Files', value: files.length, icon: FileText, color: 'text-primary' },
    { label: 'Storage Used', value: `${totalSizeMB} MB`, icon: HardDrive, color: 'text-secondary' },
    { label: 'Public Views', value: '1.2k', icon: Users, color: 'text-primary' },
    { label: 'AI Tag Hits', value: '458', icon: Sparkles, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">System Overview</h1>
          <p className="text-muted-foreground">Manage your repository and view real-time performance metrics.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold px-6 shadow-lg shadow-primary/20">
          <Link href="/admin/upload">
            <Plus className="h-5 w-5" /> New Upload
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-[10px] text-secondary mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold">Recent Content</h2>
          <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold">
            <Link href="/admin/files">View All Manager</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.slice(0, 4).map((file) => (
            <ContentCard key={file.id} file={file} isAdmin />
          ))}
        </div>
      </section>

      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
           <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shrink-0 shadow-xl shadow-primary/20">
             <Sparkles className="h-8 w-8" />
           </div>
           <div className="space-y-1">
             <h3 className="text-xl font-bold">AI Organizes, You Relax.</h3>
             <p className="text-sm text-muted-foreground max-w-xl">
               Our advanced GenAI models analyze every file you upload to suggest relevant tags. 
               This keeps your locker clean and searchable without the manual overhead.
             </p>
           </div>
           <Button variant="outline" className="ml-auto border-primary text-primary hover:bg-primary/5 whitespace-nowrap">
             Learn about Tagging
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}