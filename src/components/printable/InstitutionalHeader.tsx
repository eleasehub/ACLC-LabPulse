import React from 'react';
import { Layers } from 'lucide-react';

interface InstitutionalHeaderProps {
  formTitle: string;
  formControlNumber: string;
  revisionNumber?: string;
  effectiveDate?: string;
}

export function InstitutionalHeader({
  formTitle,
  formControlNumber,
  revisionNumber = 'Rev. 02',
  effectiveDate = 'November 2026',
}: InstitutionalHeaderProps) {
  return (
    <div className="border-b-2 border-slate-900 pb-3 mb-4 text-slate-900 font-sans">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Seal / Emblem */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/ACLC_3c4418b0.png"
            alt="ACLC College Manila Official Seal"
            className="w-14 h-14 object-contain rounded-full border-2 border-blue-900 bg-white p-0.5 shadow-sm print:border-black flex-shrink-0"
          />
          <div>
            <div className="text-base font-extrabold tracking-tight text-blue-950 uppercase print:text-black">
              ACLC COLLEGE OF MANILA
            </div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide print:text-black">
              COLLEGE OF COMPUTER STUDIES &bull; IT DEPARTMENT
            </div>
            <div className="text-[10px] text-slate-500 print:text-black">
              Evangelista St., Quiapo / Manila Main Campus &bull; contact: itsupport@aclc-manila.edu.ph
            </div>
          </div>
        </div>

        {/* Right: Document Control Box */}
        <div className="text-right border border-slate-400 rounded p-1.5 text-[9px] font-mono leading-tight bg-slate-50 print:bg-transparent print:border-black">
          <div><b className="text-slate-800 print:text-black">DOC NO:</b> {formControlNumber}</div>
          <div><b className="text-slate-800 print:text-black">REVISION:</b> {revisionNumber}</div>
          <div><b className="text-slate-800 print:text-black">EFFECTIVE:</b> {effectiveDate}</div>
          <div className="text-blue-900 font-bold uppercase print:text-black mt-0.5">ACLC-QMS VERIFIED</div>
        </div>
      </div>

      {/* Form Document Banner */}
      <div className="mt-3 text-center border-t border-b border-slate-300 py-1 bg-slate-100 print:bg-transparent print:border-black">
        <h1 className="text-base font-black uppercase tracking-wider text-slate-900">
          {formTitle}
        </h1>
      </div>
    </div>
  );
}
