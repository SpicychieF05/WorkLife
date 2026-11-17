import React from 'react';
import { CorporateEvent, FlightState } from '../types/game';
import { formatPackage } from '../game/companies';
import { Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';

interface HUDProps {
  flight: FlightState;
  activeEvent: CorporateEvent | null;
  soundEnabled: boolean;
  onPause: () => void;
  onToggleSound: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  flight,
  activeEvent,
  soundEnabled,
  onPause,
  onToggleSound
}) => {
  const age = Math.min(60, Math.max(22, flight.age));
  const progressPercent = Math.min(100, Math.max(0, ((age - 22) / 38) * 100));

  return (
    <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 pointer-events-none z-20 flex flex-col gap-2">
      {/* Top Stat Bar */}
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md rounded-xl px-3.5 py-2 pointer-events-auto">
        
        {/* Left: Age & Progress */}
        <div className="flex flex-col gap-1 min-w-[120px] sm:min-w-[170px]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="tracking-wide">AGE {Math.floor(age)}</span>
            <span className="text-[10px] text-slate-500 font-mono">
              {flight.elapsedSeconds.toFixed(0)}s / 75s
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-150 rounded-full ${
                age >= 55 ? 'bg-red-500' : age >= 45 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Center: Role & CTC */}
        <div className="hidden sm:flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
            {flight.targetRole}
          </span>
          <span className="text-sm font-extrabold text-[#0f172a] font-mono">
            {formatPackage(flight.packageLPA)}
          </span>
        </div>

        {/* Right: Companies Cleared & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
              COMPANIES
            </span>
            <span className="text-base sm:text-lg font-black text-indigo-600 font-mono leading-none">
              {flight.score}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Toggle Sound (M)"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={onPause}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Pause (Esc / P)"
            >
              <Pause size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Mid-Career Satirical Corporate Event Alert Banner */}
      {activeEvent && (
        <div className="self-center max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-start gap-2.5 p-3 rounded-xl border shadow-lg backdrop-blur-md pointer-events-auto ${
            activeEvent.severity === 'alert'
              ? 'bg-red-50/95 border-red-200 text-red-950'
              : activeEvent.severity === 'warning'
              ? 'bg-amber-50/95 border-amber-200 text-amber-950'
              : 'bg-indigo-50/95 border-indigo-200 text-indigo-950'
          }`}>
            <AlertCircle size={18} className={`shrink-0 mt-0.5 ${
              activeEvent.severity === 'alert'
                ? 'text-red-600'
                : activeEvent.severity === 'warning'
                ? 'text-amber-600'
                : 'text-indigo-600'
            }`} />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold tracking-wide uppercase">
                {activeEvent.headline}
              </span>
              <span className="text-[11px] leading-tight opacity-90 mt-0.5">
                {activeEvent.subtext}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
