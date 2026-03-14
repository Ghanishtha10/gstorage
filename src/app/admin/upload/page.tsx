import { FileUploadForm } from '@/components/file-upload-form';
import { ArrowLeft, Sparkles } from 'lucide-react';
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
          <p className="text-muted-foreground">Add files to your locker and organize them with intelligent tags.</p>
        </div>
      </div>

      <FileUploadForm />

      <div className="p-6 rounded-2xl bg-[#1F2D30]/50 border border-primary/10 flex gap-4">
        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
           <Sparkles className="h-5 w-5 text-secondary" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold">How AI Tagging works</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When you click "Generate with AI", our system securely processes a preview of your file. 
            It identifies visual elements in images, key themes in documents, and metadata in videos 
            to suggest descriptive tags. You can then add, remove, or edit these tags before final upload.
          </p>
        </div>
      </div>
    </div>
  );
}