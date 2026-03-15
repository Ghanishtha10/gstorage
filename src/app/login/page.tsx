"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database, ArrowLeft, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    try {
      const email = username.includes('@') ? username : `${username}@gstorage.com`;
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Access Granted",
        description: "Welcome back to the command center.",
      });
      router.push('/admin');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials. Please verify the username and password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-primary/30 overflow-hidden">
      <div className="absolute top-8 left-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <Button asChild variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-all font-bold uppercase tracking-widest text-[10px]">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Exit Vault
          </Link>
        </Button>
      </div>
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-[2.5rem] bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/30 mb-2 rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-110 cursor-pointer group">
            <Database className="h-10 w-10 group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold tracking-tight uppercase">G <span className="text-primary">storage</span></h1>
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-bold">Secure Admin Access</p>
          </div>
        </div>

        <Card className="bg-card/50 backdrop-blur border-border/40 shadow-2xl overflow-hidden rounded-[2rem] hover:shadow-primary/5 transition-all duration-500">
          <CardHeader className="space-y-2 bg-muted/20 pb-10 pt-10 text-center border-b border-border/10">
            <CardTitle className="text-xl font-bold flex items-center justify-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary" /> Identity Verification
            </CardTitle>
            <CardDescription className="font-medium">
              Authorized personnel credentials required.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-10 pb-12">
              <div className="space-y-3">
                <Label htmlFor="username" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Admin Username</Label>
                <div className="relative group">
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Enter username" 
                    className="bg-background/50 pl-11 h-12 border-border/40 focus:ring-primary/20 transition-all rounded-xl"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                    <Database className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground">Security Phrase</Label>
                <div className="relative group">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-background/50 pl-11 h-12 border-border/40 focus:ring-primary/20 transition-all rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-2xl shadow-xl shadow-primary/20 mt-4 transition-all active:scale-95 group" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />}
                {isLoading ? "Synchronizing..." : "Initialize Session"}
              </Button>
            </CardContent>
          </form>
        </Card>

        <p className="text-center text-[9px] text-muted-foreground/40 uppercase tracking-[0.5em] font-bold animate-pulse">
          AES-256 Encrypted Session
        </p>
      </div>
    </div>
  );
}
