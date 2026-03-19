"use client";

import Link from 'next/link';
import { LayoutDashboard, Upload, LogOut, Database, UserCircle, Home, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth, useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

const navItems = [
  { label: 'Admin Home', icon: LayoutDashboard, href: '/admin' },
  { label: 'Upload', icon: Upload, href: '/admin/upload' },
  { label: 'Profile Settings', icon: UserCircle, href: '/admin/profile' },
  { label: 'Security', icon: ShieldCheck, href: '/admin/security' },
  { label: 'Files Gallery', icon: Home, href: '/' },
];

export function AdminSidebar() {
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
    router.push('/');
  };

  const displayName = profile?.displayName || user?.displayName || 'Admin';
  const bio = profile?.bio || 'System Administrator';
  const photoURL = profile?.photoURL || user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'admin'}/100/100`;

  return (
    <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-border/40 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <Database className="h-5 w-5 text-primary" />
          <span className="font-headline font-bold text-lg tracking-tight uppercase">G <span className="text-primary">storage</span></span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4">Operations</p>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "" : "text-muted-foreground group-hover:text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/40 bg-muted/5 shrink-0">
        <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-background rounded-xl border border-border/10">
           <div className="relative shrink-0">
             <Avatar className="h-9 w-9 border border-primary/20">
               <AvatarImage src={photoURL} />
               <AvatarFallback>AD</AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 border-2 border-background rounded-full shadow-sm" />
           </div>
           <div className="flex flex-col overflow-hidden">
             <span className="text-xs font-bold truncate">{displayName}</span>
             <span className="text-[9px] text-muted-foreground truncate uppercase tracking-widest font-bold">{bio}</span>
           </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive h-11 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Initialize Logout
        </Button>
      </div>
    </aside>
  );
}