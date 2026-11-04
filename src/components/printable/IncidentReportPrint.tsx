import React from 'react';
import { InstitutionalHeader } from './InstitutionalHeader';

export interface IncidentReportPrintData {
  ticketNumber: string;
  laboratoryName: string;
  assetTag: string;
  reportedByName: string;
  dateReported: string;
  priority: string;
  issueCategory: string;
  incidentTitle: string;
  incidentDescription: string;
  technicianAssigned: string;
  rootCause: string;
  correctiveAction: string;
  downtimeMinutes: number;
  partsReplaced?: string;
  dateResolved: string;
  status: string;
  supervisorName: string;
}

export function IncidentReportPrint({ data }: { data: IncidentReportPrintData }) {
  return (
    <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto font-sans text-xs">
      <InstitutionalHeader
        formTitle="LABORATORY INCIDENT & CORRECTIVE MAINTENANCE ACCOMPLISHMENT REPORT"
        formControlNumber="ACLC-CCS-IR-07"
      />

      {/* Control Info Bar */}
      <div className="flex justify-between items-center mb-3 text-xs bg-slate-50 p-2 border border-slate-300 rounded print:border-black print:bg-transparent">
        <div>
          <span className="font-bold">INCIDENT TICKET NO:</span>{' '}
          <span className="font-mono font-bold text-red-700 text-sm print:text-black">
            {data.ticketNumber}
          </span>
        </div>
        <div>
          <span className="font-bold">SEVERITY PRIORITY:</span>{' '}
          <span className="font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-300 print:border-black print:text-black">
            {data.priority}
          </span>
        </div>
        <div>
          <span className="font-bold">RESOLUTION:</span>{' '}
          <span className="font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 print:border-black print:text-black">
            {data.status}
          </span>
        </div>
      </div>

      {/* Section 1: Incident Specifics */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden print:border-black">
        <div className="bg-slate-200 px-3 py-1 font-bold text-slate-800 text-[11px] uppercase border-b border-slate-300 print:bg-slate-100 print:border-black">
          I. Incident Identification & Equipment Location
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 text-[11px]">
          <div>
            <span className="text-slate-500 font-semibold block">Laboratory Facility:</span>
            <span className="font-bold text-slate-900">{data.laboratoryName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Target Asset Tag:</span>
            <span className="font-mono font-bold text-blue-900 print:text-black">{data.assetTag}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Reported By:</span>
            <span className="font-bold text-slate-900">{data.reportedByName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Date / Time Logged:</span>
            <span className="font-mono text-slate-900">{data.dateReported}</span>
          </div>
          <div className="col-span-2 sm:col-span-4 pt-1 border-t border-slate-200">
            <span className="text-slate-500 font-semibold block">Incident Title:</span>
            <span className="font-bold text-slate-900">{data.incidentTitle}</span>
          </div>
          <div className="col-span-2 sm:col-span-4">
            <span className="text-slate-500 font-semibold block">Detailed Symptom / Error Manifestation:</span>
            <span className="text-slate-800 leading-relaxed">{data.incidentDescription}</span>
          </div>
        </div>
      </div>

      {/* Section 2: Technical Triage & Resolution */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden print:border-black">
        <div className="bg-slate-200 px-3 py-1 font-bold text-slate-800 text-[11px] uppercase border-b border-slate-300 print:bg-slate-100 print:border-black">
          II. Technical Diagnosis, Corrective Servicing & Downtime
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 text-[11px]">
          <div>
            <span className="text-slate-500 font-semibold block">Servicing IT Technician:</span>
            <span className="font-bold text-slate-900">{data.technicianAssigned}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Date / Time Completed:</span>
            <span className="font-mono text-slate-900">{data.dateResolved}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Equipment Downtime:</span>
            <span className="font-mono font-bold text-red-700 print:text-black">{data.downtimeMinutes} Minutes</span>
          </div>
          <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200">
            <span className="text-slate-500 font-semibold block">Root Cause Analysis:</span>
            <span className="font-medium text-slate-900">{data.rootCause}</span>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <span className="text-slate-500 font-semibold block">Corrective Action Implemented:</span>
            <span className="font-medium text-slate-900">{data.correctiveAction}</span>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <span className="text-slate-500 font-semibold block">Consumable Parts Replaced / Deducted:</span>
            <span className="font-mono text-slate-900">{data.partsReplaced || 'None (Serviced through firmware / software repair)'}</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t-2 border-slate-300 print:border-black text-[10px]">
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-6">Serviced By (Technician)</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {data.technicianAssigned}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Laboratory Technician &bull; Date</div>
        </div>

        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-6">Verified By (Lab Custodian)</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            Marilou Dela Cruz
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">IT Property Custodian &bull; Date</div>
        </div>

        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-6">Approved By (Laboratory Head)</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {data.supervisorName}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Head, Computer Studies Laboratories</div>
        </div>
      </div>
    </div>
  );
}
