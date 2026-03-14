import Link from 'next/link';
import { LayoutDashboard, Upload, Settings, LogOut, FileText, Lock, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Upload Files', icon: Upload, href: '/admin/upload' },
  { label: 'File Manager', icon: FileText, href: '/admin/files' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = '/admin'; // Hardcoded for demo simplicity

  return (
    <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col">
      <div className="p-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground group-hover:rotate-6 transition-transform">
            <Lock className="h-5 w-5" />
          </div>
          <span className="font-headline font-bold text-lg tracking-tight">Content<span className="text-primary">Locker</span></span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Management</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
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
        <div className="flex items-center gap-3 px-4 py-2">
           <Avatar className="h-9 w-9 border-2 border-primary/20">
             <AvatarImage src="https://picsum.photos/seed/adminuser/100/100" />
             <AvatarFallback>AD</AvatarFallback>
           </Avatar>
           <div className="flex flex-col">
             <span className="text-sm font-semibold">Admin User</span>
             <span className="text-[10px] text-muted-foreground truncate w-24">admin@locker.com</span>
           </div>
        </div>
        <Button asChild variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive">
          <Link href="/">
            <LogOut className="h-4 w-4" /> Logout
          </Link>
        </Button>
      </div>
    </aside>
  );
}