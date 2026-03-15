"use client";

import Link from 'next/link';
import { LayoutDashboard, Upload, LogOut, Database, UserCircle, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { label: 'Admin Home', icon: LayoutDashboard, href: '/admin' },
  { label: 'Upload', icon: Upload, href: '/admin/upload' },
  { label: 'Profile Settings', icon: UserCircle, href: '/admin/profile' },
  { label: 'Files Gallery', icon: Home, href: '/' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col">
      <div className="p-6 border-b border-border/40 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-headline font-bold text-lg tracking-tight">G <span className="text-primary">storage</span></span>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Navigation</p>
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

      <div className="p-4 mt-auto border-t border-border/40 space-y-4">
        <div className="flex items-center gap-3 px-4 py-2 bg-muted/20 rounded-xl border border-border/10">
           <Avatar className="h-9 w-9 border-2 border-primary/20">
             <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'admin'}/100/100`} />
             <AvatarFallback>AD</AvatarFallback>
           </Avatar>
           <div className="flex flex-col overflow-hidden">
             <span className="text-sm font-semibold truncate">{user?.displayName || 'Admin User'}</span>
             <span className="text-[10px] text-muted-foreground truncate">{user?.email?.split('@')[0] || 'admin'}</span>
           </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </aside>
  );
}
