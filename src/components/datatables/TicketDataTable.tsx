import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';

export interface TableTicketItem {
  id: string;
  ticketNumber: string;
  title: string;
  labRoom: string;
  assetTag?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_PARTS' | 'RESOLVED';
  issueCategory: string;
  reportedByName: string;
  assignedToName: string;
  createdAt: string;
  downtimeMinutes?: number;
}

const INITIAL_TICKETS: TableTicketItem[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-2026-4081',
    title: 'Continuous Motherboard Beep Code (4 Beeps) & No POST Display',
    labRoom: 'Lab 1 (Rm 301)',
    assetTag: 'ACLC-MNL-LAB1-WS01',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    issueCategory: 'HARDWARE_FAILURE',
    reportedByName: 'Prof. Reynaldo Bautista',
    assignedToName: 'Mark Alvin Santos',
    createdAt: '2026-11-03 09:15 PST',
    downtimeMinutes: 45,
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-2026-4078',
    title: 'Core Cisco Switch Fa0/24 Port Flapping & Intermittent Link Drop',
    labRoom: 'Lab 3 (Rm 304)',
    assetTag: 'ACLC-MNL-LAB3-SW01',
    priority: 'HIGH',
    status: 'OPEN',
    issueCategory: 'NETWORK_OFFLINE',
    reportedByName: 'Prof. Cristine Mendoza',
    assignedToName: 'Mark Alvin Santos',
    createdAt: '2026-11-03 11:30 PST',
  },
  {
    id: 'tkt-3',
    ticketNumber: 'TKT-2026-4062',
    title: 'A4Tech Optical Mouse Scroll Wheel Jammed & Skipping',
    labRoom: 'Lab 2 (Rm 302)',
    assetTag: 'ACLC-MNL-LAB2-WS14',
    priority: 'MEDIUM',
    status: 'WAITING_FOR_PARTS',
    issueCategory: 'PERIPHERAL_DEFECT',
    reportedByName: 'Joshua Villanueva (SA)',
    assignedToName: 'Marilou Dela Cruz',
    createdAt: '2026-11-02 14:20 PST',
  },
  {
    id: 'tkt-4',
    ticketNumber: 'TKT-2026-4045',
    title: 'Python 3.12 Virtual Environment Path Execution Policy Restrict',
    labRoom: 'Lab 2 (Rm 302)',
    priority: 'LOW',
    status: 'RESOLVED',
    issueCategory: 'SOFTWARE_OS',
    reportedByName: 'Prof. Cristine Mendoza',
    assignedToName: 'Mark Alvin Santos',
    createdAt: '2026-11-01 10:00 PST',
    downtimeMinutes: 20,
  },
];

export function TicketDataTable({ onResolveTicket }: { onResolveTicket?: (ticket: TableTicketItem) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTickets = INITIAL_TICKETS.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.assetTag && t.assetTag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-white text-base">Corrective Maintenance & Incident Ticket Queue</h3>
          <p className="text-xs text-slate-400">
            Escalation workflows, technician dispatch, root cause logs, and downtime records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-950 text-red-400 border border-red-800/60 font-bold">
            1 Critical Active
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Ticket ID, Title, Assignee, or Asset Tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="WAITING_FOR_PARTS">WAITING_FOR_PARTS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Datatable */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Incident Specifics</th>
              <th className="p-3">Location & Asset</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Technician Assigned</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredTickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-950/40 transition-colors">
                <td className="p-3 font-mono font-bold text-red-400">
                  <div className="flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.ticketNumber}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">{t.createdAt}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-white max-w-sm">{t.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.issueCategory}</div>
                </td>
                <td className="p-3">
                  <div className="text-slate-200">{t.labRoom}</div>
                  {t.assetTag && (
                    <div className="text-[10px] font-mono text-cyan-400 font-semibold">{t.assetTag}</div>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      t.priority === 'CRITICAL'
                        ? 'bg-red-950 text-red-300 border border-red-700/60 animate-pulse'
                        : t.priority === 'HIGH'
                        ? 'bg-orange-950 text-orange-300 border border-orange-700/60'
                        : t.priority === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                        : 'bg-blue-950 text-blue-300 border border-blue-700/60'
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="p-3">
                  <span className="font-mono text-[11px] text-slate-300">{t.status}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.assignedToName}</span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      alert(`Opening Resolution & Corrective Action dialog for ${t.ticketNumber}`);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-medium border border-slate-700 transition-colors cursor-pointer"
                  >
                    Triage / Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
