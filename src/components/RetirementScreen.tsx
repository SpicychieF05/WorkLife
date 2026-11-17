import React from 'react';
import { FlightState } from '../types/game';
import { formatPackage } from '../game/companies';
import { RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

interface RetirementScreenProps {
  flight: FlightState;
  onRestart: () => void;
  onChangeTrack: () => void;
  onViewRelievingSlip: () => void;
}

export const RetirementScreen: React.FC<RetirementScreenProps> = ({
  flight,
  onRestart,
  onChangeTrack,
  onViewRelievingSlip
}) => {
  return (
    <div className="absolute inset-0 safe-area-pad flex items-center justify-center p-3 sm:p-6 bg-[#0f172a] text-white z-30 overflow-y-auto">
      <div className="@container w-full max-w-xl flex flex-col gap-4 sm:gap-5 text-center my-auto animate-in zoom-in-95 duration-300">
        
        {/* Retirement Crimson Banner */}
        <div className="bg-[#b91c1c] text-white py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl shadow-xl border border-red-700/60 font-black tracking-wide text-[clamp(1rem,3.4vw,1.5rem)] uppercase">
          Retired at 60. No pension.
        </div>

        {/* Hero Card */}
        <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl p-4 sm:p-8 flex flex-col gap-4 sm:gap-5 shadow-2xl text-slate-200 text-left">
          
          <div className="flex items-start sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-indigo-400 uppercase font-bold block">
                FULL 75-SECOND WORKING LIFE COMPLETED
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5 break-words">
                {flight.candidateName}
              </h2>
              <p className="text-xs text-indigo-300 font-mono tracking-wide mt-0.5 break-words">
                {flight.targetRole}
              </p>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 size={24} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
            <div className="bg-slate-900/70 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">AGE</span>
              <span className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">60.0</span>
            </div>
            <div className="bg-slate-900/70 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">YEARS</span>
              <span className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">38</span>
            </div>
            <div className="bg-slate-900/70 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">COMPANIES</span>
              <span className="text-lg sm:text-xl font-bold text-indigo-400 font-mono tabular-nums">{flight.score}</span>
            </div>
            <div className="bg-slate-900/70 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">FINAL CTC</span>
              <span className="text-[clamp(0.875rem,2.4vw,1.125rem)] font-bold text-emerald-400 font-mono tabular-nums break-words block">
                {formatPackage(flight.packageLPA)}
              </span>
            </div>
          </div>

          {/* Satirical Corporate Adieu */}
          <div className="bg-slate-900/50 border border-slate-800 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed italic">
            &ldquo;Thank you for dedicating 38 sprint cycles to the release backlog. Management acknowledges your contributions. Please surrender your company laptop, NFC keycard, and coffee tumbler at the ground-floor security turnstile before 5:00 PM today.&rdquo;
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 pt-1 sm:pt-2">
            <button
              onClick={onRestart}
              className="w-full min-h-[44px] py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>Start another career</span>
            </button>

            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5">
              <button
                onClick={onViewRelievingSlip}
                className="min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText size={15} />
                <span>Relieving Letter</span>
              </button>

              <button
                onClick={onChangeTrack}
                className="min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Change Track
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
