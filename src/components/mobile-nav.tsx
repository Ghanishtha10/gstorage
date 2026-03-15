"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, Upload, LogOut, Database, Home, UserCircle, ShieldCheck } from "lucide-react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, useUser, useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doc } from "firebase/firestore";

const navItems = [
  { label: 'Admin Home', icon: LayoutDashboard, href: '/admin' },
  { label: 'Upload', icon: Upload, href: '/admin/upload' },
  { label: 'Profile Settings', icon: UserCircle, href: '/admin/profile' },
  { label: 'Security', icon: ShieldCheck, href: '/admin/security' },
  { label: 'Files Gallery', icon: Home, href: '/' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_profiles', 'admin');
  }, [db]);

  const { data: profile } = useDoc(profileRef);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    router.push('/');
  };

  const displayName = profile?.displayName || user?.displayName || 'Admin';
  const bio = profile?.bio || 'System Administrator';
  const photoURL = profile?.photoURL || user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'admin'}/100/100`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 border border-border/40">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 flex flex-col bg-card border-r border-border/40">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Access administrative tools and settings.</SheetDescription>
        </SheetHeader>
        
        <div className="p-6 border-b border-border/40 bg-muted/20 shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <Database className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold text-lg tracking-tight">G <span className="text-primary">storage</span></span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border/40">
             <div className="relative shrink-0">
               <Avatar className="h-10 w-10 border-2 border-primary/20">
                 <AvatarImage src={photoURL} />
                 <AvatarFallback>AD</AvatarFallback>
               </Avatar>
               <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
             </div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-bold truncate">{displayName}</span>
               <span className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-bold">{bio}</span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border/40 bg-muted/10 shrink-0">
          <Button 
            variant="destructive" 
            className="w-full justify-start gap-3 h-12 rounded-xl font-bold shadow-lg shadow-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Logout Account
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
