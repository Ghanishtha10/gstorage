"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, Upload, LogOut, Database, Home, Edit3 } from "lucide-react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: 'Admin Home', icon: LayoutDashboard, href: '/admin' },
  { label: 'Upload', icon: Upload, href: '/admin/upload' },
  { label: 'Edit Files', icon: Edit3, href: '/admin' },
  { label: 'Public Site', icon: Home, href: '/' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Access administrative tools and settings.</SheetDescription>
        </SheetHeader>
        
        <div className="p-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Database className="h-5 w-5" />
            </div>
            <span className="font-headline font-bold text-lg tracking-tight">G <span className="text-primary">storage</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
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

        <div className="p-4 border-t border-border/40">
          <Button asChild variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Link href="/">
              <LogOut className="h-4 w-4" /> Logout
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
