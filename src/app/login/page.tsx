
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database, ArrowLeft, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    try {
      // Map username to a fake email for Firebase Auth
      const email = username.includes('@') ? username : `${username}@gstorage.com`;
      
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account Created",
          description: "Admin account has been provisioned. Redirecting...",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully authenticated as administrator.",
        });
      }
      router.push('/admin');
    } catch (error: any) {
      console.error(error);
      const message = error.code === 'auth/user-not-found' 
        ? "Account not found. Use 'Create Admin' for first-time setup." 
        : "Invalid username or password.";
      
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute top-8 left-8">
        <Button asChild variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Back to Files
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-md bg-card border-border/40 shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
            <Database className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-foreground">
            {isRegistering ? "Register Admin" : "Admin Login"}
          </CardTitle>
          <CardDescription>
            {isRegistering 
              ? "Create your master administrator account." 
              : "Access the G storage management tools."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isRegistering && (
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs text-muted-foreground">
                  First time? Click <strong>Create Admin Account</strong> below to set up your login.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="admin" 
                className="bg-background"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isLoading ? (isRegistering ? "Creating..." : "Signing in...") : (isRegistering ? "Create Admin Account" : "Sign In")}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            className="text-xs text-muted-foreground underline decoration-primary/20 hover:text-primary"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Already have an account? Sign In" : "Need to setup admin? Create Account"}
          </Button>

          <div className="text-[10px] text-center text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/40 w-full">
            <p className="font-bold mb-1 uppercase tracking-widest">Demo Credentials</p>
            <p>Username: <span className="text-foreground font-mono">admin</span></p>
            <p>Password: <span className="text-foreground font-mono">admin123</span></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
