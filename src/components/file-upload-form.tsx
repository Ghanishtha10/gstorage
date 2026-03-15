"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Loader2, FileText, Image as ImageIcon, CheckCircle2, Video, Headphones, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FileType } from '@/lib/types';

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [fileType, setFileType] = useState<FileType>('other');
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
      // Simulate preview URL for UI feedback
      setCustomThumbUrl(URL.createObjectURL(selected));
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
    setIsUploading(true);
    
    try {
      // Simulation of URL generation for prototype
      const fakeUrl = fileType === 'image' 
        ? `https://picsum.photos/seed/${Math.random()}/800/600`
        : `https://placehold.co/600x400?text=${encodeURIComponent(displayName)}`;

      const finalThumb = thumbFile 
        ? `https://picsum.photos/seed/${Math.random()}/400/300` // Simulated upload
        : customThumbUrl;

      await addDoc(collection(db, 'files'), {
        name: displayName || file.name,
        url: fakeUrl,
        thumbnailUrl: finalThumb || null,
        type: fileType,
        mimeType: file.type,
        size: file.size,
        tags: ['General'],
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "File Saved",
        description: "Your file metadata is now persisted in Firestore.",
      });
      router.push('/admin');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Error saving file metadata to Firestore.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-card border-border/40 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-6">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" /> New Content Upload
        </CardTitle>
        <CardDescription>Select a file and specify its category/details.</CardDescription>
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
                {isDragging ? "Drop your file here" : "Choose a file or drag and drop"}
              </h4>
              <p className="text-sm text-muted-foreground">PDF, MP3, Images, Videos, etc.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border/60">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {fileType === 'image' && <ImageIcon className="h-5 w-5 text-primary" />}
                  {fileType === 'video' && <Video className="h-5 w-5 text-primary" />}
                  {fileType === 'audio' && <Headphones className="h-5 w-5 text-primary" />}
                  {fileType === 'document' && <FileText className="h-5 w-5 text-primary" />}
                  {fileType === 'other' && <Upload className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Project Report"
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category Type</Label>
                <Select value={fileType} onValueChange={(v) => setFileType(v as FileType)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image (Photo/Graphic)</SelectItem>
                    <SelectItem value="video">Video (MP4/MOV)</SelectItem>
                    <SelectItem value="audio">Audio (MP3/WAV)</SelectItem>
                    <SelectItem value="document">Document (PDF/Word)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Thumbnail Configuration</Label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 w-full space-y-2">
                    <Input 
                      id="thumbUrl" 
                      value={customThumbUrl} 
                      onChange={(e) => setCustomThumbUrl(e.target.value)}
                      placeholder="Paste thumbnail URL here..."
                      className="bg-background/50"
                    />
                    <p className="text-[10px] text-muted-foreground italic">Or upload a thumbnail image directly below.</p>
                  </div>
                  <div className="shrink-0">
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={thumbInputRef} 
                      accept="image/*"
                      onChange={handleThumbChange}
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      className="gap-2 border-primary/20 hover:border-primary/50"
                      onClick={() => thumbInputRef.current?.click()}
                    >
                      {thumbFile ? <CheckCircle2 className="h-4 w-4 text-secondary" /> : <Camera className="h-4 w-4" />}
                      {thumbFile ? "Thumbnail Added" : "Upload Thumbnail"}
                    </Button>
                  </div>
                </div>
                {thumbFile && (
                  <div className="flex items-center gap-2 p-2 bg-secondary/10 rounded-lg border border-secondary/20">
                    <ImageIcon className="h-3 w-3 text-secondary" />
                    <span className="text-[10px] font-bold text-secondary truncate max-w-[200px]">{thumbFile.name}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto" onClick={() => { setThumbFile(null); setCustomThumbUrl(''); }}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-lg shadow-primary/20" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Commit & Save to Repository
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}