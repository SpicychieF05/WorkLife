import React from 'react';
import { Character, Track, BestScores } from '../types/game';
import { Volume2, VolumeX, Maximize2, Trophy, History, Play, User } from 'lucide-react';

interface StartScreenProps {
  character: Character;
  candidateName: string;
  track: Track;
  bestScores: BestScores;
  soundEnabled: boolean;
  onSelectCharacter: (c: Character) => void;
  onChangeCandidateName: (name: string) => void;
  onSelectTrack: (t: Track) => void;
  onStart: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  onOpenLogbook: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  character,
  candidateName,
  track,
  bestScores,
  soundEnabled,
  onSelectCharacter,
  onChangeCandidateName,
  onSelectTrack,
  onStart,
  onToggleSound,
  onToggleFullscreen,
  onOpenLogbook,
}) => {
  const currentBest = bestScores[track] || 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 bg-[#eef0f5] z-30 overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-slate-200 shadow-xl rounded-2xl p-5 sm:p-7 flex flex-col gap-4 text-slate-800 my-auto">
        
        {/* Top Header Pills */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-600">
            <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md font-mono">
              WORKLIFE
            </span>
            <span className="text-slate-400">·</span>
            <span>75-SECOND IT CAREER</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={soundEnabled ? 'Mute sound (M)' : 'Unmute sound (M)'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Toggle Fullscreen (F)"
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Hire &amp; Fire<span className="text-amber-500">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every gate is a company. Climb from campus placement to FAANG.
            Retire at 60 whether you like it or not.
          </p>
        </div>

        {/* EMPLOYEE NAME INPUT FORM */}
        <div className="flex flex-col gap-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
          <label htmlFor="employee-name" className="text-[11px] font-bold tracking-widest text-slate-600 uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-indigo-600" />
              Employee Full Name
            </span>
            <span className="text-[10px] text-slate-600 font-normal">Used on official offer/relieving slip</span>
          </label>
          <input
            id="employee-name"
            type="text"
            value={candidateName}
            onChange={(e) => onChangeCandidateName(e.target.value)}
            placeholder="Enter your name (e.g. Chirantan Mallick)"
            maxLength={36}
            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        {/* CANDIDATE Selection */}
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
            Candidate Avatar
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Boy card */}
            <button
              type="button"
              onClick={() => onSelectCharacter('boy')}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                character === 'boy'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  character === 'boy' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                👦
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm truncate">Rahul M.</span>
                <span className={`text-[11px] truncate ${character === 'boy' ? 'text-slate-300' : 'text-slate-500'}`}>
                  B.Tech CSE (Pune)
                </span>
              </div>
            </button>

            {/* Girl card */}
            <button
              type="button"
              onClick={() => onSelectCharacter('girl')}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                character === 'girl'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  character === 'girl' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                👩
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm truncate">Ananya S.</span>
                <span className={`text-[11px] truncate ${character === 'girl' ? 'text-slate-300' : 'text-slate-500'}`}>
                  B.Tech IT (Bengaluru)
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* TRACK Selection */}
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Career Track
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Fresher */}
            <button
              type="button"
              onClick={() => onSelectTrack('fresher')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                track === 'fresher'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs sm:text-sm">Fresher</span>
                <span className={`text-[10px] font-mono ${track === 'fresher' ? 'text-indigo-300' : 'text-slate-400'}`}>
                  ₹3.6 LPA
                </span>
              </div>
              <p className={`text-[11px] mt-1.5 leading-snug ${track === 'fresher' ? 'text-slate-300' : 'text-slate-500'}`}>
                First offer letter. Family is proud. Bond period included.
              </p>
            </button>

            {/* Associate */}
            <button
              type="button"
              onClick={() => onSelectTrack('associate')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                track === 'associate'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs sm:text-sm">Associate</span>
                <span className={`text-[10px] font-mono ${track === 'associate' ? 'text-indigo-300' : 'text-slate-400'}`}>
                  ₹8.5 LPA
                </span>
              </div>
              <p className={`text-[11px] mt-1.5 leading-snug ${track === 'associate' ? 'text-slate-300' : 'text-slate-500'}`}>
                Two appraisals in. Still writing &ldquo;as per my last email&rdquo;.
              </p>
            </button>

            {/* Expert */}
            <button
              type="button"
              onClick={() => onSelectTrack('expert')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                track === 'expert'
                  ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs sm:text-sm">Expert</span>
                <span className={`text-[10px] font-mono ${track === 'expert' ? 'text-indigo-300' : 'text-slate-400'}`}>
                  ₹24 LPA
                </span>
              </div>
              <p className={`text-[11px] mt-1.5 leading-snug ${track === 'expert' ? 'text-slate-300' : 'text-slate-500'}`}>
                Ten years in. You interview the freshers who replaced you.
              </p>
            </button>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={onStart}
            className="w-full py-3.5 px-6 rounded-xl bg-[#1e293b] text-white hover:bg-indigo-600 transition-colors font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.99]"
          >
            <Play size={16} fill="currentColor" />
            <span>Start your career →</span>
          </button>
          <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-700">Space</kbd>
            <span>or click/tap on screen to jump</span>
          </div>
        </div>

        {/* Footer with Trophy & Career Logbook */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <Trophy size={14} className="text-amber-500" />
            <span>Best on {track.toUpperCase()}:</span>
            <span className="font-bold text-slate-800 font-mono">{currentBest} companies</span>
          </div>

          <button
            type="button"
            onClick={onOpenLogbook}
            className="flex items-center gap-1 hover:text-indigo-600 font-medium transition-colors"
          >
            <History size={14} />
            <span>Career Logbook</span>
          </button>
        </div>

      </div>
    </div>
  );
};
