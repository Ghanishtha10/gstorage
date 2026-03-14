import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1F2D30]">
      <div className="absolute top-8 left-8">
        <Button asChild variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-md bg-card border-border/40 shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold">Admin Portal</CardTitle>
          <CardDescription>
            Enter your credentials to manage content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@contentlocker.com" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="bg-background" />
          </div>
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold h-11">
            Sign In
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-xs text-center text-muted-foreground">
            Protected by multi-factor authentication.
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary leading-relaxed">
            <strong>Demo Mode:</strong> Any credentials will grant access for this simulation.
            <Button variant="link" asChild className="p-0 h-auto text-xs ml-1 font-bold">
               <Link href="/admin">Skip to Dashboard</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}