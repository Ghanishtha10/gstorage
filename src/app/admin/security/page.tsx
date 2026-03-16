"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, Key, Mail, LockIcon, Palette, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { updateEmail, updatePassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useThemeAccent } from '@/components/theme-provider-wrapper';
import { cn } from '@/lib/utils';

const PRESETS = [
  { id: 'default', name: 'Sky Blue', color: 'bg-sky-400' },
  { id: 'emerald', name: 'Emerald City', color: 'bg-emerald-500' },
  { id: 'rose', name: 'Pink Rose', color: 'bg-rose-500' },
  { id: 'amber', name: 'Golden Amber', color: 'bg-amber-500' },
  { id: 'violet', name: 'Royal Violet', color: 'bg-violet-600' },
  { id: 'slate', name: 'Steel Slate', color: 'bg-slate-500' },
  { id: 'indigo', name: 'Ocean Indigo', color: 'bg-indigo-500' },
  { id: 'orange', name: 'Sun Orange', color: 'bg-orange-500' },
] as const;

export default function SecurityPage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const { accent, setAccent } = useThemeAccent();

  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingAuth, setIsUpdatingAuth] = useState(false);
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);

  useEffect(() => {
    if (user?.email) {
      // Stripping the domain for display as a "username"
      setUsername(user.email.split('@')[0]);
    }
  }, [user]);

  const handleUpdateAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setIsUpdatingAuth(true);
    try {
      // Ensure it stays within the internal domain for this prototype
      const finalEmail = username.includes('@') ? username : `${username}@gstorage.com`;
      
      if (finalEmail !== user?.email) {
        await updateEmail(auth.currentUser, finalEmail);
      }
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }
      toast({
        title: "Security Updated",
        description: "Credentials have been successfully reconfigured.",
      });
      setNewPassword('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update security credentials.",
      });
    } finally {
      setIsUpdatingAuth(false);
    }
  };

  const handleSetGlobalTheme = async (presetId: string) => {
    if (!db) return;
    setIsUpdatingTheme(true);
    try {
      await setDoc(doc(db, 'global_configs', 'settings'), {
        selectedAccentColorId: presetId,
        lastUpdatedAt: new Date().toISOString(),
      }, { merge: true });

      setAccent(presetId as any);
      toast({
        title: "Global Protocol Updated",
        description: `System-wide theme locked to ${presetId}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message || "Could not save global theme configuration.",
      });
    } finally {
      setIsUpdatingTheme(false);
    }
  };

  const securityStats = [
    { label: 'Access Logs', value: 'Active Monitoring', icon: Eye, color: 'text-blue-500' },
    { label: 'Encryption', value: 'AES-256 Enabled', icon: Lock, color: 'text-green-500' },
    { label: 'Admin Identity', value: username || 'N/A', icon: Key, color: 'text-amber-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Vault Shield Active</span>
        </div>
        <h1 className="text-3xl font-headline font-bold">Security & Access</h1>
        <p className="text-muted-foreground">Monitor and reconfigure core system access protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {securityStats.map((stat, i) => (
          <Card key={i} className="bg-card border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card border-border/40 overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" /> Access Credentials
            </CardTitle>
            <CardDescription className="text-xs">Update your administrative identity and security phrase.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdateAuth} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Admin Username</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    value={username} 
                    placeholder="Enter current or new admin username..."
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-input bg-muted/30 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">New Security Phrase</Label>
                <div className="relative group">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    placeholder="Update security phrase (leave blank to keep existing)..."
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-input bg-muted/30 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <p className="text-[9px] text-muted-foreground ml-1 italic">Existing phrase is currently active and encrypted.</p>
              </div>
              <Button type="submit" disabled={isUpdatingAuth} className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                {isUpdatingAuth ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Sync Credentials
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40 overflow-hidden">
          <CardHeader className="bg-muted/10 border-b border-border/10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" /> Global System Theme
            </CardTitle>
            <CardDescription className="text-xs">Set the default visual profile displayed to all visitors.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((preset) => {
                const isActive = accent === preset.id;
                return (
                  <button
                    key={preset.id}
                    disabled={isUpdatingTheme}
                    onClick={() => handleSetGlobalTheme(preset.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                      isActive 
                        ? "bg-primary/10 border-primary ring-1 ring-primary" 
                        : "bg-muted/20 border-border/40 hover:bg-muted/40"
                    )}
                  >
                    <div className={cn("h-4 w-4 rounded-full shadow-sm shrink-0", preset.color)} />
                    <span className={cn("text-[10px] font-bold uppercase tracking-tight truncate", isActive ? "text-primary" : "text-muted-foreground")}>
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 p-4 rounded-xl border border-border/40 bg-muted/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="text-[10px] font-bold uppercase tracking-tight">Global Sync Active</h3>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                The selected theme is stored in the public configuration vault. It will be the default experience for all users until reconfigured.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}