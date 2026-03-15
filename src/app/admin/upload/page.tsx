import { FileUploadForm } from '@/components/file-upload-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminUploadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Action Center</span>
          </div>
          <h1 className="text-3xl font-headline font-bold">Upload New Asset</h1>
          <p className="text-muted-foreground">Add files to your locker and organize them efficiently.</p>
        </div>
      </div>

      <FileUploadForm />
    </div>
  );
}
