
"use client";

import Image from 'next/image';
import { ContentFile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image as ImageIcon, Video, File, Trash2, Download, Headphones, Pencil, Loader2, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  file: ContentFile;
  isAdmin?: boolean;
  onDelete?: (file: ContentFile) => void;
  onEdit?: (file: ContentFile) => void;
  index?: number;
}

export function ContentCard({ file, isAdmin, onDelete, onEdit, index = 0 }: ContentCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Icon = {
    image: ImageIcon,
    video: Video,
    audio: Headphones,
    document: FileText,
    other: File,
  }[file.type] || File;

  const isPlaceholder = file.url.includes('placehold.co') || file.url.includes('picsum.photos');

  const timeAgo = mounted && file.uploadedAt
    ? formatDistanceToNow(new Date(file.uploadedAt)) + ' ago' 
    : 'Recently';

  const previewSrc = file.thumbnailUrl || (file.type === 'image' ? file.url : null);

  const isDownloadable = file.isDownloadable !== false;

  const handleDownload = async () => {
    if (!isDownloadable || isDownloading) return;
    setIsDownloading(true);
    
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const extension = file.mimeType?.split('/')[1] || 'bin';
      const downloadName = file.name.includes('.') ? file.name : `${file.name}.${extension}`;
      
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(file.url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary/50 bg-card border-border/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
      )}
      style={{ animationDelay: `${Math.min(index * 75, 600)}ms` }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt={file.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="content file preview"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/30">
            <Icon className="h-12 w-12 text-muted-foreground/50 transition-transform duration-300 group-hover:scale-110" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
           {isDownloadable ? (
             <Button 
               size="sm" 
               variant="secondary" 
               className="w-full gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-bold"
               onClick={(e) => {
                 e.preventDefault();
                 handleDownload();
               }}
               disabled={isDownloading}
             >
               {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
               {isDownloading ? "Processing..." : "Download"}
             </Button>
           ) : (
             <div className="w-full flex items-center justify-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
               <Lock className="h-3 w-3" />
               Access Restricted
             </div>
           )}
        </div>

        {isPlaceholder && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="destructive" className="text-[8px] font-bold uppercase py-0 px-2 gap-1 bg-amber-500/90 text-white border-none">
              <AlertTriangle className="h-2 w-2" /> Placeholder
            </Badge>
          </div>
        )}

        {!isDownloadable && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="text-[8px] font-bold uppercase py-0 px-2 gap-1 bg-black/60 text-white border-none backdrop-blur-md">
              <Lock className="h-2 w-2" /> Private
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm truncate max-w-[80%] group-hover:text-primary transition-colors" title={file.name}>{file.name}</h3>
          <Icon className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
        </div>
        <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/70">
          {timeAgo} • {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex flex-wrap gap-1.5">
          {file.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[9px] font-bold py-0.5 h-auto px-2 bg-muted/50 text-muted-foreground border-none group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" className="text-[9px] font-bold py-0.5 h-auto px-2 border-primary/20 text-primary/70 uppercase">
            {file.type}
          </Badge>
        </div>
      </CardContent>
      {isAdmin && (
        <CardFooter className="p-2 border-t border-border/20 bg-muted/20 flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => onEdit?.(file)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete?.(file)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
