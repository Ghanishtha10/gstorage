"use client";

import { ShieldCheck, Lock, Eye, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SecurityPage() {
  const securityStats = [
    { label: 'Access Logs', value: '24 Active', icon: Eye, color: 'text-blue-500' },
    { label: 'Encryption', value: 'AES-256', icon: Lock, color: 'text-green-500' },
    { label: 'Admin Keys', value: '1 Active', icon: Key, color: 'text-amber-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Vault Shield Active</span>
        </div>
        <h1 className="text-3xl font-headline font-bold">Security & Access</h1>
        <p className="text-muted-foreground">Monitor the integrity and access protocols of the digital repository.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {securityStats.map((stat, i) => (
          <Card key={i} className="bg-card border-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg">Access Control Protocols</CardTitle>
          <CardDescription>System-wide security settings and monitoring.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-bold uppercase tracking-tight">Real-time Intrusion Detection</h3>
            </div>
            <p className="text-xs text-muted-foreground">All connection attempts are logged and scrutinized against the global blacklist.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-tight">Public Profile Isolation</h3>
            </div>
            <p className="text-xs text-muted-foreground">User configurations are segregated and accessible only via direct path-based ownership.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
