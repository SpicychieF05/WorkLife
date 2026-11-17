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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-600" />
            <h3 className="font-bold font-display text-base text-slate-900">
              Corporate Career Logbook
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          
          {/* Best Scores per Track */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
              <Trophy size={13} className="text-amber-500" />
              <span>Institutional Records (Max Companies Cleared)</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Fresher</span>
                <span className="text-lg font-black text-slate-800 font-mono">
                  {bestScores.fresher || 0}
                </span>
                <span className="text-[10px] text-slate-400 block">gates</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Associate</span>
                <span className="text-lg font-black text-slate-800 font-mono">
                  {bestScores.associate || 0}
                </span>
                <span className="text-[10px] text-slate-400 block">gates</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Expert</span>
                <span className="text-lg font-black text-slate-800 font-mono">
                  {bestScores.expert || 0}
                </span>
                <span className="text-[10px] text-slate-400 block">gates</span>
              </div>
            </div>
          </div>

          {/* Past Career Log */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
              <span>Recent Career Attempts ({history.length})</span>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 capitalize font-medium transition-colors"
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
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CandidatePortraitSvg character={record.character} size={34} className="rounded-lg shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 truncate">
                            {record.candidateName || 'Employee'}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">
                            · {record.finalRole}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded capitalize font-medium">
                            {record.track}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate mt-0.5">
                          {record.cause === 'clock'
                            ? 'Retired at 60. No pension.'
                            : record.cause === 'pipe'
                            ? `Terminated by ${record.companyName}`
                            : 'Floor Burnout (Exhaustion)'} · Age {record.exitAge.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-extrabold text-indigo-600 font-mono">
                        {formatPackage(record.finalLPA)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
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
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Logbook
          </button>
        </div>

      </div>
    </div>
  );
};
