import React from 'react';
import { Clock, Calendar, CheckCircle, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export function LabTimetableSchedule() {
  const schedules = [
    {
      labCode: 'LAB-1',
      labName: 'Multimedia Lab (Rm 301)',
      status: 'OCCUPIED' as const,
      subjectCode: 'CC103',
      subjectTitle: 'Data Structures & Algorithms Laboratory',
      section: 'BSIT-2A',
      faculty: 'Prof. Reynaldo Bautista, MSCS',
      timeSlot: '16:00 - 18:00 PST',
      progressPercent: 65,
      nextWindow: 'Vacant starting 18:00 (Open Student Practice)',
    },
    {
      labCode: 'LAB-2',
      labName: 'Software Engineering Lab (Rm 302)',
      status: 'VACANT_WINDOW' as const,
      subjectCode: 'NO CLASS IN SESSION',
      subjectTitle: 'Scheduled Preventive Maintenance Window',
      section: 'Technician Reserved',
      faculty: 'Mark Alvin Santos (IT Tech on Duty)',
      timeSlot: '16:30 - 18:30 PST',
      progressPercent: 30,
      nextWindow: 'Next Class: IT401 Capstone (18:30 - 21:00)',
    },
    {
      labCode: 'LAB-3',
      labName: 'Cisco Networking Lab (Rm 304)',
      status: 'OCCUPIED' as const,
      subjectCode: 'NET301',
      subjectTitle: 'Cisco CCNA Routing & Switching Practice',
      section: 'BSCS-3B',
      faculty: 'Prof. Cristine Mendoza, MIT',
      timeSlot: '15:00 - 18:00 PST',
      progressPercent: 75,
      nextWindow: 'Vacant starting 18:00 (Hardware Blower Sweeps)',
    },
  ];

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">
              Laboratory Utilization & Class Timetable Integration
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time timetable synchronization for determining vacant windows for technician servicing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/50">
          <Clock className="w-3.5 h-3.5" />
          <span>Current Time: 17:16 PST (1st Trimester)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schedules.map((item) => (
          <div
            key={item.labCode}
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              item.status === 'VACANT_WINDOW'
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-white">{item.labName}</span>
                {item.status === 'VACANT_WINDOW' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/60 animate-pulse">
                    🟢 VACANT WINDOW
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                    🔴 CLASS IN SESSION
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-white mt-1">
                {item.subjectCode} - {item.subjectTitle}
              </div>

              <div className="text-xs text-slate-300 mt-2 space-y-1">
                <div>
                  <span className="text-slate-500">Section:</span>{' '}
                  <span className="font-semibold text-slate-200">{item.section}</span>
                </div>
                <div>
                  <span className="text-slate-500">Instructor:</span>{' '}
                  <span className="text-slate-200">{item.faculty}</span>
                </div>
                <div>
                  <span className="text-slate-500">Time Window:</span>{' '}
                  <span className="font-mono text-cyan-300">{item.timeSlot}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400">Next Utilization:</span>
              <div className="font-medium text-slate-300 truncate">{item.nextWindow}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
