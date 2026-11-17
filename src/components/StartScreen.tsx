import React from 'react';
import { CareerDomain, Character, Track, BestScores } from '../types/game';
import { CAREER_DOMAINS } from '../game/domains';
import { Volume2, VolumeX, Maximize2, Trophy, History, Play, User } from 'lucide-react';
import { CandidatePortraitSvg, CareerStageIllustration } from './CandidateVectorArt';

interface StartScreenProps {
  character: Character;
  candidateName: string;
  track: Track;
  domain: CareerDomain;
  bestScores: BestScores;
  soundEnabled: boolean;
  onSelectCharacter: (c: Character) => void;
  onChangeCandidateName: (name: string) => void;
  onSelectTrack: (t: Track) => void;
  onSelectDomain: (d: CareerDomain) => void;
  onStart: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  onOpenLogbook: () => void;
}

const TRACK_OPTIONS: Array<{
  id: Track;
  label: string;
  lpa: string;
  tagline: string;
}> = [
  {
    id: 'fresher',
    label: 'Fresher',
    lpa: '₹3.6 LPA',
    tagline: 'First offer letter. Family is proud. Bond period included.',
  },
  {
    id: 'associate',
    label: 'Associate',
    lpa: '₹8.5 LPA',
    tagline: 'Two appraisals in. Still writing “as per my last email”.',
  },
  {
    id: 'expert',
    label: 'Expert',
    lpa: '₹24 LPA',
    tagline: 'Ten years in. You interview the freshers who replaced you.',
  },
];

export const StartScreen: React.FC<StartScreenProps> = ({
  character,
  candidateName,
  track,
  domain,
  bestScores,
  soundEnabled,
  onSelectCharacter,
  onChangeCandidateName,
  onSelectTrack,
  onSelectDomain,
  onStart,
  onToggleSound,
  onToggleFullscreen,
  onOpenLogbook,
}) => {
  const currentBest = bestScores[track] || 0;

  return (
    <div className="absolute inset-0 z-30 overflow-y-auto overflow-x-hidden bg-[#eef0f5] text-slate-800">
      <div className="min-h-full w-full flex items-center justify-center safe-area-pad">
        <div className="@container w-full max-w-6xl bg-white border border-slate-200 shadow-xl rounded-2xl p-[clamp(0.875rem,2vw,1.75rem)] flex flex-col gap-4 my-auto">
          {/* Top Bar */}
          <header className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/assets/favicon.svg"
                alt="WorkLife emblem"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg shrink-0"
              />
              <span className="font-mono text-xs font-bold tracking-wider text-indigo-600 whitespace-nowrap shrink-0">
                WORKLIFE
              </span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-xs font-medium text-slate-500 hidden sm:inline truncate">
                75-Second Indian IT Career Arcade
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenLogbook}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 min-h-[40px] rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
              >
                <History size={15} />
                <span>Career Logbook</span>
              </button>
              <button
                type="button"
                onClick={onToggleSound}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
                title={soundEnabled ? 'Mute sound (M)' : 'Unmute sound (M)'}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
                title="Toggle Fullscreen (F)"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </header>

          {/* Main 2-Column Hero Stage & Career Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
            {/* Left Column: Animated Vector Skyline & Live Candidate Flight Preview (auto-hidden only on ultra-short landscape phones <= 450px tall so Start CTA stays immediate) */}
            <div className="lg:col-span-6 flex flex-col [@media(max-height:450px)]:hidden">
              <CareerStageIllustration
                character={character}
                candidateName={candidateName}
                track={track}
                domain={domain}
              />
            </div>

            {/* Right Column: Onboarding Controls & Launch */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-3.5 min-w-0">
              {/* Hero Title & Hook */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[clamp(0.6875rem,1.2vw,0.75rem)] font-medium text-slate-500">
                  <span>Age 22 to 60</span>
                  <span aria-hidden="true">·</span>
                  <span>21 Corporate Gates</span>
                  <span aria-hidden="true">·</span>
                  <span>Instant Relieving Slip</span>
                </div>
                <h1 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold text-[#0f172a] tracking-tight leading-[1.05]">
                  Hire &amp; Fire<span className="text-amber-500">.</span>
                </h1>
                <p className="text-[clamp(0.75rem,1.4vw,0.875rem)] text-slate-600 leading-relaxed max-w-lg">
                  Every gate is a company. Climb from campus placement to FAANG, dodge layoffs, and retire at 60 whether you like it or not.
                </p>
              </div>

              {/* Employee Name Input */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <label
                    htmlFor="employee-name"
                    className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    <User size={13} className="text-indigo-600" />
                    <span>Employee Full Name</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Printed on your relieving slip
                  </span>
                </div>
                <input
                  id="employee-name"
                  type="text"
                  value={candidateName}
                  onChange={(e) => onChangeCandidateName(e.target.value)}
                  placeholder="Enter your name (e.g. Chirantan Mallick)"
                  maxLength={36}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Candidate Avatar Selection */}
              <div className="flex flex-col gap-1.5">
                <div className="text-xs font-semibold text-slate-700">
                  Select Candidate
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectCharacter('boy')}
                    className={`flex items-center gap-3 p-2.5 min-h-[56px] rounded-xl border text-left transition-all ${
                      character === 'boy'
                        ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CandidatePortraitSvg character="boy" size={40} className="shrink-0 rounded-lg" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm truncate">Rahul M.</span>
                      <span className={`text-xs truncate ${character === 'boy' ? 'text-slate-300' : 'text-slate-500'}`}>
                        B.Tech CSE · Pune
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectCharacter('girl')}
                    className={`flex items-center gap-3 p-2.5 min-h-[56px] rounded-xl border text-left transition-all ${
                      character === 'girl'
                        ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CandidatePortraitSvg character="girl" size={40} className="shrink-0 rounded-lg" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm truncate">Ananya S.</span>
                      <span className={`text-xs truncate ${character === 'girl' ? 'text-slate-300' : 'text-slate-500'}`}>
                        B.Tech IT · Bengaluru
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Career Domain / Role Selection (Analyst default) */}
              <div className="flex flex-col gap-1.5">
                <div className="text-xs font-semibold text-slate-700">
                  Career Domain
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CAREER_DOMAINS.map((item) => {
                    const selected = domain === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectDomain(item.id)}
                        className={`px-3 py-2 min-h-[48px] rounded-xl border text-left transition-all ${
                          selected
                            ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-xs truncate">{item.label}</div>
                        <div className={`text-[10px] truncate mt-0.5 ${selected ? 'text-amber-300' : 'text-slate-500'}`}>
                          {item.focus}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Career Track Selection */}
              <div className="flex flex-col gap-1.5">
                <div className="text-xs font-semibold text-slate-700">
                  Starting Career Track
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TRACK_OPTIONS.map((item) => {
                    const selected = track === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectTrack(item.id)}
                        className={`p-2.5 min-h-[64px] rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                          selected
                            ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">{item.label}</span>
                          <span
                            className={`text-[11px] font-mono font-semibold tabular-nums whitespace-nowrap ${
                              selected ? 'text-amber-300' : 'text-indigo-600'
                            }`}
                          >
                            {item.lpa}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-snug ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {item.tagline}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Start Action + Score Summary */}
              <div className="flex flex-col gap-2.5 pt-0.5">
                <button
                  type="button"
                  onClick={onStart}
                  className="w-full min-h-[46px] py-3 px-6 rounded-xl bg-[#1e293b] text-white hover:bg-indigo-600 transition-colors font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.99]"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start your career →</span>
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-700">
                      Space
                    </kbd>
                    <span>or tap/click anywhere to jump</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-medium">
                    <Trophy size={14} className="text-amber-500 shrink-0" />
                    <span>Best ({track}):</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums">
                      {currentBest} {currentBest === 1 ? 'company' : 'companies'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
