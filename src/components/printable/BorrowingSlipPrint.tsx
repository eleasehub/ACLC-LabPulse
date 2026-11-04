import React from 'react';
import { InstitutionalHeader } from './InstitutionalHeader';

export interface BorrowingSlipData {
  requestNumber: string;
  borrowerName: string;
  borrowerIdNumber: string;
  borrowerType: string;
  borrowerEmail: string;
  borrowerPhone: string;
  department: string;
  purpose: string;
  intendedRoom: string;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: string;
  items: Array<{
    itemDescription: string;
    serialOrTag: string;
    quantity: number;
    conditionOnCheckout: string;
    conditionOnReturn?: string;
    remarks?: string;
  }>;
  custodianName: string;
  labHeadName: string;
}

export function BorrowingSlipPrint({ data }: { data: BorrowingSlipData }) {
  return (
    <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto font-sans text-xs">
      {/* Official Header */}
      <InstitutionalHeader
        formTitle="EQUIPMENT BORROWING SLIP & ACCOUNTABILITY UNDERTAKING"
        formControlNumber="ACLC-CCS-EBS-01"
      />

      {/* Control Reference & Status Bar */}
      <div className="flex justify-between items-center mb-3 text-xs bg-slate-50 p-2 border border-slate-300 rounded print:border-black print:bg-transparent">
        <div>
          <span className="font-bold">SLIP REFERENCE NO:</span>{' '}
          <span className="font-mono font-bold text-blue-900 print:text-black">
            {data.requestNumber}
          </span>
        </div>
        <div>
          <span className="font-bold">ISSUANCE STATUS:</span>{' '}
          <span className="font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-200 border border-slate-400 print:border-black">
            {data.status}
          </span>
        </div>
      </div>

      {/* Borrower Information Grid */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden print:border-black">
        <div className="bg-slate-200 px-3 py-1 font-bold text-slate-800 text-[11px] uppercase border-b border-slate-300 print:bg-slate-100 print:border-black">
          I. Borrower Identification & Instructional Purpose
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 text-[11px]">
          <div>
            <span className="text-slate-500 font-semibold block">Full Name:</span>
            <span className="font-bold text-slate-900">{data.borrowerName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Institutional ID No:</span>
            <span className="font-mono font-bold text-slate-900">{data.borrowerIdNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Classification:</span>
            <span className="font-bold text-slate-900">{data.borrowerType}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Department / Program:</span>
            <span className="font-medium text-slate-900">{data.department}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Contact Number:</span>
            <span className="font-mono text-slate-900">{data.borrowerPhone}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Institutional Email:</span>
            <span className="font-mono text-slate-900">{data.borrowerEmail}</span>
          </div>
          <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200 print:border-slate-300">
            <span className="text-slate-500 font-semibold block">Stated Academic / Instructional Purpose:</span>
            <span className="font-medium text-slate-900">{data.purpose}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Intended Venue / Room:</span>
            <span className="font-bold text-slate-900">{data.intendedRoom}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Date / Time Borrowed:</span>
            <span className="font-mono font-bold text-slate-900">{data.borrowDate}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Mandatory Return Deadline:</span>
            <span className="font-mono font-bold text-red-700 print:text-black">{data.expectedReturnDate}</span>
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="border border-slate-300 rounded mb-4 overflow-hidden print:border-black">
        <div className="bg-slate-200 px-3 py-1 font-bold text-slate-800 text-[11px] uppercase border-b border-slate-300 print:bg-slate-100 print:border-black">
          II. Inventory Items & Condition Assessment Checklist
        </div>
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 print:border-black">
              <th className="p-2 border-r border-slate-300 w-12 text-center print:border-black">Qty</th>
              <th className="p-2 border-r border-slate-300 print:border-black">Item Description & Specifications</th>
              <th className="p-2 border-r border-slate-300 print:border-black">Asset Tag / Serial No</th>
              <th className="p-2 border-r border-slate-300 print:border-black">Checkout Cond.</th>
              <th className="p-2 border-r border-slate-300 print:border-black">Return Cond.</th>
              <th className="p-2">Inspector Remarks</th>
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
                  {item.serialOrTag || 'N/A'}
                </td>
                <td className="p-2 border-r border-slate-300 font-medium text-emerald-800 print:text-black print:border-black">
                  {item.conditionOnCheckout}
                </td>
                <td className="p-2 border-r border-slate-300 font-medium print:border-black">
                  {item.conditionOnReturn || 'PENDING CHECKIN'}
                </td>
                <td className="p-2 text-slate-600 print:text-black text-[10px]">
                  {item.remarks || 'Standard academic usage'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terms & Conditions Undertaking */}
      <div className="p-2.5 bg-slate-50 border border-slate-300 rounded mb-4 text-[9.5px] leading-tight text-slate-700 print:border-black print:bg-transparent">
        <span className="font-bold text-slate-900 block mb-0.5">INSTITUTIONAL TERMS OF LIABILITY & UNDERTAKING:</span>
        1. The borrower assumes full custodial and financial responsibility for the equipment from physical checkout until signed return clearance.<br />
        2. Any physical defect, missing accessory, or internal damage incurred during borrowing shall be charged to the borrower according to institutional replacement cost.<br />
        3. Unauthorized transfer of equipment to third parties is strictly prohibited under ACLC Manila Laboratory Code of Discipline.
      </div>

      {/* 3-Tier Signatory Matrix */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t-2 border-slate-300 print:border-black text-[10px]">
        {/* Borrower */}
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-6">Borrower / Signatory</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {data.borrowerName}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Signature over Printed Name &bull; Date</div>
        </div>

        {/* Custodian */}
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-6">Released By (Lab Custodian)</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {data.custodianName}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">IT Property & Lab Custodian &bull; Date</div>
        </div>

        {/* Lab Head */}
        <div className="flex flex-col justify-between text-center border border-slate-200 p-2 rounded print:border-black">
          <div className="text-slate-500 font-semibold uppercase mb-6">Approved By (Laboratory Head)</div>
          <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 uppercase">
            {data.labHeadName}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">Head, Computer Studies Laboratories</div>
        </div>
      </div>
    </div>
  );
}
