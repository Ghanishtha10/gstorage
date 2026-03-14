
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database, ArrowLeft, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      // Map simple username to a consistent internal email format for Firebase Auth
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-primary/30">
      <div className="absolute top-8 left-8">
        <Button asChild variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Back to Files
          </Link>
        </Button>
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20 mb-2 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Database className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">G <span className="text-primary">storage</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] font-medium">Administrator Portal</p>
        </div>

        <Card className="bg-card border-border/40 shadow-xl overflow-hidden">
          <CardHeader className="space-y-1 bg-muted/20 pb-8 pt-8">
            <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Secure access for authorized personnel only.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="admin" 
                    className="bg-background pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                    <Database className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-background pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-lg shadow-primary/20 mt-4" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isLoading ? "Authenticating..." : "Enter Vault"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col gap-4 bg-muted/10 border-t border-border/10 p-6">
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest justify-center">
                <div className="h-px bg-border flex-1" />
                System Credentials
                <div className="h-px bg-border flex-1" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background/50 border border-border/40 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">User</p>
                  <p className="font-mono text-xs font-bold">admin</p>
                </div>
                <div className="bg-background/50 border border-border/40 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Pass</p>
                  <p className="font-mono text-xs font-bold">admin123</p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
          Encrypted Session Protection Active
        </p>
      </div>
    </div>
  );
}
