import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  HardDrive,
  Activity,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Calendar,
  ExternalLink,
  Edit3,
  Save,
  RotateCcw,
  Server,
  Network,
  Router,
  Zap,
  Monitor,
} from 'lucide-react';
import { WorkstationData } from './WorkstationNode';

interface SeatDetailModalProps {
  workstation: WorkstationData | null;
  onClose: () => void;
  onFileTicket: (ws: WorkstationData) => void;
  onUpdateWorkstation?: (updatedWs: WorkstationData) => void;
}

export function SeatDetailModal({
  workstation,
  onClose,
  onFileTicket,
  onUpdateWorkstation,
}: SeatDetailModalProps) {
  if (!workstation) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<WorkstationData>(workstation);
  const [saveFeedback, setSaveFeedback] = useState(false);

  useEffect(() => {
    if (workstation) {
      setFormData(workstation);
      setIsEditing(false);
      setSaveFeedback(false);
    }
  }, [workstation]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateWorkstation) {
      onUpdateWorkstation(formData);
    }
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      setIsEditing(false);
    }, 1200);
  };

  const isRackItem =
    formData.category === 'SERVER' ||
    formData.category === 'NETWORKING_SWITCH' ||
    formData.category === 'ROUTER' ||
    formData.category === 'UPS';

  const renderCategoryIcon = () => {
    switch (formData.category) {
      case 'SERVER':
        return <Server className="w-5 h-5 text-purple-400" />;
      case 'NETWORKING_SWITCH':
        return <Network className="w-5 h-5 text-emerald-400" />;
      case 'ROUTER':
        return <Router className="w-5 h-5 text-sky-400" />;
      case 'UPS':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'WORKSTATION':
      default:
        return <Monitor className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800/60 flex items-center gap-1.5">
                {renderCategoryIcon()}
                {formData.seatNumber}
              </span>
              <h3 className="font-bold text-white text-lg">{formData.hostname || 'Unassigned Equipment'}</h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Asset Tag: <span className="text-cyan-300 font-semibold">{formData.assetTag || 'N/A'}</span>
              {formData.brandModel && <span className="text-slate-400"> &bull; {formData.brandModel}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isEditing
                  ? 'bg-amber-950 text-amber-300 border-amber-600'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'View Mode' : 'Edit Properties'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Edit Form Mode */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="p-3 bg-cyan-950/30 border border-cyan-800/50 rounded-xl text-cyan-300 text-[11px]">
              Editing properties for <b>{formData.hostname || formData.seatNumber}</b>. Changes immediately sync with the <b>Asset Directory</b> and Floor Grid.
            </div>

            {/* Status & Condition Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Operational Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="OPERATIONAL">🟢 OPERATIONAL</option>
                  <option value="DEGRADED">🟡 DEGRADED</option>
                  <option value="UNDER_MAINTENANCE">🔴 UNDER_MAINTENANCE</option>
                  <option value="BORROWED">🔵 BORROWED</option>
                  <option value="VACANT_SLOT">⚪ VACANT_SLOT</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Physical Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="EXCELLENT">EXCELLENT</option>
                  <option value="GOOD">GOOD</option>
                  <option value="FAIR">FAIR</option>
                  <option value="POOR">POOR</option>
                  <option value="DAMAGED">DAMAGED</option>
                </select>
              </div>
            </div>

            {/* Tags & Identity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Asset Tag</label>
                <input
                  type="text"
                  value={formData.assetTag}
                  onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Host / Equipment Name</label>
                <input
                  type="text"
                  value={formData.hostname}
                  onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Network Configuration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Management IP Address</label>
                <input
                  type="text"
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">MAC Address</label>
                <input
                  type="text"
                  value={formData.macAddress}
                  onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="font-bold text-slate-300 block">
                {isRackItem ? 'Rack & Equipment Specifications' : 'Hardware Specifications'}
              </span>

              <div>
                <label className="text-slate-400 block mb-1">
                  {isRackItem ? 'Port Density / Firmware / Fabric Specs' : 'Processor (CPU) & Architecture'}
                </label>
                <input
                  type="text"
                  value={formData.cpu}
                  onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {!isRackItem && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">RAM Capacity (GB)</label>
                    <input
                      type="number"
                      min={2}
                      max={128}
                      value={formData.ramGb}
                      onChange={(e) => setFormData({ ...formData, ramGb: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Primary Storage</label>
                    <input
                      type="text"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {saveFeedback && (
              <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Equipment properties updated and synchronized with Master Inventory!
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save & Synchronize
              </button>
            </div>
          </form>
        ) : (
          /* Inspection View Mode */
          <div className="space-y-4 text-xs">
            {/* Status & Condition Banner */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Operational Status</span>
                <span
                  className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                    formData.status === 'OPERATIONAL'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      : formData.status === 'UNDER_MAINTENANCE'
                      ? 'bg-red-950 text-red-300 border border-red-700/50 animate-pulse'
                      : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                  }`}
                >
                  {formData.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Hardware Condition</span>
                <span className="font-semibold text-slate-200">{formData.condition}</span>
              </div>
            </div>

            {/* Network Identity */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Network & Host Telemetry</div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">IP Address:</span>
                <span className="font-semibold text-cyan-300">{formData.ipAddress || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">MAC Address:</span>
                <span className="font-semibold text-slate-300">{formData.macAddress || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Telemetry Source:</span>
                <span className="text-slate-400">{formData.lastAuditedDate || 'Audited by SNMP/Agent'}</span>
              </div>
            </div>

            {/* Hardware / Telecommunications Specifications */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                {isRackItem ? 'Technical Specifications (Ports & Firmware)' : 'Hardware Profile'}
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed">
                {formData.cpu}
                {formData.brandModel && (
                  <div className="text-slate-400 text-[11px] mt-1 font-sans">
                    Model: <span className="text-cyan-300">{formData.brandModel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Callout */}
            {formData.activeTicketId && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-between text-xs text-red-300">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Active Incident: <b>{formData.activeTicketId}</b></span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/80 font-bold">CRITICAL</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onFileTicket(formData);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                File Incident Ticket
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Equipment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
