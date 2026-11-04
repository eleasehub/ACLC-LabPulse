import React from 'react';
import {
  Monitor,
  AlertCircle,
  Wrench,
  ShieldCheck,
  Server,
  Network,
  Router,
  Zap,
  Projector,
  Radio,
} from 'lucide-react';

export interface WorkstationData {
  id: string;
  assetTag: string;
  hostname: string;
  row: number;
  col: number;
  seatNumber: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'UNDER_MAINTENANCE' | 'BORROWED' | 'VACANT_SLOT';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  ipAddress: string;
  macAddress: string;
  cpu: string;
  ramGb: number;
  storage: string;
  gpu?: string;
  activeTicketId?: string;
  lastAuditedDate: string;
  category?: 'WORKSTATION' | 'SERVER' | 'NETWORKING_SWITCH' | 'ROUTER' | 'UPS' | 'PROJECTOR' | string;
  brandModel?: string;
  portCount?: string;
  firmwareVersion?: string;
  rackUnits?: string;
}

interface WorkstationNodeProps {
  workstation: WorkstationData;
  isSelected: boolean;
  onSelect: (ws: WorkstationData) => void;
}

export function WorkstationNode({ workstation, isSelected, onSelect }: WorkstationNodeProps) {
  const getStatusStyles = () => {
    switch (workstation.status) {
      case 'OPERATIONAL':
        return {
          bg: 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-600/50 text-emerald-300',
          dot: 'bg-emerald-400',
          iconColor: 'text-emerald-400',
        };
      case 'DEGRADED':
        return {
          bg: 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-600/50 text-amber-300',
          dot: 'bg-amber-400',
          iconColor: 'text-amber-400',
        };
      case 'UNDER_MAINTENANCE':
        return {
          bg: 'bg-red-950/50 hover:bg-red-900/70 border-red-500 text-red-300 animate-pulse',
          dot: 'bg-red-400',
          iconColor: 'text-red-400',
        };
      case 'BORROWED':
        return {
          bg: 'bg-blue-950/40 hover:bg-blue-900/60 border-blue-500/50 text-blue-300',
          dot: 'bg-blue-400',
          iconColor: 'text-blue-400',
        };
      case 'VACANT_SLOT':
      default:
        return {
          bg: 'bg-slate-900/40 hover:bg-slate-800/60 border-dashed border-slate-700 text-slate-500',
          dot: 'bg-slate-600',
          iconColor: 'text-slate-600',
        };
    }
  };

  const style = getStatusStyles();

  if (workstation.status === 'VACANT_SLOT') {
    return (
      <div className="w-full aspect-square rounded-xl border border-dashed border-slate-800 bg-slate-950/30 flex flex-col items-center justify-center p-2 text-slate-500 font-mono select-none">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">AISLE</span>
        <span className="text-[9px] text-slate-600 mt-0.5">Walkway</span>
      </div>
    );
  }

  // Pick appropriate icon based on category
  const renderIcon = () => {
    switch (workstation.category) {
      case 'SERVER':
        return <Server className={`w-6 h-6 ${style.iconColor} group-hover:scale-110 transition-transform`} />;
      case 'NETWORKING_SWITCH':
        return <Network className={`w-6 h-6 ${style.iconColor} group-hover:scale-110 transition-transform`} />;
      case 'ROUTER':
        return <Router className={`w-6 h-6 ${style.iconColor} group-hover:scale-110 transition-transform`} />;
      case 'UPS':
        return <Zap className={`w-6 h-6 ${style.iconColor} group-hover:scale-110 transition-transform`} />;
      case 'PROJECTOR':
        return <Projector className={`w-6 h-6 ${style.iconColor} group-hover:scale-110 transition-transform`} />;
      case 'WORKSTATION':
      default:
        return <Monitor className={`w-6 h-6 ${style.iconColor} group-hover:scale-110 transition-transform`} />;
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(workstation)}
      className={`workstation-node group relative w-full aspect-square rounded-xl border p-2 flex flex-col justify-between text-left transition-all cursor-pointer ${
        style.bg
      } ${
        isSelected
          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-cyan-950/80 scale-105 z-10'
          : 'hover:scale-102 hover:shadow-md'
      }`}
    >
      {/* Top Header: Seat / Unit Number + Status Dot */}
      <div className="flex items-center justify-between w-full">
        <span className="ws-seat font-mono text-xs font-bold text-white group-hover:text-cyan-200 truncate">
          {workstation.seatNumber}
        </span>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
      </div>

      {/* Middle: Equipment Category Icon */}
      <div className="flex items-center justify-center py-1">
        {renderIcon()}
      </div>

      {/* Bottom: Asset Tag & Status */}
      <div className="w-full truncate text-[10px] font-mono leading-tight">
        <div className="ws-host truncate text-slate-300 font-semibold">{workstation.hostname}</div>
        <div className="ws-ip text-[9px] text-slate-400 truncate">{workstation.ipAddress || 'No IP'}</div>
      </div>
    </button>
  );
}
