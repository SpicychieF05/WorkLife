import React from 'react';
import { Play, Pause } from 'lucide-react';

interface PauseScreenProps {
  onResume: () => void;
}

export const PauseScreen: React.FC<PauseScreenProps> = ({ onResume }) => {
  return (
    <div className="absolute inset-0 safe-area-pad flex items-center justify-center p-3 sm:p-4 bg-[#0f172a]/85 backdrop-blur-sm z-30 overflow-y-auto">
      <div className="w-full max-w-sm max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-white rounded-2xl p-5 sm:p-7 shadow-2xl border border-slate-200 text-center flex flex-col gap-4 text-slate-800 my-auto animate-in zoom-in-95 duration-200">
        
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shrink-0">
          <Pause size={22} />
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-600 uppercase font-bold">
            SPRINT STANDUP IN PROGRESS
          </span>
          <h3 className="text-xl font-bold font-display text-[#0f172a] mt-0.5">
            Career Paused
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            &ldquo;Can everyone see my screen? Sorry, I was on mute.&rdquo;
          </p>
        </div>

        <button
          onClick={onResume}
          className="w-full min-h-[44px] py-3 px-5 rounded-xl bg-[#1e293b] text-white hover:bg-indigo-600 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Play size={15} fill="currentColor" />
          <span>Resume Working Life</span>
        </button>

        <span className="text-[11px] text-slate-600 font-mono">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700">Esc</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700">P</kbd> to resume
        </span>

      </div>
    </div>
  );
};
