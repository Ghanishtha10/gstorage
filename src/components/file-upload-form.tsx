"use client";

import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, FileText, Image as ImageIcon, CheckCircle2, Video, Headphones, Camera, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn, fileToBase64 } from '@/lib/utils';
import { FileType } from '@/lib/types';

const MAX_FILE_SIZE = 700 * 1024; // 700KB limit for Firestore strings

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [fileType, setFileType] = useState<FileType>('');
  const [customThumbUrl, setCustomThumbUrl] = useState('');
  
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

      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Maximum file size for this vault is 700KB.",
        });
        setFile(null);
      }
    }
  }, [file, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file || !db) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      setUploadProgress(30);
      const fileDataUri = await fileToBase64(file);
      setUploadProgress(70);

      let finalThumb = customThumbUrl;
      if (thumbFile) {
        finalThumb = await fileToBase64(thumbFile);
      }
      setUploadProgress(90);

      await addDoc(collection(db, 'files'), {
        name: displayName || file.name,
        url: fileDataUri,
        thumbnailUrl: finalThumb || null,
        type: fileType || 'other',
        mimeType: file.type,
        size: file.size,
        tags: ['General'],
        createdAt: new Date().toISOString(),
      });

      setUploadProgress(100);
      toast({
        title: "Transfer Complete",
        description: "File successfully added to the vault.",
      });
      router.push('/admin');
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "An error occurred during the secure transfer.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-card border-border/40 overflow-hidden shadow-2xl rounded-2xl">
      <CardHeader className="bg-muted/10 pb-6 border-b border-border/20">
        <CardTitle className="flex items-center gap-2 text-primary uppercase tracking-widest text-sm font-bold">
          <HardDrive className="h-5 w-5" />
          <span>Asset Transfer</span>
        </CardTitle>
        <CardDescription className="text-xs">Securely process files up to 700KB.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-8 space-y-8">
        {!file ? (
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if(f) setFile(f); }}
            className={cn(
              "border-2 border-dashed rounded-3xl p-8 sm:p-16 text-center space-y-4 transition-all cursor-pointer group relative",
              isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border/60 hover:border-primary/50 hover:bg-muted/10"
            )}
          >
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} />
            <div className="pointer-events-none">
              <div className={cn(
                "h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-sm",
                isDragging ? "bg-primary/20 scale-110" : "bg-muted/30 group-hover:bg-primary/10 group-hover:scale-105"
              )}>
                <Upload className={cn("h-10 w-10 transition-colors", isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
              </div>
              <h4 className="font-bold text-xl uppercase tracking-tight">Select or Drag Asset</h4>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Optimized for small files</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 rounded-2xl border bg-muted/20 border-border/40 shadow-sm">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-12 w-12 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center shadow-inner">
                  {fileType === 'image' && <ImageIcon className="h-6 w-6 text-primary" />}
                  {fileType === 'video' && <Video className="h-6 w-6 text-primary" />}
                  {fileType === 'audio' && <Headphones className="h-6 w-6 text-primary" />}
                  {fileType === 'document' && <FileText className="h-6 w-6 text-primary" />}
                  {!['image', 'video', 'audio', 'document'].includes(fileType) && <Upload className="h-6 w-6 text-primary" />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate max-w-[140px] sm:max-w-[300px]">{file.name}</p>
                  <p className="text-[10px] font-bold uppercase text-primary tracking-widest">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0" disabled={isUploading}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Display Name</Label>
                <input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isUploading}
                  className="flex h-12 w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Category</Label>
                <input 
                  id="fileType" 
                  value={fileType} 
                  onChange={(e) => setFileType(e.target.value)}
                  disabled={isUploading}
                  placeholder="e.g. PDF, PNG..."
                  className="flex h-12 w-full rounded-xl border border-border/60 bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-16 rounded-2xl shadow-xl shadow-primary/20 mt-4 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs relative overflow-hidden group" 
              onClick={handleUpload} 
              disabled={isUploading || !file}
            >
              {isUploading && (
                <div 
                  className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                />
              )}
              <div className="flex items-center justify-center gap-2 relative z-10">
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Uploading . .. ...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Upload</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}