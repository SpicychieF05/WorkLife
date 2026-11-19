import React from 'react';
import { FlightState } from '../types/game';
import { formatPackage } from '../game/companies';
import { RotateCcw, FileText, Award, Mail } from 'lucide-react';
import { CandidatePortraitSvg } from './CandidateVectorArt';
import { buildScoreEmailHref } from '../game/shareEmail';

interface ExitScreenProps {
  flight: FlightState;
  bestScore: number;
  restartCooldownSec?: number;
  onRestart: () => void;
  onChangeTrack: () => void;
  onViewRelievingSlip: () => void;
}

export const ExitScreen: React.FC<ExitScreenProps> = ({
  flight,
  bestScore,
  restartCooldownSec = 0,
  onRestart,
  onChangeTrack,
  onViewRelievingSlip
}) => {
  const isRestartLocked = restartCooldownSec > 0;
  const isPipe = flight.cause === 'pipe';
  const isFloor = flight.cause === 'floor';
  const company = flight.crashedCompany || flight.currentCompany;

  // Satirical headline & reason
  let reasonTitle = 'RESIGNATION PROCESSED';
  let reasonBody = 'You submitted your resignation on the HR portal. 90-day notice period waived due to zero client billability.';

  if (isPipe && company) {
    const quip = company.quips[Math.floor(Math.random() * company.quips.length)];
    reasonTitle = `COLLIDED WITH ${company.name.toUpperCase()}`;
    reasonBody = quip;
  } else if (isFloor) {
    reasonTitle = 'BURNT OUT ON OFFICE FLOOR';
    reasonBody = 'Exhaustion after three consecutive 80-hour sprints with zero compensation leaves. Facilities team requested badge handover.';
  } else if (flight.cause === 'ceiling') {
    reasonTitle = 'HIT THE CORPORATE GLASS CEILING';
    reasonBody = 'Promotion packet rejected by regional leadership committee due to "budgetary recalibration".';
  }

  const isNewBest = flight.score > bestScore;

  return (
    <div className="absolute inset-0 safe-area-pad flex items-center justify-center p-3 sm:p-6 bg-[#0f172a]/75 backdrop-blur-sm z-30 overflow-y-auto">
      <div className="@container w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col md:flex-row my-auto">
        
        {/* Left Art Column */}
        <div className="md:w-5/12 bg-slate-900 p-4 sm:p-6 flex flex-col items-center justify-center text-center text-white relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border-2 border-red-500/50 flex items-center justify-center mb-2.5 sm:mb-3 shadow-inner overflow-hidden">
            <CandidatePortraitSvg character={flight.character} size={76} />
          </div>

          <span className="text-[11px] font-mono tracking-widest text-red-400 uppercase font-bold">
            CAREER TERMINATED
          </span>

          <h3 className="text-lg sm:text-xl font-bold font-display tabular-nums mt-1 text-slate-100">
            Age {flight.age.toFixed(1)}
          </h3>

          <span className="font-semibold text-xs text-indigo-300 mt-0.5 truncate max-w-full px-2">
            {flight.candidateName}
          </span>

          <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
            {flight.targetRole}
          </p>

          <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800 w-full flex items-center justify-around text-xs gap-2">
            <div className="flex flex-col">
              <span className="text-slate-400 font-mono text-[10px]">PACKAGE</span>
              <span className="font-bold text-indigo-400 font-mono tabular-nums text-sm">
                {formatPackage(flight.packageLPA)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-mono text-[10px]">GATES</span>
              <span className="font-bold text-slate-200 font-mono tabular-nums text-sm">
                {flight.score}
              </span>
            </div>
          </div>
        </div>

        {/* Right Exit Letter Column */}
        <div className="md:w-7/12 p-4 sm:p-7 flex flex-col justify-between text-slate-800 bg-[#f8fafd]">
          <div>
            {/* Header / Eyebrow */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold tracking-widest text-red-600 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                EXIT INTERVIEW RECORD
              </span>
              {isNewBest && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                  <Award size={12} /> NEW RECORD
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-xl font-bold font-display text-[#0f172a] mt-2 leading-tight break-words">
              {reasonTitle}
            </h2>

            {/* Quip card */}
            <div className="mt-3 p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 italic leading-relaxed">
              &ldquo;{reasonBody}&rdquo;
            </div>

            {/* Score Breakdown Table */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg min-w-0">
                <span className="text-slate-600 block text-[10px] uppercase font-bold tracking-wider">Track</span>
                <span className="font-semibold text-slate-900 capitalize truncate block">{flight.track}</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg min-w-0">
                <span className="text-slate-600 block text-[10px] uppercase font-bold tracking-wider">Personal Best</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">{Math.max(flight.score, bestScore)} Gates</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-5 sm:mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onRestart}
              disabled={isRestartLocked}
              aria-disabled={isRestartLocked}
              className={`w-full min-h-[44px] py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors tabular-nums ${
                isRestartLocked
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed shadow-none'
                  : 'bg-[#1e293b] text-white hover:bg-indigo-600 shadow-md cursor-pointer'
              }`}
            >
              <RotateCcw size={15} />
              <span>
                {isRestartLocked
                  ? `Start another career (${restartCooldownSec}s)`
                  : 'Start another career'}
              </span>
            </button>

            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
              <button
                onClick={onViewRelievingSlip}
                className="min-h-[44px] py-2.5 px-3 rounded-xl border border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 transition-colors font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText size={14} />
                <span>Relieving Slip</span>
              </button>

              <button
                onClick={onChangeTrack}
                className="min-h-[44px] py-2.5 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-xs text-center cursor-pointer"
              >
                Change Track
              </button>
            </div>

            <a
              href={buildScoreEmailHref(flight)}
              className="w-full min-h-[42px] py-2.5 px-4 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 transition-colors font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <Mail size={14} />
              <span>Email My Score to Chirantan</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
