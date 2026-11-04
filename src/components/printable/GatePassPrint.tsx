import React from 'react';
import { InstitutionalHeader } from './InstitutionalHeader';

export interface GatePassPrintData {
  gatePassNumber: string;
  passType: string;
  reason: string;
  destinationAddress: string;
  carrierName: string;
  carrierContact: string;
  vehiclePlateNumber: string;
  status: string;
  dateCreated: string;
  items: Array<{
    itemDescription: string;
    serialNumber: string;
    quantity: number;
    remarks: string;
  }>;
  requestedByName: string;
  headEndorsedName: string;
  deanApprovedName: string;
  securityGuardOutName?: string;
  securityGuardInName?: string;
  loggedOutAt?: string;
  loggedInAt?: string;
}

export function GatePassPrint({ data }: { data: GatePassPrintData }) {
  return (
    <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto font-sans text-xs">
      {/* Institutional Header */}
      <InstitutionalHeader
        formTitle="OFFICIAL PROPERTY PULL-OUT CLEARANCE / GATE PASS"
        formControlNumber="ACLC-MIS-GP-04"
      />

      {/* Control Reference & Type Bar */}
      <div className="flex justify-between items-center mb-3 text-xs bg-slate-50 p-2 border border-slate-300 rounded print:border-black print:bg-transparent">
        <div>
          <span className="font-bold">GATE PASS CONTROL NO:</span>{' '}
          <span className="font-mono font-bold text-red-700 print:text-black text-sm">
            {data.gatePassNumber}
          </span>
        </div>
        <div>
          <span className="font-bold">PASS TYPE:</span>{' '}
          <span className="font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-400 print:border-black print:text-black">
            {data.passType}
          </span>
        </div>
        <div>
          <span className="font-bold">APPROVAL STATUS:</span>{' '}
          <span className="font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-400 print:border-black print:text-black">
            {data.status}
          </span>
        </div>
      </div>

      {/* Dispatch Logistics & Authorization */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden print:border-black">
        <div className="bg-slate-200 px-3 py-1 font-bold text-slate-800 text-[11px] uppercase border-b border-slate-300 print:bg-slate-100 print:border-black">
          I. Transport Logistics & Facility Destination
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 text-[11px]">
          <div className="col-span-2 sm:col-span-3">
            <span className="text-slate-500 font-semibold block">Official Justification / Reason:</span>
            <span className="font-semibold text-slate-900">{data.reason}</span>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <span className="text-slate-500 font-semibold block">Destination Facility / Vendor Address:</span>
            <span className="font-mono text-slate-900">{data.destinationAddress}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Designated Carrier / Driver:</span>
            <span className="font-bold text-slate-900">{data.carrierName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Carrier Contact No:</span>
            <span className="font-mono text-slate-900">{data.carrierContact}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Vehicle Transport Plate:</span>
            <span className="font-mono font-bold text-slate-900">{data.vehiclePlateNumber}</span>
          </div>
        </div>
      </div>

      {/* Serialized Items Table */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden print:border-black">
        <div className="bg-slate-200 px-3 py-1 font-bold text-slate-800 text-[11px] uppercase border-b border-slate-300 print:bg-slate-100 print:border-black">
          II. Inventory Description of Pulled-Out Property
        </div>
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 print:border-black">
              <th className="p-2 border-r border-slate-300 w-12 text-center print:border-black">Qty</th>
              <th className="p-2 border-r border-slate-300 print:border-black">Item Description, Brand & Model</th>
              <th className="p-2 border-r border-slate-300 print:border-black">Hardware Serial No / Asset Tag</th>
              <th className="p-2">Technical Defect / Transfer Reason</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-200 print:border-black">
                <td className="p-2 border-r border-slate-300 text-center font-bold print:border-black">
                  {item.quantity}
                </td>
                <td className="p-2 border-r border-slate-300 font-semibold print:border-black">
                  {item.itemDescription}
                </td>
                <td className="p-2 border-r border-slate-300 font-mono text-[10px] print:border-black">
                  {item.serialNumber}
                </td>
                <td className="p-2 text-slate-700 print:text-black text-[10px]">
                  {item.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4-Tier Signatory Authorization Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t-2 border-slate-300 print:border-black text-[10px]">
        {/* Tier 1: Requester */}
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">1. Requested By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {data.requestedByName}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">IT Custodian / Technician</div>
        </div>

        {/* Tier 2: Lab Head */}
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">2. Endorsed By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {data.headEndorsedName}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Head, Computer Studies Labs</div>
        </div>

        {/* Tier 3: Dean / Campus Director */}
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-4">3. Approved By</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {data.deanApprovedName}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">College Dean / Campus Director</div>
        </div>

        {/* Tier 4: Campus Security Guardhouse */}
        <div className="flex flex-col justify-between text-center border-2 border-red-800 bg-red-50/50 p-2 rounded print:border-black print:bg-transparent">
          <div className="text-red-900 font-bold uppercase mb-2">4. Guardhouse Exit Stamp</div>
          <div className="text-[9px] text-slate-700 space-y-0.5 text-left font-mono">
            <div>SG: <b>{data.securityGuardOutName || 'SG R. Mendoza'}</b></div>
            <div>OUT: <b>{data.loggedOutAt || '17:02:40 PST'}</b></div>
            <div>IN: <b>{data.loggedInAt || 'PENDING RETURN'}</b></div>
          </div>
          <div className="text-[8px] text-red-700 uppercase font-bold mt-1 border-t border-red-300 pt-0.5">
            CAMPUS SECURITY VERIFIED
          </div>
        </div>
      </div>
    </div>
  );
}
