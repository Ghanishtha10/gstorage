"use client";

import { useState } from 'react';
import { suggestContentTags } from '@/ai/flows/suggest-content-tags-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Loader2, Sparkles, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setTags([]);
    }
  };

  const analyzeContent = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      // Simulate reading file as data URI
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUri = reader.result as string;
        const result = await suggestContentTags({
          content: dataUri,
          mimeType: file.type,
          fileName: file.name,
        });
        setTags(result.tags);
        toast({
          title: "AI Analysis Complete",
          description: `Suggested ${result.tags.length} tags for your file.`,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze file content.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      setTags([]);
      toast({
        title: "File Uploaded Successfully",
        description: "Your content is now live in the public gallery.",
      });
    }, 1500);
  };

  return (
    <Card className="bg-card border-border/40 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-6">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" /> New Content Upload
        </CardTitle>
        <CardDescription>Upload a file and use AI to automatically generate search tags.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {!file ? (
          <div className="border-2 border-dashed border-border/60 rounded-2xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h4 className="font-semibold text-lg">Choose a file or drag and drop</h4>
              <p className="text-sm text-muted-foreground">JPG, PNG, PDF, or MP4 (Max 20MB)</p>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border/60">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {file.type.startsWith('image/') ? <ImageIcon className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Content Tags</Label>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 gap-2 text-xs border-primary/40 text-primary hover:bg-primary/5"
                  onClick={analyzeContent}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  Generate with AI
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-lg bg-background/50 border border-border/40">
                {tags.length > 0 ? (
                  tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1 bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
                      {tag}
                      <Button variant="ghost" size="icon" className="h-3 w-3 p-0 hover:bg-transparent" onClick={() => setTags(t => t.filter((_, idx) => idx !== i))}>
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No tags assigned. Click AI Generate to start.</span>
                )}
              </div>
            </div>

            <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-12" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Upload to Locker
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}