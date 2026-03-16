
"use client";

import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, FileText, Image as ImageIcon, CheckCircle2, Video, Headphones, HardDrive, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FileType } from '@/lib/types';
import { suggestContentTags } from '@/ai/flows/suggest-content-tags-flow';
import { upload } from '@vercel/blob/client';

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [fileType, setFileType] = useState<FileType>('');
  
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

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

  /**
   * Performs a client-side direct upload to Vercel Blob.
   * This handles large files by bypassing the Next.js API route body limits.
   */
  const uploadToBlob = async (targetFile: File, onProgress?: (pct: number) => void): Promise<string> => {
    try {
      const newBlob = await upload(targetFile.name, targetFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: (progressEvent) => {
          if (onProgress) onProgress(progressEvent.percentage);
        },
      });
      return newBlob.url;
    } catch (err: any) {
      console.error("Browser-to-Blob upload error:", err);
      throw err;
    }
  };

  const handleUpload = async () => {
    if (!file || !db) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // 1. Upload the main file directly from the browser to Vercel Blob
      const mainUrl = await uploadToBlob(file, (pct) => setUploadProgress(pct * 0.8)); // 80% of progress for upload
      
      let thumbnailUrl = null;
      if (thumbFile) {
        // 2. Upload thumbnail if present
        thumbnailUrl = await uploadToBlob(thumbFile);
      }

      setUploadProgress(85);

      // 3. AI Categorization
      let suggestedTags = ['General'];
      try {
        const aiResponse = await suggestContentTags({
          content: mainUrl,
          mimeType: file.type,
          fileName: file.name
        });
        if (aiResponse?.tags && aiResponse.tags.length > 0) {
          suggestedTags = aiResponse.tags;
        }
      } catch (aiError) {
        console.warn("AI tagging failed:", aiError);
      }

      setUploadProgress(95);

      // 4. Store metadata in Firestore
      await addDoc(collection(db, 'files'), {
        name: displayName || file.name,
        url: mainUrl,
        thumbnailUrl: thumbnailUrl,
        type: fileType || 'other',
        mimeType: file.type,
        size: file.size,
        tags: suggestedTags,
        uploadedAt: new Date().toISOString(),
        isDownloadable: true,
      });

      setUploadProgress(100);
      toast({
        title: "Transfer Complete",
        description: "Large asset successfully synchronized with the vault.",
      });
      router.push('/admin');
    } catch (error: any) {
      console.error("Full upload flow failed:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "The secure transfer was interrupted.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="bg-card border-border/40 overflow-hidden shadow-2xl rounded-2xl">
      <CardHeader className="bg-muted/10 pb-4 sm:pb-6 border-b border-border/20">
        <CardTitle className="flex items-center gap-2 text-primary uppercase tracking-widest text-xs sm:text-sm font-bold">
          <HardDrive className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Large Asset Transfer</span>
        </CardTitle>
        <CardDescription className="text-[10px] sm:text-xs">Direct browser-to-cloud synchronization enabled.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        {!file ? (
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if(f) setFile(f); }}
            className={cn(
              "border-2 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-16 text-center space-y-4 transition-all cursor-pointer group relative min-h-[200px] flex flex-col items-center justify-center",
              isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border/60 hover:border-primary/50 hover:bg-muted/10"
            )}
          >
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} />
            <div className="pointer-events-none">
              <div className={cn(
                "h-12 w-12 sm:h-20 sm:w-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-sm",
                isDragging ? "bg-primary/20 scale-110" : "bg-muted/30 group-hover:bg-primary/10 group-hover:scale-105"
              )}>
                <Upload className={cn("h-6 w-6 sm:h-10 sm:w-10 transition-colors", isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
              </div>
              <h4 className="font-bold text-lg sm:text-xl uppercase tracking-tight">Select Large File</h4>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Supporting assets up to 500MB+</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border bg-muted/20 border-border/40 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-inner">
                  {fileType === 'image' && <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                  {fileType === 'video' && <Video className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                  {fileType === 'audio' && <Headphones className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                  {fileType === 'document' && <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                  {!['image', 'video', 'audio', 'document'].includes(fileType) && <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[300px]">{file.name}</p>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase text-primary tracking-widest">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0" disabled={isUploading}>
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Asset Identity</Label>
                <input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isUploading}
                  className="flex h-11 sm:h-12 w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Classification</Label>
                <input 
                  id="fileType" 
                  value={fileType} 
                  onChange={(e) => setFileType(e.target.value)}
                  disabled={isUploading}
                  placeholder="e.g. Video, Document..."
                  className="flex h-11 sm:h-12 w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Visual Reference (Optional)</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="file" className="hidden" ref={thumbInputRef} accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) setThumbFile(f); }} />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11 sm:h-12 rounded-xl border-dashed border-primary/30 hover:border-primary/60 transition-all bg-muted/5 gap-2" 
                  onClick={() => thumbInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {thumbFile ? <CheckCircle2 className="h-4 w-4 text-secondary" /> : <ImageIcon className="h-4 w-4" />}
                  <span className="truncate max-w-[200px]">{thumbFile ? thumbFile.name : "Select Thumbnail"}</span>
                </Button>
                {thumbFile && <Button variant="ghost" size="icon" className="h-11 sm:h-12 w-11 sm:w-12 text-destructive self-end sm:self-auto shrink-0" onClick={() => setThumbFile(null)} disabled={isUploading}><X className="h-5 w-5" /></Button>}
              </div>
            </div>

            <div className="space-y-4">
               {isUploading && (
                 <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary">
                     <span>Transferring Bytes...</span>
                     <span>{Math.round(uploadProgress)}%</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-primary transition-all duration-300 ease-out" 
                       style={{ width: `${uploadProgress}%` }}
                     />
                   </div>
                 </div>
               )}

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 sm:h-16 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[10px] sm:text-xs relative overflow-hidden group" 
                onClick={handleUpload} 
                disabled={isUploading || !file}
              >
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 animate-pulse text-secondary" />
                        Synchronizing...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Upload</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
