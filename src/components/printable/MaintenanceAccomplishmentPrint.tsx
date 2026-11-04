import React from 'react';
import { InstitutionalHeader } from './InstitutionalHeader';

export function MaintenanceAccomplishmentPrint() {
  const accomplishments = [
    {
      date: '2026-11-01',
      facility: 'Lab 1 (Rm 301)',
      taskCategory: 'PREVENTIVE_MAINTENANCE',
      description: 'High-pressure dust blower cleaning for 40 workstation towers, GPU fan de-dusting, and power surge strip verification.',
      technician: 'Mark Alvin Santos',
      downtimeMinutes: 0,
      remarks: 'Conducted during Sunday maintenance window; zero class disruption.',
    },
    {
      date: '2026-11-02',
      facility: 'Lab 2 (Rm 302)',
      taskCategory: 'SOFTWARE_DEPLOYMENT',
      description: 'Rolled out Python 3.12, VS Code, and PostgreSQL 16 client tools across 40 nodes via institutional PowerShell remote sweep.',
      technician: 'Mark Alvin Santos',
      downtimeMinutes: 0,
      remarks: 'Automated push completed in 42 minutes.',
    },
    {
      date: '2026-11-03',
      facility: 'Lab 1 (Rm 301)',
      taskCategory: 'CORRECTIVE_REPAIR',
      description: 'Investigated TKT-2026-4081 (WS-01 4-beep fault). Cleaned DIMM slot contacts and reseated RAM module. MemTest86 100% passed.',
      technician: 'Mark Alvin Santos',
      downtimeMinutes: 45,
      remarks: 'Machine returned to operational pool within 45 minutes.',
    },
    {
      date: '2026-11-03',
      facility: 'Lab 3 (Rm 304)',
      taskCategory: 'CABLING_RESTRUCTURE',
      description: 'Recrimped and replaced 8 frayed patch cables in Rack A using Belden Cat6 UTP and gold-plated AMP RJ45 connectors.',
      technician: 'Joshua Villanueva (SA)',
      downtimeMinutes: 15,
      remarks: 'Cable continuity verified with Fluke tester; packet loss eliminated.',
    },
  ];

  return (
    <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto font-sans text-xs">
      <InstitutionalHeader
        formTitle="COMPUTER LABORATORY MAINTENANCE ACCOMPLISHMENT & PREVENTIVE SERVICING LOG"
        formControlNumber="ACLC-CCS-AL-09"
      />

      <div className="flex justify-between items-center mb-3 text-xs bg-slate-50 p-2 border border-slate-300 rounded print:border-black print:bg-transparent">
        <div>
          <span className="font-bold">MONTHLY PERIOD:</span>{' '}
          <span className="font-mono font-bold text-blue-900 print:text-black">
            NOVEMBER 2026 &bull; 1ST TRIMESTER
          </span>
        </div>
        <div>
          <span className="font-bold">CAMPUS:</span>{' '}
          <span className="font-mono font-bold">MANILA MAIN (QUIAPO)</span>
        </div>
      </div>

      {/* Accomplishments Table */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden print:border-black">
        <div className="bg-slate-200 px-3 py-1 font-bold text-slate-800 text-[11px] uppercase border-b border-slate-300 print:bg-slate-100 print:border-black">
          I. Servicing Logs, Preventive Cleaning & Corrective Maintenance Accomplishments
        </div>
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 print:border-black">
              <th className="p-2 border-r border-slate-300 w-24 print:border-black">Date</th>
              <th className="p-2 border-r border-slate-300 w-28 print:border-black">Room / Facility</th>
              <th className="p-2 border-r border-slate-300 print:border-black">Accomplishment Details & Tasks Performed</th>
              <th className="p-2 border-r border-slate-300 w-32 print:border-black">Servicing Staff</th>
              <th className="p-2 border-r border-slate-300 w-20 text-center print:border-black">Downtime</th>
              <th className="p-2 w-36">Technical Remarks</th>
            </tr>
          </thead>
          <tbody>
            {accomplishments.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-200 print:border-black">
                <td className="p-2 border-r border-slate-300 font-mono text-[10px] print:border-black">
                  {item.date}
                </td>
                <td className="p-2 border-r border-slate-300 font-semibold print:border-black">
                  {item.facility}
                </td>
                <td className="p-2 border-r border-slate-300 print:border-black leading-tight">
                  <div className="font-semibold text-slate-900">{item.taskCategory}</div>
                  <div className="text-slate-700 mt-0.5">{item.description}</div>
                </td>
                <td className="p-2 border-r border-slate-300 text-[10px] font-medium print:border-black">
                  {item.technician}
                </td>
                <td className="p-2 border-r border-slate-300 text-center font-mono font-bold print:border-black">
                  {item.downtimeMinutes > 0 ? (
                    <span className="text-red-700 print:text-black">{item.downtimeMinutes}m</span>
                  ) : (
                    <span className="text-emerald-700 print:text-black">0m</span>
                  )}
                </td>
                <td className="p-2 text-[10px] text-slate-600 print:text-black">
                  {item.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
        <div className="p-2.5 rounded bg-slate-50 border border-slate-300 print:border-black print:bg-transparent">
          <div className="text-slate-500 font-semibold">Total Preventive Tasks</div>
          <div className="text-lg font-bold font-mono text-blue-900 print:text-black">84 Workstations Serviced</div>
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-300 print:border-black print:bg-transparent">
          <div className="text-slate-500 font-semibold">Corrective Incidents Resolved</div>
          <div className="text-lg font-bold font-mono text-emerald-800 print:text-black">3 Tickets Closed</div>
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-300 print:border-black print:bg-transparent">
          <div className="text-slate-500 font-semibold">Total Operational Downtime</div>
          <div className="text-lg font-bold font-mono text-red-700 print:text-black">60 Minutes Cumulative</div>
        </div>
      </div>

      {/* Signatory Matrix */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t-2 border-slate-300 print:border-black text-[10px]">
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">Submitted By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            Mark Alvin Santos
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Laboratory Maintenance Technician</div>
        </div>

        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">Verified By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            Marilou Dela Cruz
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">IT Property & Lab Custodian</div>
        </div>

        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">Approved By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            Prof. Reynaldo Bautista, MSCS
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Head, Computer Studies Laboratories</div>
        </div>
      </div>
    </div>
  );
}
