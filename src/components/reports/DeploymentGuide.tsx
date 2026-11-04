import React, { useState } from 'react';
import {
  Server,
  Cloud,
  Database,
  Radio,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export function DeploymentGuide() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-2">
          <Cloud className="w-4 h-4" />
          Enterprise Deployment Blueprint
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          ACLC LabPulse Production Rollout Guide: Vercel + Supabase / Neon
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Follow these structured engineering steps to transition ACLC LabPulse from development to full campus production on ACLC College of Manila infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Database Setup */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
              STEP 1
            </span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="font-bold text-white text-base">PostgreSQL (Supabase / Neon)</h3>
          <p className="text-xs text-slate-400">
            Create a serverless PostgreSQL instance and execute Prisma database schema migrations.
          </p>

          <div className="space-y-2 pt-1">
            <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-cyan-300 space-y-1">
              <div className="text-slate-500"># 1. Push Prisma schema to Postgres</div>
              <div>npx prisma db push</div>
              <div className="text-slate-500 pt-1"># 2. Seed institutional laboratory fixtures</div>
              <div>npx tsx prisma/seed.ts</div>
            </div>
          </div>
        </div>

        {/* Step 2: Vercel Deployment */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
              STEP 2
            </span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="font-bold text-white text-base">Vercel Production Deployment</h3>
          <p className="text-xs text-slate-400">
            Import the GitHub repository into Vercel and configure production environment variables.
          </p>

          <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-amber-200/90 space-y-1">
            <div>NEXTAUTH_URL="https://labpulse.aclc-manila.edu.ph"</div>
            <div>NEXTAUTH_SECRET="[32_BYTE_HEX_RANDOM_KEY]"</div>
            <div>DATABASE_URL="postgresql://postgres:...@neon.tech/..."</div>
            <div>DISCOVERY_AGENT_API_SECRET="aclc-sec-audit-token-9b37a1e0c4"</div>
          </div>
        </div>

        {/* Step 3: Webhook Integrations */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
              STEP 3
            </span>
            <Radio className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="font-bold text-white text-base">Discord & Telegram Sentinel Setup</h3>
          <p className="text-xs text-slate-400">
            Configure real-time mobile push notifications for critical laboratory emergencies and low-stock alerts.
          </p>

          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><b>Discord:</b> Channel Settings &rarr; Integrations &rarr; Create Webhook &rarr; Set in <code className="text-cyan-400">DISCORD_MAINTENANCE_WEBHOOK_URL</code></li>
            <li><b>Telegram:</b> Message <code className="text-cyan-400">@BotFather</code> &rarr; /newbot &rarr; Set token in <code className="text-cyan-400">TELEGRAM_BOT_TOKEN</code></li>
          </ul>
        </div>

        {/* Step 4: PowerShell Agent GPO Rollout */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
              STEP 4
            </span>
            <Terminal className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="font-bold text-white text-base">Workstation Audit Agent Deployment</h3>
          <p className="text-xs text-slate-400">
            Register <code className="text-cyan-400">audit-agent.ps1</code> in Windows Task Scheduler across Lab 1, Lab 2, and Lab 3.
          </p>

          <div className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto">
            <div># Run in Admin PowerShell on each client:</div>
            <div className="text-white mt-1">
              schtasks /create /tn "ACLC-LabPulse-Audit" /tr "powershell.exe -ExecutionPolicy Bypass -File C:\ACLC\audit-agent.ps1" /sc onstart /ru "SYSTEM"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
