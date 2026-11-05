import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  QrCode,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  X,
  Save,
  Cpu,
  Layers,
  Edit3,
  Server,
  Network,
  Router,
  Projector,
  Zap,
  Wifi,
  Printer,
  HardDrive,
  Trash2,
  LayoutGrid,
  List,
  Eye,
  Copy,
  Check,
  MapPin,
  Tag,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  PrinterIcon,
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export interface TableAssetItem {
  id: string;
  assetTag: string;
  name: string;
  category:
    | 'WORKSTATION'
    | 'NETWORKING_SWITCH'
    | 'ROUTER'
    | 'PROJECTOR'
    | 'UPS'
    | 'SERVER'
    | 'ACCESS_POINT'
    | 'PRINTER_SCANNER'
    | 'PERIPHERAL'
    | string;
  brandModel: string;
  labRoom: string;
  seatCoord: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'UNDER_MAINTENANCE' | 'BORROWED';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'DAMAGED';
  cpuRam: string;
  ipAddress: string;
  serialNumber: string;
  purchaseCost?: number;
}

export const INSTITUTIONAL_CATEGORIES = [
  { id: 'WORKSTATION', label: 'Workstations', fullLabel: 'Workstations (PC)', icon: Monitor, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60 category-badge-workstation' },
  { id: 'SERVER', label: 'Servers', fullLabel: 'Servers & Hosts', icon: Server, color: 'text-purple-400 bg-purple-950/60 border-purple-800/60 category-badge-server' },
  { id: 'NETWORKING_SWITCH', label: 'Switches', fullLabel: 'Network Switches', icon: Network, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60 category-badge-switch' },
  { id: 'ROUTER', label: 'Routers', fullLabel: 'Routers & Gateways', icon: Router, color: 'text-sky-400 bg-sky-950/60 border-sky-800/60 category-badge-router' },
  { id: 'ACCESS_POINT', label: 'Wireless APs', fullLabel: 'Wireless Access Points', icon: Wifi, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60 category-badge-ap' },
  { id: 'PROJECTOR', label: 'Projectors', fullLabel: 'Projectors & Displays', icon: Projector, color: 'text-amber-400 bg-amber-950/60 border-amber-800/60 category-badge-projector' },
  { id: 'UPS', label: 'UPS Backups', fullLabel: 'UPS Battery Backups', icon: Zap, color: 'text-yellow-400 bg-yellow-950/60 border-yellow-800/60 category-badge-ups' },
  { id: 'PRINTER_SCANNER', label: 'Peripherals', fullLabel: 'Printers & Peripherals', icon: Printer, color: 'text-teal-400 bg-teal-950/60 border-teal-800/60 category-badge-peripheral' },
];

export function AssetDataTable({ onSelectAsset }: { onSelectAsset?: (asset: TableAssetItem) => void }) {
  const { assets, updateAsset, addAsset, deleteAsset } = useInventory();

  // View Mode: 'table' | 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [labFilter, setLabFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [conditionFilter, setConditionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'TAG' | 'VALUATION_DESC' | 'VALUATION_ASC' | 'NAME' | 'ROOM'>('TAG');

  // Copy Feedback State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals
  const [inspectAsset, setInspectAsset] = useState<TableAssetItem | null>(null);
  const [qrModalAsset, setQrModalAsset] = useState<TableAssetItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<TableAssetItem | null>(null);
  const [editFeedback, setEditFeedback] = useState<string | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<TableAssetItem | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>('DECOMMISSIONED');
  const [deleteNotes, setDeleteNotes] = useState<string>('');
  const [deleteFeedback, setDeleteFeedback] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form State for Registration
  const [newAsset, setNewAsset] = useState({
    assetTag: 'ACLC-MNL-LAB1-WS09',
    name: 'Student Workstation 09',
    category: 'WORKSTATION',
    brand: 'Dell',
    model: 'OptiPlex 7090 Tower',
    serialNumber: '8J92KL9',
    labRoom: 'Lab 1 (Rm 201)',
    seatCoord: 'Row 1, Col 3',
    status: 'OPERATIONAL' as const,
    condition: 'EXCELLENT' as const,
    cpuProcessor: 'Intel Core i7-12700 (12 Cores)',
    ramCapacityGb: 16,
    storageType: 'NVMe SSD',
    storageCapacityGb: 512,
    gpuModel: 'NVIDIA GeForce GTX 1660 Super 6GB',
    portCount: '24-Port 10/100/1000Base-T + 4x 10G SFP+',
    firmwareVersion: 'Cisco IOS 15.2(7)E',
    rackUnits: 'Rack A - RU 12',
    lumens: '4,000 ANSI Lumens',
    resolution: '1920x1080 Full HD (1080p)',
    lampHours: '12,000 Hours (ECO)',
    videoInputs: 'HDMI x2, VGA In/Out, USB',
    vaRating: '1500VA / 900W Pure Sine Wave',
    outletCount: '8x IEC C13 Outlets (Battery + Surge)',
    batteryType: '12V 9Ah Sealed Lead-Acid (RBC7)',
    wifiStandard: 'Wi-Fi 6 (802.11ax) Dual-Band AX3000',
    ipAddress: '192.168.10.19',
    macAddress: '00:1A:2B:09:4D:5E',
    purchaseCost: 60000,
  });

  // Copy helper
  const handleCopyText = (text: string, key: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1600);
    }
  };

  // Switch Category preset defaults
  const handleSelectCategoryPreset = (catId: string) => {
    switch (catId) {
      case 'PROJECTOR':
        setNewAsset((prev) => ({
          ...prev,
          category: 'PROJECTOR',
          assetTag: 'ACLC-MNL-LAB1-PRJ02',
          name: 'Ceiling Presentation Projector',
          brand: 'Epson',
          model: 'EB-FH52 3LCD Projector',
          serialNumber: 'EP-2026-FH52',
          seatCoord: 'Ceiling Mount Front Center',
          ipAddress: '192.168.10.8',
          purchaseCost: 48500,
        }));
        break;
      case 'ROUTER':
        setNewAsset((prev) => ({
          ...prev,
          category: 'ROUTER',
          assetTag: 'ACLC-MNL-LAB1-RTR01',
          name: 'Lab 1 Gateway Router',
          brand: 'Cisco',
          model: 'ISR 4331/K9 Gateway',
          serialNumber: 'FOC2399R810',
          seatCoord: 'Rack A, Unit 14',
          ipAddress: '192.168.10.1',
          purchaseCost: 110000,
        }));
        break;
      case 'NETWORKING_SWITCH':
        setNewAsset((prev) => ({
          ...prev,
          category: 'NETWORKING_SWITCH',
          assetTag: 'ACLC-MNL-LAB1-SW02',
          name: '24-Port Gigabit Access Switch',
          brand: 'Cisco',
          model: 'Catalyst 2960-X 24PS-L',
          serialNumber: 'FCW2318B901',
          seatCoord: 'Rack A, Unit 10',
          ipAddress: '192.168.10.3',
          purchaseCost: 78000,
        }));
        break;
      case 'UPS':
        setNewAsset((prev) => ({
          ...prev,
          category: 'UPS',
          assetTag: 'ACLC-MNL-LAB1-UPS02',
          name: 'Smart-UPS Rackmount Backup',
          brand: 'APC',
          model: 'SMT1500RMI2U',
          serialNumber: 'AS202690182',
          seatCoord: 'Rack A, Base Unit',
          ipAddress: '192.168.10.4',
          purchaseCost: 39000,
        }));
        break;
      case 'SERVER':
        setNewAsset((prev) => ({
          ...prev,
          category: 'SERVER',
          assetTag: 'ACLC-MNL-LAB1-SRV02',
          name: 'Virtualization & AD Host Server',
          brand: 'Dell',
          model: 'PowerEdge R640 1U',
          serialNumber: '7K91902-LAB1-B',
          seatCoord: 'Rack A, RU 18-19',
          ipAddress: '192.168.10.22',
          purchaseCost: 295000,
        }));
        break;
      case 'ACCESS_POINT':
        setNewAsset((prev) => ({
          ...prev,
          category: 'ACCESS_POINT',
          assetTag: 'ACLC-MNL-LAB1-AP01',
          name: 'High-Density Wi-Fi 6 AP',
          brand: 'Ubiquiti',
          model: 'UniFi U6 Pro',
          serialNumber: 'U6-PRO-98124',
          seatCoord: 'Ceiling Center Mount',
          ipAddress: '192.168.10.9',
          purchaseCost: 14500,
        }));
        break;
      case 'PRINTER_SCANNER':
        setNewAsset((prev) => ({
          ...prev,
          category: 'PRINTER_SCANNER',
          assetTag: 'ACLC-MNL-LAB1-PRN02',
          name: 'Department Network Laser Printer',
          brand: 'HP',
          model: 'LaserJet Pro MFP 4103fdw',
          serialNumber: 'HP-MFP-2026',
          seatCoord: 'Instructor Station / Lab Corner',
          ipAddress: '192.168.10.7',
          purchaseCost: 26500,
          portCount: 'Monochrome Laser / 42 ppm / Auto-Duplex',
          firmwareVersion: 'Gigabit Ethernet & Dual-Band Wi-Fi',
          rackUnits: '250-Sheet Paper Tray + 100-Sheet Multipurpose',
          gpuModel: '50-Sheet Automatic Document Feeder (ADF)',
        }));
        break;
      default:
        setNewAsset((prev) => ({
          ...prev,
          category: 'WORKSTATION',
          assetTag: 'ACLC-MNL-LAB1-WS09',
          name: 'Lab 1 Workstation 09',
          brand: 'Dell',
          model: 'OptiPlex 7090 Tower',
          serialNumber: '8J92KL9',
          seatCoord: 'Row 1, Col 3',
          ipAddress: '192.168.10.19',
          purchaseCost: 60000,
        }));
        break;
    }
  };

  // Real CSV Export Function
  const handleExportCSV = () => {
    const headers = [
      'Asset Tag',
      'Asset Name',
      'Category',
      'Brand & Model',
      'Laboratory Room',
      'Position / Mount',
      'Status',
      'Condition',
      'Technical Specs',
      'IP Address',
      'Serial Number',
      'Valuation (PHP)',
    ];

    const rows = filteredAssets.map((a) => [
      `"${a.assetTag}"`,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.category}"`,
      `"${a.brandModel.replace(/"/g, '""')}"`,
      `"${a.labRoom.replace(/"/g, '""')}"`,
      `"${a.seatCoord.replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${a.condition}"`,
      `"${a.cpuRam.replace(/"/g, '""')}"`,
      `"${a.ipAddress}"`,
      `"${a.serialNumber}"`,
      Number(a.purchaseCost || 0),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `ACLC_Manila_IT_Asset_Directory_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCategoryDetails = (catId: string) => {
    const raw = (catId || '').toUpperCase();
    if (raw === 'SWITCH' || raw === 'NETWORKING_SWITCH') {
      return INSTITUTIONAL_CATEGORIES.find((c) => c.id === 'NETWORKING_SWITCH')!;
    }
    if (raw === 'ROUTER' || raw === 'GATEWAY') {
      return INSTITUTIONAL_CATEGORIES.find((c) => c.id === 'ROUTER')!;
    }
    if (raw === 'PRINTER' || raw === 'PRINTER_SCANNER' || raw === 'PERIPHERAL') {
      return INSTITUTIONAL_CATEGORIES.find((c) => c.id === 'PRINTER_SCANNER')!;
    }
    if (raw === 'AP' || raw === 'ACCESS_POINT' || raw === 'WIFI') {
      return INSTITUTIONAL_CATEGORIES.find((c) => c.id === 'ACCESS_POINT')!;
    }
    const found = INSTITUTIONAL_CATEGORIES.find((c) => c.id === raw);
    if (found) return found;
    return {
      id: catId,
      label: catId,
      fullLabel: catId,
      icon: Monitor,
      color: 'text-slate-300 bg-slate-800 border-slate-700 category-badge-workstation',
    };
  };

  // Add Asset Submit
  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalCpuRam = '';
    if (newAsset.category === 'PROJECTOR') {
      finalCpuRam = `${newAsset.lumens} / ${newAsset.resolution} / ${newAsset.lampHours} / ${newAsset.videoInputs}`;
    } else if (newAsset.category === 'ROUTER' || newAsset.category === 'NETWORKING_SWITCH') {
      finalCpuRam = `${newAsset.portCount} / ${newAsset.firmwareVersion} / ${newAsset.rackUnits}`;
    } else if (newAsset.category === 'UPS') {
      finalCpuRam = `${newAsset.vaRating} / ${newAsset.outletCount} / ${newAsset.batteryType}`;
    } else if (newAsset.category === 'ACCESS_POINT') {
      finalCpuRam = `${newAsset.wifiStandard} / 802.3at PoE+`;
    } else if (newAsset.category === 'PRINTER_SCANNER') {
      finalCpuRam = `${newAsset.portCount} / ${newAsset.firmwareVersion} / ${newAsset.rackUnits} / ${newAsset.gpuModel}`;
    } else {
      finalCpuRam = `${newAsset.cpuProcessor} / ${newAsset.ramCapacityGb}GB RAM / ${newAsset.storageCapacityGb}GB ${newAsset.storageType} / ${newAsset.gpuModel}`;
    }

    const createdItem: TableAssetItem = {
      id: `asset-${Date.now()}`,
      assetTag: newAsset.assetTag,
      name: newAsset.name,
      category: newAsset.category,
      brandModel: `${newAsset.brand} ${newAsset.model}`,
      labRoom: newAsset.labRoom,
      seatCoord: newAsset.seatCoord,
      status: newAsset.status,
      condition: newAsset.condition,
      cpuRam: finalCpuRam,
      ipAddress: newAsset.ipAddress,
      serialNumber: newAsset.serialNumber,
      purchaseCost: Number(newAsset.purchaseCost) || 50000,
    };

    addAsset(createdItem);

    setTimeout(() => {
      setIsSubmitting(false);
      setAddFeedback(`Asset "${createdItem.assetTag}" registered and synchronized!`);
      setTimeout(() => {
        setAddFeedback(null);
        setIsAddModalOpen(false);
      }, 1200);
    }, 400);
  };

  // Edit Asset Submit
  const handleSaveEditedAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    updateAsset(editingAsset);
    setEditFeedback('Asset record updated and synchronized across all laboratory maps!');

    setTimeout(() => {
      setEditFeedback(null);
      setEditingAsset(null);
    }, 1200);
  };

  // Delete Confirm
  const handleConfirmDelete = () => {
    if (!deletingAsset) return;
    setIsDeleting(true);
    const tag = deletingAsset.assetTag;
    const name = deletingAsset.name;

    deleteAsset(deletingAsset.id);

    setIsDeleting(false);
    setDeletingAsset(null);
    setDeleteFeedback(`Asset ${tag} (${name}) has been permanently deleted from institutional inventory and removed from active facility mappings.`);
    setTimeout(() => {
      setDeleteFeedback(null);
    }, 6000);
  };

  // Filter & Sort Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter((item) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          !query ||
          item.assetTag.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.serialNumber.toLowerCase().includes(query) ||
          item.brandModel.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.labRoom.toLowerCase().includes(query) ||
          item.seatCoord.toLowerCase().includes(query) ||
          item.cpuRam.toLowerCase().includes(query) ||
          item.ipAddress.includes(query);

        const matchesLab =
          labFilter === 'ALL' || item.labRoom.toLowerCase().includes(labFilter.toLowerCase());

        const matchesStatus =
          statusFilter === 'ALL' || item.status === statusFilter;

        const rawCategory = (item.category || '').toUpperCase();
        let matchesCategory = false;
        if (categoryFilter === 'ALL') {
          matchesCategory = true;
        } else if (categoryFilter === 'NETWORKING_SWITCH') {
          matchesCategory = rawCategory === 'NETWORKING_SWITCH' || rawCategory === 'SWITCH';
        } else if (categoryFilter === 'PRINTER_SCANNER') {
          matchesCategory = rawCategory === 'PRINTER_SCANNER' || rawCategory === 'PERIPHERAL' || rawCategory === 'PRINTER';
        } else if (categoryFilter === 'ACCESS_POINT') {
          matchesCategory = rawCategory === 'ACCESS_POINT' || rawCategory === 'AP';
        } else if (categoryFilter === 'ROUTER') {
          matchesCategory = rawCategory === 'ROUTER' || rawCategory === 'GATEWAY';
        } else {
          matchesCategory = rawCategory === categoryFilter;
        }

        const matchesCondition =
          conditionFilter === 'ALL' || item.condition === conditionFilter;

        return matchesSearch && matchesLab && matchesStatus && matchesCategory && matchesCondition;
      })
      .sort((a, b) => {
        if (sortBy === 'VALUATION_DESC') return (b.purchaseCost || 0) - (a.purchaseCost || 0);
        if (sortBy === 'VALUATION_ASC') return (a.purchaseCost || 0) - (b.purchaseCost || 0);
        if (sortBy === 'NAME') return a.name.localeCompare(b.name);
        if (sortBy === 'ROOM') return a.labRoom.localeCompare(b.labRoom);
        return a.assetTag.localeCompare(b.assetTag);
      });
  }, [assets, searchTerm, labFilter, statusFilter, categoryFilter, conditionFilter, sortBy]);

  // Statistics Computations
  const stats = useMemo(() => {
    const totalCount = assets.length;
    const totalValuation = assets.reduce((sum, item) => sum + (item.purchaseCost || 0), 0);
    const operationalCount = assets.filter((a) => a.status === 'OPERATIONAL').length;
    const degradedCount = assets.filter((a) => a.status === 'DEGRADED').length;
    const maintenanceCount = assets.filter((a) => a.status === 'UNDER_MAINTENANCE').length;
    const borrowedCount = assets.filter((a) => a.status === 'BORROWED').length;
    const healthPercent = totalCount ? Math.round((operationalCount / totalCount) * 100) : 100;

    return {
      totalCount,
      totalValuation,
      operationalCount,
      degradedCount,
      maintenanceCount,
      borrowedCount,
      healthPercent,
    };
  }, [assets]);

  const hasActiveFilters =
    searchTerm !== '' ||
    categoryFilter !== 'ALL' ||
    labFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    conditionFilter !== 'ALL';

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('ALL');
    setLabFilter('ALL');
    setStatusFilter('ALL');
    setConditionFilter('ALL');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header & Institutional Overview */}
      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800/60">
                ACLC-MNL-AMS
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                IT Asset Directory & Equipment Inventory
              </h2>
              <span className="text-xs text-slate-400 hidden sm:inline">&bull;</span>
              <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Floor Grid Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Institutional tracking and property registry for all campus IT infrastructure: Student Workstations, Core Switches, Perimeter Gateways, Servers, Projection Systems, and Power Backups.
            </p>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Visual Cards View"
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              title="Download Verified Inventory Manifest (CSV)"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            {/* Register New Asset Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Equipment</span>
            </button>
          </div>
        </div>

        {/* 2. Executive Key Metrics & Inventory Vital Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Metric 1: Total Registered Assets */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Total Registered Units</span>
              <HardDrive className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">{stats.totalCount}</span>
              <span className="text-[11px] text-slate-500 font-mono">active units</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 truncate">
              {filteredAssets.length} currently in view
            </div>
          </div>

          {/* Metric 2: Total Capital Asset Valuation */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Capital Asset Valuation</span>
              <span className="font-mono text-xs font-bold text-emerald-400">PHP</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-emerald-400">
                ₱{stats.totalValuation.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Institutional Book Value
            </div>
          </div>

          {/* Metric 3: Fleet Health & Availability */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Operational Health</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{stats.healthPercent}%</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-300">
                {stats.operationalCount}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">/ {stats.totalCount} operational</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              {stats.degradedCount > 0 && (
                <span className="text-amber-400 font-semibold">{stats.degradedCount} Degraded</span>
              )}
              {stats.maintenanceCount > 0 && (
                <span className="text-red-400 font-semibold">{stats.maintenanceCount} Repair</span>
              )}
            </div>
          </div>

          {/* Metric 4: Assigned Facilities & Rooms */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Campus Deployment</span>
              <MapPin className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">4</span>
              <span className="text-[11px] text-slate-500 font-mono">laboratories / rooms</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 truncate">
              Lab 1 &bull; Lab 2 &bull; Lab 3 &bull; Server Rm
            </div>
          </div>
        </div>
      </div>

      {/* Delete Feedback Banner */}
      {deleteFeedback && (
        <div className="p-3.5 bg-red-950/70 border border-red-700/80 rounded-xl text-red-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="font-medium">{deleteFeedback}</span>
          </div>
          <button
            onClick={() => setDeleteFeedback(null)}
            className="p-1 rounded text-red-400 hover:text-white hover:bg-red-900/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
        <button
          onClick={() => setCategoryFilter('ALL')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap text-xs ${
            categoryFilter === 'ALL'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Categories</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
              categoryFilter === 'ALL'
                ? 'bg-white/20 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {assets.length}
          </span>
        </button>

        {INSTITUTIONAL_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = assets.filter((a) => {
            const raw = (a.category || '').toUpperCase();
            if (cat.id === 'NETWORKING_SWITCH') return raw === 'NETWORKING_SWITCH' || raw === 'SWITCH';
            if (cat.id === 'PRINTER_SCANNER') return raw === 'PRINTER_SCANNER' || raw === 'PERIPHERAL' || raw === 'PRINTER';
            if (cat.id === 'ACCESS_POINT') return raw === 'ACCESS_POINT' || raw === 'AP';
            if (cat.id === 'ROUTER') return raw === 'ROUTER' || raw === 'GATEWAY';
            return raw === cat.id;
          }).length;
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap text-xs ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Search & Multi-Filter Control Bar */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by Asset Tag, Name, Brand/Model, Serial Number, IP Address, Specs, or Room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns Filter Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Categories ({assets.length})</option>
            {INSTITUTIONAL_CATEGORIES.map((cat) => {
              const count = assets.filter((a) => {
                const raw = (a.category || '').toUpperCase();
                if (cat.id === 'NETWORKING_SWITCH') return raw === 'NETWORKING_SWITCH' || raw === 'SWITCH';
                if (cat.id === 'PRINTER_SCANNER') return raw === 'PRINTER_SCANNER' || raw === 'PERIPHERAL' || raw === 'PRINTER';
                if (cat.id === 'ACCESS_POINT') return raw === 'ACCESS_POINT' || raw === 'AP';
                if (cat.id === 'ROUTER') return raw === 'ROUTER' || raw === 'GATEWAY';
                return raw === cat.id;
              }).length;
              return (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({count})
                </option>
              );
            })}
          </select>

          {/* Room Filter */}
          <select
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Rooms</option>
            <option value="Lab 1">Lab 1 (Rm 201)</option>
            <option value="Lab 2">Lab 2 (Rm 302)</option>
            <option value="Lab 3">Lab 3 (Rm 304)</option>
            <option value="Server Room">Server Room (Rm 305)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="DEGRADED">Degraded</option>
            <option value="UNDER_MAINTENANCE">Maintenance</option>
            <option value="BORROWED">Borrowed</option>
          </select>

          {/* Condition Filter */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Conditions</option>
            <option value="EXCELLENT">Excellent</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="DAMAGED">Damaged</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="TAG">Sort: Asset Tag</option>
            <option value="VALUATION_DESC">Sort: Valuation (High to Low)</option>
            <option value="VALUATION_ASC">Sort: Valuation (Low to High)</option>
            <option value="NAME">Sort: Equipment Name</option>
            <option value="ROOM">Sort: Room Location</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              title="Reset all active filters"
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Main Content: Table View OR Visual Cards Grid View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="p-3.5 pl-4">Asset Tag / Serial</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Equipment & Brand</th>
                <th className="p-3.5">Room & Position</th>
                <th className="p-3.5">Technical Specs & IP</th>
                <th className="p-3.5">Valuation</th>
                <th className="p-3.5">Status & Condition</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-600 mb-1" />
                      <p className="font-semibold text-slate-300">No assets match your search criteria</p>
                      <p className="text-xs text-slate-500">Try modifying or resetting the active filters above.</p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const catInfo = getCategoryDetails(asset.category);
                  const CatIcon = catInfo.icon;
                  const isCopiedTag = copiedKey === `tag-${asset.id}`;
                  const isCopiedIp = copiedKey === `ip-${asset.id}`;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setInspectAsset(asset)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Asset Tag & Serial */}
                      <td className="p-3.5 pl-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                            {asset.assetTag}
                          </span>
                          <button
                            onClick={(e) => handleCopyText(asset.assetTag, `tag-${asset.id}`, e)}
                            title="Copy Asset Tag"
                            className="p-1 rounded text-slate-500 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            {isCopiedTag ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          SN: {asset.serialNumber || 'N/A'}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${catInfo.color}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{catInfo.label}</span>
                        </span>
                      </td>

                      {/* Equipment Name & Brand */}
                      <td className="p-3.5">
                        <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {asset.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{asset.brandModel}</div>
                      </td>

                      {/* Location & Mount */}
                      <td className="p-3.5">
                        <div className="font-medium text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{asset.labRoom}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 ml-4">
                          {asset.seatCoord}
                        </div>
                      </td>

                      {/* Specs & IP */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-300 max-w-xs">
                        <div className="truncate" title={asset.cpuRam}>
                          {asset.cpuRam}
                        </div>
                        {asset.ipAddress && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                              {asset.ipAddress}
                            </span>
                            <button
                              onClick={(e) => handleCopyText(asset.ipAddress, `ip-${asset.id}`, e)}
                              title="Copy IP Address"
                              className="p-0.5 text-slate-500 hover:text-cyan-300 cursor-pointer"
                            >
                              {isCopiedIp ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Valuation */}
                      <td className="p-3.5 font-mono text-[11px] font-semibold text-emerald-400">
                        ₱{Number(asset.purchaseCost || 0).toLocaleString()}
                      </td>

                      {/* Status & Condition */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              asset.status === 'OPERATIONAL'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                                : asset.status === 'UNDER_MAINTENANCE'
                                ? 'bg-red-950 text-red-300 border border-red-800/50 animate-pulse'
                                : asset.status === 'DEGRADED'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                                : 'bg-blue-950 text-blue-300 border border-blue-800/50'
                            }`}
                          >
                            {asset.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Cond: <span className="text-slate-300 font-semibold">{asset.condition}</span>
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setInspectAsset(asset)}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            title="Inspect Equipment Specs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingAsset({ ...asset })}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            title="Edit Asset Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setQrModalAsset(asset)}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            title="Print Institutional QR Tag Badge"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingAsset(asset);
                              setDeleteReason('DECOMMISSIONED');
                              setDeleteNotes('');
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-950/70 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-800/50 transition-colors cursor-pointer"
                            title="Decommission & Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Visual Equipment Cards Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">No assets match your search criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting or broadening your filters.</p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="mt-3 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const catInfo = getCategoryDetails(asset.category);
              const CatIcon = catInfo.icon;
              return (
                <div
                  key={asset.id}
                  onClick={() => setInspectAsset(asset)}
                  className="p-5 bg-slate-900 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-lg flex flex-col justify-between transition-all cursor-pointer group"
                >
                  <div>
                    {/* Card Top: Category Icon, Tag, Status Dot */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                          <CatIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-mono text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                            {asset.assetTag}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            SN: {asset.serialNumber || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          asset.status === 'OPERATIONAL'
                            ? 'bg-emerald-400 ring-4 ring-emerald-950/60'
                            : asset.status === 'UNDER_MAINTENANCE'
                            ? 'bg-red-400 ring-4 ring-red-950/60 animate-pulse'
                            : asset.status === 'DEGRADED'
                            ? 'bg-amber-400 ring-4 ring-amber-950/60'
                            : 'bg-blue-400 ring-4 ring-blue-950/60'
                        }`}
                        title={asset.status}
                      />
                    </div>

                    {/* Card Body: Equipment Name, Model, Location */}
                    <div className="mt-3 space-y-1">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{asset.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{asset.brandModel}</p>
                    </div>

                    {/* Location Badge */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800/70">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{asset.labRoom}</span>
                      <span className="text-slate-500 font-mono text-[10px] truncate">&bull; {asset.seatCoord}</span>
                    </div>

                    {/* Technical Specs Pill */}
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/50 font-mono text-[11px] text-slate-300 line-clamp-2">
                      {asset.cpuRam}
                    </div>
                  </div>

                  {/* Card Bottom: Valuation + Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <div className="font-mono">
                      <span className="text-[10px] text-slate-500 block">Valuation</span>
                      <span className="text-xs font-bold text-emerald-400">
                        ₱{Number(asset.purchaseCost || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setInspectAsset(asset)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Inspect Equipment Specs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setQrModalAsset(asset)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Print QR Tag"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingAsset({ ...asset })}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingAsset(asset);
                          setDeleteReason('DECOMMISSIONED');
                          setDeleteNotes('');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Decommission & Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 6. MODAL 1: Quick Equipment Inspect & Technical Sheet */}
      {inspectAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400">
                  {React.createElement(getCategoryDetails(inspectAsset.category).icon, {
                    className: 'w-6 h-6',
                  })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-lg">{inspectAsset.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inspectAsset.status === 'OPERATIONAL'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                          : inspectAsset.status === 'UNDER_MAINTENANCE'
                          ? 'bg-red-950 text-red-300 border border-red-800/50'
                          : inspectAsset.status === 'DEGRADED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/50'
                      }`}
                    >
                      {inspectAsset.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {inspectAsset.assetTag} &bull; {inspectAsset.brandModel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectAsset(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Technical Sheet Grid */}
            <div className="space-y-3 text-xs">
              {/* Location & Network */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Facility Deployment
                  </span>
                  <div className="font-semibold text-white text-sm">{inspectAsset.labRoom}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{inspectAsset.seatCoord}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Network Interface & IP
                  </span>
                  <div className="font-mono font-bold text-cyan-300 text-sm">
                    {inspectAsset.ipAddress || 'Unassigned / Static DHCP'}
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    Subnet: 192.168.10.0/24 (Gateway: 192.168.10.1)
                  </div>
                </div>
              </div>

              {/* Hardware Specifications */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Hardware & Technical Configuration
                </span>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono leading-relaxed">
                  {inspectAsset.cpuRam}
                </div>
              </div>

              {/* Institutional Custody & Valuation */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Serial Number</span>
                  <span className="font-mono font-semibold text-slate-200 text-xs">
                    {inspectAsset.serialNumber || 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Physical Condition</span>
                  <span className="font-mono font-semibold text-slate-200 text-xs">
                    {inspectAsset.condition}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block">Book Valuation</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    ₱{Number(inspectAsset.purchaseCost || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setDeletingAsset(inspectAsset);
                  setInspectAsset(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl border border-red-800/60 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Decommission
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQrModalAsset(inspectAsset);
                    setInspectAsset(null);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer border border-slate-700 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  Print QR Badge
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAsset({ ...inspectAsset });
                    setInspectAsset(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL 2: Register New Asset (All IT Equipment) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-white text-base">Register IT Equipment & Property Asset</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Select the IT equipment category below to tailor hardware specifications.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Category Selector Tabs in Registration Modal */}
            <div className="space-y-1.5">
              <span className="text-slate-300 font-semibold block text-xs">Equipment Category:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INSTITUTIONAL_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = newAsset.category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleSelectCategoryPreset(cat.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md ring-1 ring-cyan-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleCreateAssetSubmit} className="space-y-4 text-xs">
              {/* Row 1: Asset Tag & Serial */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Institutional Asset Tag <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACLC-MNL-LAB1-WS09"
                    value={newAsset.assetTag}
                    onChange={(e) => setNewAsset({ ...newAsset, assetTag: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Format: ACLC-[CAMPUS]-[ROOM]-[ID]</span>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Hardware Serial Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Manufacturer Serial No."
                    value={newAsset.serialNumber}
                    onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Row 2: Name, Brand, Model */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Equipment Name</label>
                  <input
                    type="text"
                    required
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Manufacturer / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cisco, Dell, Epson, APC, HP"
                    value={newAsset.brand}
                    onChange={(e) => setNewAsset({ ...newAsset, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Model / Part Number</label>
                  <input
                    type="text"
                    value={newAsset.model}
                    onChange={(e) => setNewAsset({ ...newAsset, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Row 3: Room, Mount Location, Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Laboratory Assignment</label>
                  <select
                    value={newAsset.labRoom}
                    onChange={(e) => setNewAsset({ ...newAsset, labRoom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Lab 1 (Rm 201)">Lab 1 (Rm 201 - 2nd Floor)</option>
                    <option value="Lab 2 (Rm 302)">Lab 2 (Rm 302 - 3rd Floor)</option>
                    <option value="Lab 3 (Rm 304)">Lab 3 (Rm 304 - 3rd Floor)</option>
                    <option value="Server Room (Rm 305)">IT Server Room (Rm 305)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Seat / Rack / Mount Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Rack A - RU 12 / Ceiling Mount / Row 1 Col 3"
                    value={newAsset.seatCoord}
                    onChange={(e) => setNewAsset({ ...newAsset, seatCoord: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Initial Status</label>
                  <select
                    value={newAsset.status}
                    onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="DEGRADED">DEGRADED</option>
                    <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                    <option value="BORROWED">BORROWED</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Specifications Box Based on Equipment Category */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  {newAsset.category === 'PROJECTOR'
                    ? 'Optical & Video Projection Specifications'
                    : newAsset.category === 'ROUTER' || newAsset.category === 'NETWORKING_SWITCH'
                    ? 'Network Ports & Switching Specifications'
                    : newAsset.category === 'UPS'
                    ? 'Power Capacity & Battery Specifications'
                    : newAsset.category === 'ACCESS_POINT'
                    ? 'Wireless & PoE Specifications'
                    : 'Hardware Specifications (CPU / RAM / Storage)'}
                </span>

                {/* Case 1: Projectors & Displays */}
                {newAsset.category === 'PROJECTOR' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Luminance / Brightness (Lumens)</label>
                      <input
                        type="text"
                        placeholder="e.g. 4,000 ANSI Lumens"
                        value={newAsset.lumens}
                        onChange={(e) => setNewAsset({ ...newAsset, lumens: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Native Resolution</label>
                      <input
                        type="text"
                        placeholder="e.g. 1920x1080 Full HD (1080p)"
                        value={newAsset.resolution}
                        onChange={(e) => setNewAsset({ ...newAsset, resolution: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Lamp Life & Technology</label>
                      <input
                        type="text"
                        placeholder="e.g. 12,000 Hours (ECO) / 3LCD"
                        value={newAsset.lampHours}
                        onChange={(e) => setNewAsset({ ...newAsset, lampHours: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Video Connectivity Inputs</label>
                      <input
                        type="text"
                        placeholder="e.g. 2x HDMI, VGA In/Out, Composite, USB"
                        value={newAsset.videoInputs}
                        onChange={(e) => setNewAsset({ ...newAsset, videoInputs: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* Case 2: Network Switches & Routers */}
                {(newAsset.category === 'NETWORKING_SWITCH' || newAsset.category === 'ROUTER') && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Port Density & Types</label>
                      <input
                        type="text"
                        placeholder="e.g. 24-Port 10/100/1000 + 4x 10G SFP+"
                        value={newAsset.portCount}
                        onChange={(e) => setNewAsset({ ...newAsset, portCount: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Firmware / Operating System</label>
                      <input
                        type="text"
                        placeholder="e.g. Cisco IOS 15.2(7)E / IOS-XE 17.3"
                        value={newAsset.firmwareVersion}
                        onChange={(e) => setNewAsset({ ...newAsset, firmwareVersion: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Rack Unit Allocation</label>
                      <input
                        type="text"
                        placeholder="e.g. Rack A - RU 12"
                        value={newAsset.rackUnits}
                        onChange={(e) => setNewAsset({ ...newAsset, rackUnits: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Throughput Capacity</label>
                      <input
                        type="text"
                        placeholder="e.g. 128 Gbps / 71.4 Mpps"
                        value={newAsset.gpuModel}
                        onChange={(e) => setNewAsset({ ...newAsset, gpuModel: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* Case 3: UPS Power Backup */}
                {newAsset.category === 'UPS' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Power Capacity Rating</label>
                      <input
                        type="text"
                        placeholder="e.g. 1500VA / 900W Pure Sine Wave"
                        value={newAsset.vaRating}
                        onChange={(e) => setNewAsset({ ...newAsset, vaRating: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Output Receptacles / Outlets</label>
                      <input
                        type="text"
                        placeholder="e.g. 8x IEC C13 Outlets (Battery + Surge)"
                        value={newAsset.outletCount}
                        onChange={(e) => setNewAsset({ ...newAsset, outletCount: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Battery Cell Chemistry / Model</label>
                      <input
                        type="text"
                        placeholder="e.g. 12V 9Ah Lead-Acid (RBC7)"
                        value={newAsset.batteryType}
                        onChange={(e) => setNewAsset({ ...newAsset, batteryType: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Form Factor</label>
                      <input
                        type="text"
                        placeholder="e.g. 2U Rackmount"
                        value={newAsset.storageType}
                        onChange={(e) => setNewAsset({ ...newAsset, storageType: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* Case 4: Wireless AP */}
                {newAsset.category === 'ACCESS_POINT' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Wi-Fi Standards & Bands</label>
                      <input
                        type="text"
                        placeholder="e.g. Wi-Fi 6 (802.11ax) Dual-Band AX3000"
                        value={newAsset.wifiStandard}
                        onChange={(e) => setNewAsset({ ...newAsset, wifiStandard: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Power Input</label>
                      <input
                        type="text"
                        placeholder="e.g. 802.3at PoE+ (48V)"
                        value={newAsset.gpuModel}
                        onChange={(e) => setNewAsset({ ...newAsset, gpuModel: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* Case 5: Printers & Peripherals */}
                {newAsset.category === 'PRINTER_SCANNER' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Print Technology & Speed</label>
                      <input
                        type="text"
                        placeholder="e.g. Monochrome Laser / 42 ppm / Auto-Duplex"
                        value={newAsset.portCount}
                        onChange={(e) => setNewAsset({ ...newAsset, portCount: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Network & Connectivity Interfaces</label>
                      <input
                        type="text"
                        placeholder="e.g. Gigabit Ethernet, Wi-Fi Direct, USB 2.0"
                        value={newAsset.firmwareVersion}
                        onChange={(e) => setNewAsset({ ...newAsset, firmwareVersion: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Paper Tray & Media Handling</label>
                      <input
                        type="text"
                        placeholder="e.g. 250-sheet tray + 100-sheet multipurpose"
                        value={newAsset.rackUnits}
                        onChange={(e) => setNewAsset({ ...newAsset, rackUnits: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Scanner & Functionality</label>
                      <input
                        type="text"
                        placeholder="e.g. 50-sheet Dual-Scan DADF / Thermal Barcode Engine"
                        value={newAsset.gpuModel}
                        onChange={(e) => setNewAsset({ ...newAsset, gpuModel: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* Case 6: Workstations, Servers, & Generic Systems */}
                {newAsset.category !== 'PROJECTOR' &&
                  newAsset.category !== 'ROUTER' &&
                  newAsset.category !== 'NETWORKING_SWITCH' &&
                  newAsset.category !== 'UPS' &&
                  newAsset.category !== 'ACCESS_POINT' &&
                  newAsset.category !== 'PRINTER_SCANNER' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Processor (CPU)</label>
                        <input
                          type="text"
                          value={newAsset.cpuProcessor}
                          onChange={(e) => setNewAsset({ ...newAsset, cpuProcessor: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Physical RAM (GB)</label>
                        <input
                          type="number"
                          value={newAsset.ramCapacityGb}
                          onChange={(e) => setNewAsset({ ...newAsset, ramCapacityGb: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Storage Type & Capacity</label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={newAsset.storageType}
                            onChange={(e) => setNewAsset({ ...newAsset, storageType: e.target.value })}
                            className="px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                          >
                            <option value="NVMe SSD">NVMe SSD</option>
                            <option value="SATA SSD">SATA SSD</option>
                            <option value="SATA HDD">SATA HDD</option>
                            <option value="SAS RAID10">SAS RAID10</option>
                          </select>
                          <input
                            type="number"
                            value={newAsset.storageCapacityGb}
                            onChange={(e) => setNewAsset({ ...newAsset, storageCapacityGb: Number(e.target.value) })}
                            className="px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Dedicated Graphics (GPU)</label>
                        <input
                          type="text"
                          value={newAsset.gpuModel}
                          onChange={(e) => setNewAsset({ ...newAsset, gpuModel: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  )}
              </div>

              {/* Row 4: IP Address & Valuation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">IPv4 Management IP</label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.10.X"
                    value={newAsset.ipAddress}
                    onChange={(e) => setNewAsset({ ...newAsset, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Book Valuation (PHP ₱)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={newAsset.purchaseCost}
                    onChange={(e) => setNewAsset({ ...newAsset, purchaseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {addFeedback && (
                <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {addFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Register & Generate QR Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL 3: Printable Institutional QR Tag Badge */}
      {qrModalAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-base">Institutional QR Asset Badge</h4>
              <button
                onClick={() => setQrModalAsset(null)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Realistic Physical Sticker Badge */}
            <div className="w-full bg-white p-4 rounded-xl border-2 border-slate-400 shadow-md text-slate-900 text-left space-y-2">
              {/* Badge Header with ACLC logo & institution */}
              <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2">
                <img
                  src="/assets/aistudio/ACLC_3c4418b0.png"
                  alt="ACLC Logo"
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
                <div className="leading-tight">
                  <div className="text-[11px] font-black uppercase tracking-tight text-blue-900">
                    ACLC College of Manila
                  </div>
                  <div className="text-[9px] font-bold text-slate-700 uppercase">
                    Property & Asset Control Division
                  </div>
                </div>
              </div>

              {/* QR Code & Asset Tag */}
              <div className="flex items-center gap-3 py-1">
                <div className="w-24 h-24 border-2 border-slate-900 rounded p-1 flex items-center justify-center bg-white flex-shrink-0">
                  <QrCode className="w-20 h-20 text-slate-900" />
                </div>
                <div className="space-y-1 font-mono text-[10px] leading-tight flex-1">
                  <div>
                    <span className="text-slate-500 block text-[8px]">ASSET TAG:</span>
                    <span className="font-bold text-slate-900 text-xs block">{qrModalAsset.assetTag}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[8px]">SERIAL NUMBER:</span>
                    <span className="font-semibold text-slate-800 block">{qrModalAsset.serialNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[8px]">ASSIGNMENT:</span>
                    <span className="text-slate-800 block">{qrModalAsset.labRoom}</span>
                  </div>
                </div>
              </div>

              {/* Equipment Name & Warning */}
              <div className="border-t border-slate-300 pt-1.5 text-[9px] font-mono leading-tight">
                <div className="font-bold text-slate-900 truncate">{qrModalAsset.name}</div>
                <div className="text-slate-600 truncate">{qrModalAsset.brandModel}</div>
                <div className="text-[8px] font-bold text-red-700 uppercase tracking-tighter mt-1">
                  WARNING: PROPERTY OF ACLC MANILA. DO NOT REMOVE OR TAMPER UNDER PENALTY OF LAW.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold rounded-xl text-white cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                Print Sticker Badge
              </button>
              <button
                onClick={() => setQrModalAsset(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-xl text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL 4: Edit Asset Details */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-white text-base">Edit IT Asset Record</h4>
                <span className="font-mono text-xs text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                  {editingAsset.assetTag}
                </span>
              </div>
              <button
                onClick={() => setEditingAsset(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedAsset} className="space-y-4 text-xs">
              {/* Row 1: Asset Tag & Serial */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Asset Tag</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.assetTag}
                    onChange={(e) => setEditingAsset({ ...editingAsset, assetTag: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.serialNumber}
                    onChange={(e) => setEditingAsset({ ...editingAsset, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Row 2: Name, Category, Brand/Model */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.name}
                    onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={editingAsset.category}
                    onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    {INSTITUTIONAL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Brand & Model</label>
                  <input
                    type="text"
                    value={editingAsset.brandModel}
                    onChange={(e) => setEditingAsset({ ...editingAsset, brandModel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Row 3: Room, Seat, Status, Condition */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Room Assignment</label>
                  <select
                    value={editingAsset.labRoom}
                    onChange={(e) => setEditingAsset({ ...editingAsset, labRoom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Lab 1 (Rm 201)">Lab 1 (Rm 201)</option>
                    <option value="Lab 2 (Rm 302)">Lab 2 (Rm 302)</option>
                    <option value="Lab 3 (Rm 304)">Lab 3 (Rm 304)</option>
                    <option value="Server Room (Rm 305)">Server Room (Rm 305)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Mount / Seat Position</label>
                  <input
                    type="text"
                    value={editingAsset.seatCoord}
                    onChange={(e) => setEditingAsset({ ...editingAsset, seatCoord: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Status</label>
                  <select
                    value={editingAsset.status}
                    onChange={(e) => setEditingAsset({ ...editingAsset, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="DEGRADED">DEGRADED</option>
                    <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                    <option value="BORROWED">BORROWED</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Condition</label>
                  <select
                    value={editingAsset.condition}
                    onChange={(e) => setEditingAsset({ ...editingAsset, condition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="EXCELLENT">EXCELLENT</option>
                    <option value="GOOD">GOOD</option>
                    <option value="FAIR">FAIR</option>
                    <option value="DAMAGED">DAMAGED</option>
                  </select>
                </div>
              </div>

              {/* Hardware Specifications & Network & Valuation */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Hardware & Technical Specifications Summary
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-slate-400 block mb-1">Specifications Details</label>
                    <input
                      type="text"
                      value={editingAsset.cpuRam}
                      onChange={(e) => setEditingAsset({ ...editingAsset, cpuRam: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Management IPv4</label>
                    <input
                      type="text"
                      value={editingAsset.ipAddress}
                      onChange={(e) => setEditingAsset({ ...editingAsset, ipAddress: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Book Valuation (PHP ₱)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={editingAsset.purchaseCost || 0}
                    onChange={(e) => setEditingAsset({ ...editingAsset, purchaseCost: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {editFeedback && (
                <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-medium text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {editFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. MODAL 5: Decommission & Delete Asset Confirmation */}
      {deletingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border-2 border-red-800/80 shadow-2xl p-6 text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-700/60 flex items-center justify-center text-red-400 shadow-inner">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Decommission & Delete Asset</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ACLC College of Manila &bull; Property & Asset Control
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeletingAsset(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Callout */}
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-red-200">Irreversible Action:</span> Deleting this asset will permanently remove it from the master inventory and automatically <b>vacate/unlink its assigned seat or rack slot</b> on the visual floor plan.
              </div>
            </div>

            {/* Asset Details Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-300">
                  {deletingAsset.assetTag}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {deletingAsset.category}
                </span>
              </div>

              <div>
                <div className="font-bold text-white text-sm">{deletingAsset.name}</div>
                <div className="text-slate-400 text-[11px]">{deletingAsset.brandModel}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Serial Number (SN):</span>
                  <span className="text-slate-200">{deletingAsset.serialNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Location & Slot:</span>
                  <span className="text-slate-200">{deletingAsset.labRoom} ({deletingAsset.seatCoord})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Network IP:</span>
                  <span className="text-cyan-300">{deletingAsset.ipAddress || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Book Valuation:</span>
                  <span className="text-emerald-400 font-semibold">
                    PHP {Number(deletingAsset.purchaseCost || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Deletion / Decommissioning Reason */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Institutional Disposal / Deletion Reason <span className="text-red-400">*</span>
                </label>
                <select
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-red-500"
                >
                  <option value="DECOMMISSIONED">📦 Decommissioned / End of Lifecycle (EOL)</option>
                  <option value="IRREPARABLE_DAMAGE">🛠️ Irreparably Damaged / Salvaged for Parts</option>
                  <option value="SURPLUS_TRANSFER">🚚 Transferred / Surplus to Other Campus Branch</option>
                  <option value="INVENTORY_CORRECTION">✏️ Administrative Correction / Duplicate Entry</option>
                  <option value="LOST_OR_STOLEN">⚠️ Disposal Write-off / Reported Lost or Stolen</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  Custodian Disposal Authorization Remarks (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Approved by Laboratory Head and IT Property Custodian for EOL disposal..."
                  value={deleteNotes}
                  onChange={(e) => setDeleteNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingAsset(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-950/60 transition-all cursor-pointer text-xs disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting Asset...' : 'Confirm Permanent Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
