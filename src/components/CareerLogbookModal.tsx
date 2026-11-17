import React from 'react';
import { BestScores, CareerRecord } from '../types/game';
import { formatPackage } from '../game/companies';
import { X, Trophy, Briefcase, Trash2 } from 'lucide-react';
import { CandidatePortraitSvg } from './CandidateVectorArt';

interface CareerLogbookModalProps {
  bestScores: BestScores;
  history: CareerRecord[];
  onClearHistory: () => void;
  onClose: () => void;
}

export const CareerLogbookModal: React.FC<CareerLogbookModalProps> = ({
  bestScores,
  history,
  onClearHistory,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 safe-area-pad flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[calc(100dvh-1.5rem)] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Briefcase size={18} className="text-indigo-600 shrink-0" />
            <h3 className="font-bold font-display text-sm sm:text-base text-slate-900 truncate">
              Corporate Career Logbook
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Logbook"
            className="min-w-[40px] min-h-[40px] p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 flex-1 min-h-0 overflow-y-auto">
          
          {/* Best Scores per Track */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mb-2.5">
              <Trophy size={13} className="text-amber-500 shrink-0" />
              <span>Institutional Records (Max Companies Cleared)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Fresher</span>
                <span className="text-base sm:text-lg font-black text-slate-800 font-mono tabular-nums">
                  {bestScores.fresher || 0}
                </span>
                <span className="text-[10px] text-slate-500 block">gates</span>
              </div>

              <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Associate</span>
                <span className="text-base sm:text-lg font-black text-slate-800 font-mono tabular-nums">
                  {bestScores.associate || 0}
                </span>
                <span className="text-[10px] text-slate-500 block">gates</span>
              </div>

              <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Expert</span>
                <span className="text-base sm:text-lg font-black text-slate-800 font-mono tabular-nums">
                  {bestScores.expert || 0}
                </span>
                <span className="text-[10px] text-slate-500 block">gates</span>
              </div>
            </div>
          </div>

          {/* Past Career Log */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest mb-2.5">
              <span>Recent Career Attempts ({history.length})</span>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 min-h-[32px] px-2 rounded-md text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50 capitalize font-medium transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-600 text-xs">
                No past careers recorded yet. Take the campus placement test to begin!
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2.5 sm:gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CandidatePortraitSvg character={record.character} size={34} className="rounded-lg shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 truncate">
                            {record.candidateName || 'Employee'}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">
                            · {record.finalRole}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded capitalize font-medium">
                            {record.track}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate mt-0.5 tabular-nums">
                          {record.cause === 'clock'
                            ? 'Retired at 60. No pension.'
                            : record.cause === 'pipe'
                            ? `Terminated by ${record.companyName}`
                            : 'Floor Burnout (Exhaustion)'} · Age {record.exitAge.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row min-[380px]:flex-col items-center min-[380px]:items-end justify-between min-[380px]:justify-center shrink-0 pt-1 min-[380px]:pt-0 border-t min-[380px]:border-t-0 border-slate-100">
                      <span className="font-extrabold text-indigo-600 font-mono tabular-nums">
                        {formatPackage(record.finalLPA)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                        {record.companiesCleared} cleared
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="min-h-[42px] py-2 px-5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Logbook
          </button>
        </div>

      </div>
    </div>
  );
};
