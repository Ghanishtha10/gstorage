import Link from 'next/link';
import { Database, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute top-8 left-8">
        <Button asChild variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Back to Gallery
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-md bg-card border-border/40 shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
            <Database className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-foreground">Admin Login</CardTitle>
          <CardDescription>
            Access the G storage management tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="admin" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="bg-background" />
          </div>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11">
            <Link href="/admin">Sign In</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-xs text-center text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/40 w-full">
            <p className="font-bold mb-1">Demo Credentials:</p>
            <p>Username: <span className="text-foreground font-mono">admin</span></p>
            <p>Password: <span className="text-foreground font-mono">admin123</span></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
