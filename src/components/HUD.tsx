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
    <div
      className="absolute top-0 left-0 right-0 pointer-events-none z-20 flex flex-col gap-2"
      style={{
        paddingTop: 'max(0.625rem, env(safe-area-inset-top))',
        paddingLeft: 'max(0.625rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.625rem, env(safe-area-inset-right))',
      }}
    >
      {/* Top Stat Bar */}
      <div className="w-full max-w-6xl mx-auto bg-white/92 backdrop-blur-md border border-slate-200/80 shadow-md rounded-xl px-3 sm:px-4 py-2 pointer-events-auto flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Age & Progress */}
          <div className="flex flex-col gap-1 min-w-[105px] sm:min-w-[170px] flex-1 max-w-[210px]">
            <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-800">
              <span className="tracking-wide whitespace-nowrap tabular-nums">AGE {Math.floor(age)}</span>
              <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap tabular-nums">
                {flight.elapsedSeconds.toFixed(0)}s / 75s
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-150 rounded-full ${
                  age >= 55 ? 'bg-red-500' : age >= 45 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Center (Tablet / Desktop >= 640px): Role & CTC */}
          <div className="hidden sm:flex flex-col items-center justify-center text-center min-w-0 px-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold truncate max-w-[240px]">
              {flight.targetRole}
            </span>
            <span className="text-sm font-extrabold text-[#0f172a] font-mono tabular-nums whitespace-nowrap">
              {formatPackage(flight.packageLPA)}
            </span>
          </div>

          {/* Right: Companies Cleared & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-600 font-semibold whitespace-nowrap">
                COMPANIES
              </span>
              <span className="text-base sm:text-lg font-black text-indigo-600 font-mono leading-none tabular-nums">
                {flight.score}
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleSound}
                className="min-w-[36px] min-h-[36px] sm:min-w-[34px] sm:min-h-[34px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Toggle Sound (M)"
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                type="button"
                onClick={onPause}
                className="min-w-[36px] min-h-[36px] sm:min-w-[34px] sm:min-h-[34px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Pause (Esc / P)"
                aria-label="Pause Game"
              >
                <Pause size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Condensed Narrow-Screen Sub-Row (< 640px): Always visible Role & CTC */}
        <div className="flex sm:hidden items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
          <span className="font-semibold text-slate-600 uppercase tracking-wider truncate">
            {flight.targetRole}
          </span>
          <span className="font-extrabold text-[#0f172a] font-mono tabular-nums whitespace-nowrap shrink-0">
            {formatPackage(flight.packageLPA)}
          </span>
        </div>
      </div>

      {/* Mid-Career Satirical Corporate Event Alert Banner */}
      {activeEvent && (
        <div className="self-center w-full max-w-[min(28rem,100%)] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl border shadow-lg backdrop-blur-md pointer-events-auto ${
            activeEvent.severity === 'alert'
              ? 'bg-red-50/95 border-red-200 text-red-950'
              : activeEvent.severity === 'warning'
              ? 'bg-amber-50/95 border-amber-200 text-amber-950'
              : 'bg-indigo-50/95 border-indigo-200 text-indigo-950'
          }`}>
            <AlertCircle size={17} className={`shrink-0 mt-0.5 ${
              activeEvent.severity === 'alert'
                ? 'text-red-600'
                : activeEvent.severity === 'warning'
                ? 'text-amber-600'
                : 'text-indigo-600'
            }`} />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] sm:text-xs font-bold tracking-wide uppercase break-words">
                {activeEvent.headline}
              </span>
              <span className="text-[11px] leading-tight opacity-90 mt-0.5 break-words">
                {activeEvent.subtext}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
