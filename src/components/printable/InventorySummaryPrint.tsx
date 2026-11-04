import React from 'react';
import { InstitutionalHeader } from './InstitutionalHeader';

export interface LabInventorySummaryItem {
  facility: string;
  roomCode: string;
  totalWorkstations: number;
  operationalCount: number;
  offlineCount: number;
  acquisitionCostPhp: number;
  currentBookValuePhp: number;
  depreciationRate: string;
}

export function InventorySummaryPrint() {
  const labData: LabInventorySummaryItem[] = [
    {
      facility: 'Multimedia & Game Development Laboratory',
      roomCode: 'Lab 1 (Rm 301)',
      totalWorkstations: 40,
      operationalCount: 38,
      offlineCount: 2,
      acquisitionCostPhp: 2400000.0,
      currentBookValuePhp: 1680000.0,
      depreciationRate: '30% (Yr 2 of 5)',
    },
    {
      facility: 'Software Engineering & Databases Laboratory',
      roomCode: 'Lab 2 (Rm 302)',
      totalWorkstations: 40,
      operationalCount: 39,
      offlineCount: 1,
      acquisitionCostPhp: 2000000.0,
      currentBookValuePhp: 1400000.0,
      depreciationRate: '30% (Yr 2 of 5)',
    },
    {
      facility: 'Cisco Networking & Systems Administration Lab',
      roomCode: 'Lab 3 (Rm 304)',
      totalWorkstations: 35,
      operationalCount: 33,
      offlineCount: 2,
      acquisitionCostPhp: 2275000.0,
      currentBookValuePhp: 1820000.0,
      depreciationRate: '20% (Yr 1 of 5)',
    },
    {
      facility: 'IT Custodian Office & MIS Server Center',
      roomCode: 'Rm 305',
      totalWorkstations: 10,
      operationalCount: 10,
      offlineCount: 0,
      acquisitionCostPhp: 850000.0,
      currentBookValuePhp: 680000.0,
      depreciationRate: '20% (Yr 1 of 5)',
    },
  ];

  const totalUnits = labData.reduce((acc, curr) => acc + curr.totalWorkstations, 0);
  const totalOperational = labData.reduce((acc, curr) => acc + curr.operationalCount, 0);
  const totalAcquisition = labData.reduce((acc, curr) => acc + curr.acquisitionCostPhp, 0);
  const totalBookValue = labData.reduce((acc, curr) => acc + curr.currentBookValuePhp, 0);

  return (
    <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto font-sans text-xs">
      <InstitutionalHeader
        formTitle="INSTITUTIONAL IT ASSET INVENTORY SUMMARY & CAPITAL VALUATION REPORT"
        formControlNumber="ACLC-MIS-AR-12"
      />

      <div className="flex justify-between items-center mb-3 text-xs bg-slate-50 p-2 border border-slate-300 rounded print:border-black print:bg-transparent">
        <div>
          <span className="font-bold">AUDIT PERIOD:</span>{' '}
          <span className="font-mono font-bold text-blue-900 print:text-black">
            ACADEMIC YEAR 2026-2027 &bull; 1ST TRIMESTER
          </span>
        </div>
        <div>
          <span className="font-bold">INSPECTION DATE:</span>{' '}
          <span className="font-mono font-bold">November 03, 2026</span>
        </div>
      </div>

      {/* Summary Table */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden print:border-black">
        <div className="bg-slate-200 px-3 py-1 font-bold text-slate-800 text-[11px] uppercase border-b border-slate-300 print:bg-slate-100 print:border-black">
          I. Facility Hardware Allocation & Capital Valuation Summary
        </div>
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 print:border-black">
              <th className="p-2 border-r border-slate-300 print:border-black">Facility / Laboratory Room</th>
              <th className="p-2 border-r border-slate-300 text-center print:border-black">Workstations</th>
              <th className="p-2 border-r border-slate-300 text-center print:border-black">Operational</th>
              <th className="p-2 border-r border-slate-300 text-center print:border-black">Offline / Service</th>
              <th className="p-2 border-r border-slate-300 text-right print:border-black">Acquisition Cost (PHP)</th>
              <th className="p-2 text-right">Net Book Value (PHP)</th>
            </tr>
          </thead>
          <tbody>
            {labData.map((lab, idx) => (
              <tr key={idx} className="border-b border-slate-200 print:border-black">
                <td className="p-2 border-r border-slate-300 font-semibold print:border-black">
                  <div>{lab.facility}</div>
                  <div className="text-[10px] font-mono text-slate-500">{lab.roomCode}</div>
                </td>
                <td className="p-2 border-r border-slate-300 text-center font-mono font-bold print:border-black">
                  {lab.totalWorkstations}
                </td>
                <td className="p-2 border-r border-slate-300 text-center font-mono text-emerald-800 font-bold print:text-black print:border-black">
                  {lab.operationalCount}
                </td>
                <td className="p-2 border-r border-slate-300 text-center font-mono text-red-700 font-bold print:text-black print:border-black">
                  {lab.offlineCount}
                </td>
                <td className="p-2 border-r border-slate-300 text-right font-mono print:border-black">
                  ₱{lab.acquisitionCostPhp.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-2 text-right font-mono font-bold">
                  ₱{lab.currentBookValuePhp.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {/* Totals Row */}
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 print:border-black">
              <td className="p-2 border-r border-slate-300 uppercase print:border-black">
                Institutional Total
              </td>
              <td className="p-2 border-r border-slate-300 text-center font-mono print:border-black">
                {totalUnits} Units
              </td>
              <td className="p-2 border-r border-slate-300 text-center font-mono text-emerald-800 print:text-black print:border-black">
                {totalOperational}
              </td>
              <td className="p-2 border-r border-slate-300 text-center font-mono text-red-700 print:text-black print:border-black">
                {totalUnits - totalOperational}
              </td>
              <td className="p-2 border-r border-slate-300 text-right font-mono print:border-black">
                ₱{totalAcquisition.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="p-2 text-right font-mono text-blue-900 print:text-black">
                ₱{totalBookValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Auditor Observations */}
      <div className="p-3 bg-slate-50 border border-slate-300 rounded mb-6 text-[10px] leading-relaxed text-slate-700 print:border-black print:bg-transparent">
        <span className="font-bold text-slate-900 block mb-1">AUDITOR OBSERVATIONS & REPLACEMENT RECOMMENDATIONS:</span>
        1. Lab 1 (Multimedia Lab) maintains a 95% operational coefficient; two Dell OptiPlex workstations are currently undergoing authorized warranty repair under Gate Pass GP-2026-0019.<br />
        2. Lab 3 Cisco equipment has been successfully re-certified for CCNA coursework; zero lost or unaccounted assets detected during physical audit.<br />
        3. All hardware assets bear official high-durability QR code identifiers linked to the centralized LabPulse database.
      </div>

      {/* 4-Tier Signatory Block */}
      <div className="grid grid-cols-4 gap-3 pt-2 border-t-2 border-slate-300 print:border-black text-[10px]">
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">Prepared By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            Marilou Dela Cruz
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">IT Property Custodian</div>
        </div>

        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">Verified By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            Prof. Reynaldo Bautista
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Head, Computer Studies Labs</div>
        </div>

        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">Endorsed By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            Engr. Danica Flores
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">MIS Director / College Dean</div>
        </div>

        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">Approved By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            Dr. Evelyn Perez
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Campus Director / VP Academics</div>
        </div>
      </div>
    </div>
  );
}
