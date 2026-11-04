import React, { useState } from 'react';
import { WorkstationNode, WorkstationData } from './WorkstationNode';
import { SeatDetailModal } from './SeatDetailModal';
import {
  Monitor,
  Server,
  Network,
  Router,
  Zap,
  Presentation,
  DoorOpen,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Layers,
  Edit3,
  Save,
  Sliders,
  CheckCircle2,
  X,
  PlusCircle,
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export interface LabFacilityConfig {
  code: string;
  name: string;
  roomNumber: string;
  rows: number;
  cols: number;
  specialty: string;
  subnet: string;
  gateway: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  frontBannerText?: string;
  entranceDoorLabel?: string;
}

const DEFAULT_LAB_CONFIGS: LabFacilityConfig[] = [
  {
    code: 'LAB-1',
    name: 'Lab 1 - Multimedia & Game Development',
    roomNumber: 'Room 201',
    rows: 5,
    cols: 8,
    specialty: 'Dedicated NVIDIA GPUs, Cisco Rack & Dell Host Server',
    subnet: '192.168.10.0/24',
    gateway: '192.168.10.1',
    status: 'ACTIVE',
    frontBannerText: 'FRONT OF ROOM • 120" PROJECTION SCREEN • WHITEBOARD',
    entranceDoorLabel: 'Computer Laboratory 2nd Floor',
  },
  {
    code: 'LAB-2',
    name: 'Lab 2 - Software Engineering & Databases',
    roomNumber: 'Room 302',
    rows: 5,
    cols: 8,
    specialty: 'Dual Boot Linux/Windows & Enterprise Database Server',
    subnet: '192.168.20.0/24',
    gateway: '192.168.20.1',
    status: 'ACTIVE',
    frontBannerText: 'FRONT OF ROOM • 120" PROJECTION SCREEN • WHITEBOARD',
    entranceDoorLabel: 'Computer Laboratory 2nd Floor',
  },
  {
    code: 'LAB-3',
    name: 'Lab 3 - Cisco Networking & SysAdmin',
    roomNumber: 'Room 304',
    rows: 5,
    cols: 7,
    specialty: 'Integrated Cisco 2960 Switches, Dual NICs & Edge Router',
    subnet: '192.168.30.0/24',
    gateway: '192.168.30.1',
    status: 'ACTIVE',
    frontBannerText: 'FRONT OF ROOM • CISCO RACK LAB • WHITEBOARD',
    entranceDoorLabel: 'Computer Laboratory 2nd Floor',
  },
];

interface LabFloorGridProps {
  onFileTicketForNode: (ws: WorkstationData) => void;
}

export function LabFloorGrid({ onFileTicketForNode }: LabFloorGridProps) {
  const {
    labWorkstationsMap,
    rackEquipmentMap,
    updateWorkstation,
    updateRackEquipment,
  } = useInventory();

  const [labConfigs, setLabConfigs] = useState<LabFacilityConfig[]>(DEFAULT_LAB_CONFIGS);
  const [selectedLabCode, setSelectedLabCode] = useState<string>('LAB-1');
  const [selectedWorkstation, setSelectedWorkstation] = useState<WorkstationData | null>(null);

  // Lab Edit Modal State
  const [isEditingLab, setIsEditingLab] = useState(false);
  const [labForm, setLabForm] = useState<LabFacilityConfig>(DEFAULT_LAB_CONFIGS[0]);
  const [labSaveFeedback, setLabSaveFeedback] = useState(false);

  const activeLab = labConfigs.find((l) => l.code === selectedLabCode) || labConfigs[0];
  const currentWorkstations = labWorkstationsMap[activeLab.code] || [];
  const currentRackEquipment = rackEquipmentMap[activeLab.code] || [];

  // Open Edit Facility Modal
  const handleOpenEditLab = () => {
    setLabForm({ ...activeLab });
    setIsEditingLab(true);
    setLabSaveFeedback(false);
  };

  // Save Lab Facility Settings
  const handleSaveLabSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setLabConfigs((prev) =>
      prev.map((l) => (l.code === labForm.code ? { ...labForm } : l))
    );

    setLabSaveFeedback(true);
    setTimeout(() => {
      setLabSaveFeedback(false);
      setIsEditingLab(false);
    }, 1200);
  };

  // Update Individual Workstation Node or Rack Node in synchronized state
  const handleUpdateNode = (updatedWs: WorkstationData) => {
    if (
      updatedWs.category === 'SERVER' ||
      updatedWs.category === 'NETWORKING_SWITCH' ||
      updatedWs.category === 'ROUTER' ||
      updatedWs.category === 'UPS'
    ) {
      updateRackEquipment(activeLab.code, updatedWs);
    } else {
      updateWorkstation(activeLab.code, updatedWs);
    }
    setSelectedWorkstation(updatedWs);
  };


  // Total Statistics calculation including Rack Equipment
  const allNodes = [...currentWorkstations, ...currentRackEquipment];
  const operationalCount = allNodes.filter((w) => w.status === 'OPERATIONAL').length;
  const degradedCount = allNodes.filter((w) => w.status === 'DEGRADED').length;
  const maintenanceCount = allNodes.filter((w) => w.status === 'UNDER_MAINTENANCE').length;
  const borrowedCount = allNodes.filter((w) => w.status === 'BORROWED').length;
  const totalOccupied = allNodes.filter((w) => w.status !== 'VACANT_SLOT').length;
  const healthPercent = Math.round((operationalCount / (totalOccupied || 1)) * 100);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Laboratory Bar */}
      <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800/60">
              {activeLab.roomNumber}
            </span>
            <h3 className="font-bold text-white text-lg">{activeLab.name}</h3>
            {activeLab.status === 'MAINTENANCE' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">
                Facility Maintenance
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Room Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Room Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {labConfigs.map((lab) => (
              <button
                key={lab.code}
                onClick={() => {
                  setSelectedLabCode(lab.code);
                  setSelectedWorkstation(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedLabCode === lab.code
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lab.code} ({lab.roomNumber})
              </button>
            ))}
          </div>

          {/* Edit Facility Button */}
          <button
            onClick={handleOpenEditLab}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Edit {activeLab.code} Facility
          </button>
        </div>
      </div>

      {/* Legend & Health Statistics */}
      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">Operational ({operationalCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-slate-300">Degraded ({degradedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-300 font-semibold">Under Maintenance ({maintenanceCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-400"></span>
            <span className="text-slate-300">Borrowed ({borrowedCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400">Availability:</span>
          <span className={`font-bold ${healthPercent >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {healthPercent}% ({operationalCount}/{totalOccupied} nodes)
          </span>
          <span className="text-[10px] text-cyan-400 border-l border-slate-700 pl-2">
            ⚡ Synchronized with Master Inventory
          </span>
        </div>
      </div>

      {/* Interactive Room Visualizer Floor Map */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-6">
        {/* Front of Classroom: Projector Screen & Whiteboard */}
        <div className="relative border-b-2 border-slate-700 pb-4 flex items-center justify-center">
          <div className="classroom-front-banner flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-widest border border-slate-700 shadow-md">
            <Presentation className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{activeLab.frontBannerText || 'FRONT OF ROOM • 120" PROJECTION SCREEN • WHITEBOARD'}</span>
          </div>
        </div>

        {/* Seating Grid */}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${activeLab.cols}, minmax(0, 1fr))`,
          }}
        >
          {currentWorkstations.map((ws) => (
            <WorkstationNode
              key={ws.id}
              workstation={ws}
              isSelected={selectedWorkstation?.id === ws.id}
              onSelect={(node) => setSelectedWorkstation(node)}
            />
          ))}
        </div>

        {/* Back of Classroom Floor Area: Entrance on Left & Server/Network Rack on Right */}
        <div className="pt-4 border-t border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-xs">
          {/* Left-Bottom: Entrance Door */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-sm w-fit">
              <DoorOpen className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-200">
                {activeLab.entranceDoorLabel || 'Computer Laboratory 2nd Floor'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-1">
              Main Laboratory Hallway Access &bull; Fire Exit Path
            </span>
          </div>

          {/* Right-Bottom: 19-inch Telecom & Server Rack Enclosure */}
          <div className="bg-slate-950/90 p-3.5 rounded-2xl border-2 border-slate-700/80 shadow-xl flex flex-col gap-2.5 max-w-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <Server className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {activeLab.code} Core Server & Network Rack
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                RACK ENCLOSURE (RIGHT BOTTOM)
              </span>
            </div>

            {/* 4 Interactive Rack Nodes: Server, Switch, Router, UPS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {currentRackEquipment.map((eq) => (
                <WorkstationNode
                  key={eq.id}
                  workstation={eq}
                  isSelected={selectedWorkstation?.id === eq.id}
                  onSelect={(node) => setSelectedWorkstation(node)}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-1.5 px-0.5">
              <span className="text-cyan-400">⚡ Cisco Gigabit Backbone + 1U Dell Host</span>
              <span>Click any rack unit to edit & sync with Inventory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workstation / Equipment Inspection & Edit Modal */}
      <SeatDetailModal
        workstation={selectedWorkstation}
        onClose={() => setSelectedWorkstation(null)}
        onFileTicket={(ws) => onFileTicketForNode(ws)}
        onUpdateWorkstation={handleUpdateNode}
      />

      {/* Edit Laboratory Facility Settings Modal */}
      {isEditingLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-white text-base">Edit {labForm.code} Facility Settings</h4>
              </div>
              <button
                onClick={() => setIsEditingLab(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLabSettings} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Laboratory Facility Name</label>
                <input
                  type="text"
                  required
                  value={labForm.name}
                  onChange={(e) => setLabForm({ ...labForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Room Code & Number</label>
                  <input
                    type="text"
                    required
                    value={labForm.roomNumber}
                    onChange={(e) => setLabForm({ ...labForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Facility Status</label>
                  <select
                    value={labForm.status}
                    onChange={(e) => setLabForm({ ...labForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ACTIVE">ACTIVE (In Service)</option>
                    <option value="MAINTENANCE">MAINTENANCE (Offline for Repairs)</option>
                    <option value="OFFLINE">OFFLINE (Restricted)</option>
                  </select>
                </div>
              </div>

              {/* Grid Dimensions */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-bold text-slate-300 block">Seating Grid Floor Dimensions</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Grid Rows (Depth)</label>
                    <input
                      type="number"
                      min={2}
                      max={8}
                      value={labForm.rows}
                      onChange={(e) => setLabForm({ ...labForm, rows: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Grid Columns (Width)</label>
                    <input
                      type="number"
                      min={3}
                      max={10}
                      value={labForm.cols}
                      onChange={(e) => setLabForm({ ...labForm, cols: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Capacity: {labForm.rows * labForm.cols} total seating cells
                </span>
              </div>

              {/* Network Configuration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">IPv4 Subnet CIDR</label>
                  <input
                    type="text"
                    required
                    value={labForm.subnet}
                    onChange={(e) => setLabForm({ ...labForm, subnet: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Default Gateway</label>
                  <input
                    type="text"
                    required
                    value={labForm.gateway}
                    onChange={(e) => setLabForm({ ...labForm, gateway: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Room Signage & Labels */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Entrance Door Signage Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Laboratory 2nd Floor"
                    value={labForm.entranceDoorLabel || ''}
                    onChange={(e) => setLabForm({ ...labForm, entranceDoorLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Front Screen & Board Label</label>
                  <input
                    type="text"
                    placeholder="e.g. FRONT OF ROOM - 120 INCH PROJECTION SCREEN - WHITEBOARD"
                    value={labForm.frontBannerText || ''}
                    onChange={(e) => setLabForm({ ...labForm, frontBannerText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Hardware Specialty & Instructional Notes</label>
                <textarea
                  rows={2}
                  value={labForm.specialty}
                  onChange={(e) => setLabForm({ ...labForm, specialty: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {labSaveFeedback && (
                <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Laboratory facility configuration saved successfully!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingLab(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Lab Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
