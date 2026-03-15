"use client";

import Image from 'next/image';
import { ContentFile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image as ImageIcon, Video, File, Trash2, Download, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  file: ContentFile;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  index?: number;
}

export function ContentCard({ file, isAdmin, onDelete, index = 0 }: ContentCardProps) {
  const [mounted, setMounted] = useState(false);

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

  // Avoid hydration mismatch for relative time operations
  const timeAgo = mounted 
    ? formatDistanceToNow(new Date(file.createdAt)) + ' ago' 
    : 'Recently';

  const previewSrc = file.thumbnailUrl || (file.type === 'image' ? file.url : null);

  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary/50 bg-card border-border/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
        index > 0 && `delay-[${Math.min(index * 50, 500)}ms]`
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
           <Button size="sm" variant="secondary" className="w-full gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-bold">
             <Download className="h-4 w-4" /> Download
           </Button>
        </div>
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
        <CardFooter className="p-2 border-t border-border/20 bg-muted/20 flex justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete?.(file.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
