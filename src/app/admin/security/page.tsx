"use client";

import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, Key, Mail, LockIcon, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { updateEmail, updatePassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function SecurityPage() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingAuth, setIsUpdatingAuth] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setUsername(user.email.split('@')[0]);
    }
  }, [user]);

  const handleUpdateAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setIsUpdatingAuth(true);
    try {
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

  const securityStats = [
    { label: 'Access Logs', value: 'Active Monitoring', icon: Eye, color: 'text-blue-500' },
    { label: 'Encryption', value: 'AES-256 Enabled', icon: Lock, color: 'text-green-500' },
    { label: 'Admin Identity', value: username || 'N/A', icon: Key, color: 'text-amber-500' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
    </div>
  );
}
