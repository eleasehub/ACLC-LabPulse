import React from 'react';
import {
  Monitor,
  Activity,
  AlertTriangle,
  Boxes,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-sans">
      {/* Metric 1: Total IT Assets */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Total Workstations</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <Monitor className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-white">125 Units</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Across 3 Labs + MIS Server Room</span>
          </div>
        </div>
      </div>

      {/* Metric 2: Operational Health Rate */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Operational Health</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-emerald-400">94.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            118 Operational &bull; 7 Offline/Service
          </div>
        </div>
      </div>

      {/* Metric 3: Active Incident Tickets */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Open Tickets</span>
          <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800/50 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-white">3 Incidents</div>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-red-900/60 text-red-300 font-bold">1 CRITICAL</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300">2 MEDIUM</span>
          </div>
        </div>
      </div>

      {/* Metric 4: Inventory & Low-Stock Alerts */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Consumables Reorder</span>
          <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800/50 flex items-center justify-center text-amber-400">
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-amber-400">2 Low Stock</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cat6 UTP Rolls (2 left) &bull; RJ45 (3 boxes)
          </div>
        </div>
      </div>

      {/* Metric 5: Active Borrowing Requests */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Equipment Out</span>
          <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/50 flex items-center justify-center text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-white">4 Slips Active</div>
          <div className="text-[11px] text-slate-400 mt-1">
            3 Faculty Loans &bull; <span className="text-amber-400 font-medium">1 Due in 30m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
