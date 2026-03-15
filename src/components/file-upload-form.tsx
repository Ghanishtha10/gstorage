"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, FileText, Image as ImageIcon, CheckCircle2, Video, Headphones, Camera, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn, fileToBase64 } from '@/lib/utils';
import { FileType } from '@/lib/types';

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [fileType, setFileType] = useState<FileType>('');
  const [customThumbUrl, setCustomThumbUrl] = useState('');
  
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  // Firestore document limit is 1MB. Base64 adds ~33% overhead.
  // We limit to ~700KB to stay very safely under the hard 1,048,576 bytes limit.
  const MAX_FILE_SIZE = 700 * 1024;

  useEffect(() => {
    if (file) {
      setDisplayName(file.name);
      if (file.type.startsWith('image/')) setFileType('image');
      else if (file.type.startsWith('video/')) setFileType('video');
      else if (file.type.startsWith('audio/')) setFileType('audio');
      else if (file.type === 'application/pdf') setFileType('document');
      else setFileType('other');
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setThumbFile(selected);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleUpload = async () => {
    if (!file || !db) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Prototype limit is 700KB to ensure secure database syncing.",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert the real file into a Base64 string for persistent storage
      const finalFileUrl = await fileToBase64(file);

      let finalThumb = customThumbUrl;
      if (thumbFile) {
        finalThumb = await fileToBase64(thumbFile);
      } else if (!finalThumb && file.type.startsWith('image/')) {
        finalThumb = finalFileUrl;
      }

      await addDoc(collection(db, 'files'), {
        name: displayName || file.name,
        url: finalFileUrl,
        thumbnailUrl: finalThumb || null,
        type: fileType || 'other',
        mimeType: file.type,
        size: file.size,
        tags: ['General'],
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "File successfully committed to the vault.",
      });
      router.push('/admin');
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "The secure vault could not accept this file. Ensure it is under 700KB.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isOverSize = file && file.size > MAX_FILE_SIZE;

  return (
    <Card className="bg-card border-border/40 overflow-hidden shadow-xl">
      <CardHeader className="bg-muted/30 pb-6">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" /> Secure Asset Upload
        </CardTitle>
        <CardDescription>Upload files under 700KB for real-time synchronization.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {!file ? (
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center space-y-4 transition-all cursor-pointer group relative",
              isDragging 
                ? "border-primary bg-primary/5 scale-[0.99] shadow-inner" 
                : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
            )}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              id="file-upload" 
              onChange={handleFileChange} 
            />
            <div className="pointer-events-none">
              <div className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors",
                isDragging ? "bg-primary/20" : "bg-muted/50 group-hover:bg-primary/10"
              )}>
                <Upload className={cn(
                  "h-8 w-8 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
              </div>
              <h4 className="font-semibold text-lg">
                {isDragging ? "Drop to secure" : "Select or drag file"}
              </h4>
              <p className="text-sm text-muted-foreground">PDF, MP3, Source Code, etc. (Max 700KB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className={cn(
              "flex items-center justify-between p-4 rounded-xl border",
              isOverSize ? "bg-destructive/10 border-destructive/40" : "bg-muted/40 border-border/60 shadow-sm"
            )}>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {fileType === 'image' && <ImageIcon className="h-5 w-5 text-primary" />}
                  {fileType === 'video' && <Video className="h-5 w-5 text-primary" />}
                  {fileType === 'audio' && <Headphones className="h-5 w-5 text-primary" />}
                  {fileType === 'document' && <FileText className="h-5 w-5 text-primary" />}
                  {!['image', 'video', 'audio', 'document'].includes(fileType) && <Upload className="h-5 w-5 text-primary" />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className={cn("text-[10px] font-bold uppercase", isOverSize ? "text-destructive" : "text-muted-foreground")}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB {isOverSize && "!! EXCEEDS PROTOTYPE LIMIT !!"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isOverSize && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-[10px] font-bold animate-pulse uppercase tracking-widest">
                <AlertCircle className="h-4 w-4 shrink-0" />
                This file exceeds the 700KB database limit.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                <input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kind / Category</Label>
                <input 
                  id="fileType" 
                  value={fileType} 
                  onChange={(e) => setFileType(e.target.value)}
                  placeholder="e.g. PDF, Archive, Source..."
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preview Image (Optional)</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    id="thumbUrl" 
                    value={thumbFile ? `[Asset Selected: ${thumbFile.name}]` : customThumbUrl} 
                    onChange={(e) => {
                      setCustomThumbUrl(e.target.value);
                      setThumbFile(null);
                    }}
                    placeholder="URL or use the upload button..."
                    className="flex h-11 flex-1 rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background"
                    readOnly={!!thumbFile}
                  />
                  <input type="file" className="hidden" ref={thumbInputRef} accept="image/*" onChange={handleThumbChange} />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => thumbInputRef.current?.click()} 
                    className="h-11 px-6 border-primary/20 hover:border-primary/50 text-xs font-bold uppercase"
                  >
                    <Camera className="h-4 w-4 mr-2" /> {thumbFile ? "Change" : "Upload"}
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-xl shadow-xl shadow-primary/20 mt-4 active:scale-[0.98] transition-all" 
              onClick={handleUpload} 
              disabled={isUploading || isOverSize || !file}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalizing Synchronization...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" /> Commit to Digital Locker
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
