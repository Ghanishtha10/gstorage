import Image from 'next/image';
import { ContentFile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image as ImageIcon, Video, File, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  file: ContentFile;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export function ContentCard({ file, isAdmin, onDelete }: ContentCardProps) {
  const Icon = {
    image: ImageIcon,
    video: Video,
    document: FileText,
    other: File,
  }[file.type];

  return (
    <Card className="group overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 bg-card border-border/40">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {file.type === 'image' ? (
          <Image
            src={file.url}
            alt={file.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            data-ai-hint="content file preview"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/30">
            <Icon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
           <Button size="sm" variant="secondary" className="w-full gap-2">
             <Download className="h-4 w-4" /> Download
           </Button>
        </div>
      </div>
      <CardHeader className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate max-w-[80%]" title={file.name}>{file.name}</h3>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(file.createdAt))} ago • {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex flex-wrap gap-1">
          {file.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] py-0 h-4 px-1.5 bg-muted/50 text-muted-foreground border-none">
              {tag}
            </Badge>
          ))}
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