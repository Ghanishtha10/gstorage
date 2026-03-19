"use client";

import Link from 'next/link';
import { LayoutDashboard, Upload, Database, UserCircle, Home, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { label: 'Admin Home', icon: LayoutDashboard, href: '/admin' },
  { label: 'Upload', icon: Upload, href: '/admin/upload' },
  { label: 'Profile Settings', icon: UserCircle, href: '/admin/profile' },
  { label: 'Security', icon: ShieldCheck, href: '/admin/security' },
  { label: 'Files Gallery', icon: Home, href: '/' },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
    </aside>
  );
}
