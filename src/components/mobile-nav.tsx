
"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, Upload, LogOut, Database, Home, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { label: 'Admin Home', icon: LayoutDashboard, href: '/admin' },
  { label: 'Upload', icon: Upload, href: '/admin/upload' },
  { label: 'Profile Settings', icon: UserCircle, href: '/admin/profile' },
  { label: 'Files Gallery', icon: Home, href: '/' },
];

export function MobileNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <Sheet>
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
        
        <div className="p-6 border-b border-border/40 bg-muted/20">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Database className="h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tight">G <span className="text-primary">storage</span></span>
          </Link>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border/40">
             <Avatar className="h-10 w-10 border-2 border-primary/20">
               <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'admin'}/100/100`} />
               <AvatarFallback>AD</AvatarFallback>
             </Avatar>
             <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-bold truncate">{user?.displayName || 'Admin User'}</span>
               <span className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">Administrator</span>
             </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href}
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

        <div className="p-4 border-t border-border/40 bg-muted/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive h-12 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Logout Account
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
