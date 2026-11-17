import React, { useId } from 'react';
import { CareerDomain, Character, Track } from '../types/game';
import { getDomainOption, getRoleTitleForProgression } from '../game/domains';

interface PortraitProps {
  character: Character;
  size?: number;
  className?: string;
}

/**
 * Separate, distinct flat-vector portraits for Rahul M. (man) and Ananya S. (woman).
 */
export const CandidatePortraitSvg: React.FC<PortraitProps> = ({
  character,
  size = 44,
  className = '',
}) => {
  const clipId = useId();

  if (character === 'boy') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="16" y="16" width="480" height="480" rx="112" />
          </clipPath>
        </defs>

        {/* Adaptive Badge Backdrop matching favicon.svg */}
        <rect
          x="16"
          y="16"
          width="480"
          height="480"
          rx="112"
          fill="#eef0f5"
          stroke="#cbd5e1"
          strokeWidth="16"
        />

        <g clipPath={`url(#${clipId})`}>
          {/* Corporate Suit / Blazer Shoulders */}
          <path
            d="M 76 512 C 76 376 144 328 256 328 C 368 328 436 376 436 512 Z"
            fill="#1e293b"
          />

          {/* White Shirt Collar V */}
          <polygon
            points="184,332 256,422 328,332 292,318 256,318 220,318"
            fill="#ffffff"
          />

          {/* Corporate Indigo Tie */}
          <polygon
            points="236,374 276,374 290,482 256,512 222,482"
            fill="#6366f1"
          />
          <polygon points="232,344 280,344 272,380 240,380" fill="#4f46e5" />

          {/* ID Lanyard Accent */}
          <rect x="342" y="346" width="16" height="58" rx="4" fill="#0284c7" />
          <rect
            x="328"
            y="398"
            width="44"
            height="32"
            rx="6"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="4"
          />
          <rect x="336" y="408" width="28" height="6" rx="2" fill="#6366f1" />
          <rect x="336" y="418" width="18" height="4" rx="2" fill="#94a3b8" />

          {/* Candidate Head */}
          <circle cx="256" cy="212" r="122" fill="#fcd34d" />

          {/* Side-Parted Professional Hair */}
          <path
            d="M 134 202 C 134 114 192 78 262 78 C 334 78 378 122 378 202 C 360 170 332 156 290 154 C 242 152 204 170 176 190 C 158 196 144 202 134 202 Z"
            fill="#1f2937"
          />

          {/* Spectacles */}
          <rect
            x="156"
            y="176"
            width="84"
            height="72"
            rx="18"
            fill="rgba(255, 255, 255, 0.35)"
            stroke="#0f172a"
            strokeWidth="14"
          />
          <rect
            x="272"
            y="176"
            width="84"
            height="72"
            rx="18"
            fill="rgba(255, 255, 255, 0.35)"
            stroke="#0f172a"
            strokeWidth="14"
          />
          <line
            x1="240"
            y1="210"
            x2="272"
            y2="210"
            stroke="#0f172a"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Eyes & Glints */}
          <circle cx="198" cy="212" r="17" fill="#0f172a" />
          <circle cx="314" cy="212" r="17" fill="#0f172a" />
          <circle cx="204" cy="205" r="6" fill="#ffffff" />
          <circle cx="320" cy="205" r="6" fill="#ffffff" />

          {/* Determined Corporate Smirk */}
          <path
            d="M 232 284 Q 258 290 282 276"
            fill="none"
            stroke="#991b1b"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  // Woman Portrait: Ananya S.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Teal Corporate Backdrop */}
      <rect width="64" height="64" rx="14" fill="#115e59" />
      <circle cx="32" cy="36" r="26" fill="#0d9488" opacity="0.35" />

      {/* Full Back Hair Crown + Long Flowing Shoulder-Length Hair */}
      <path
        d="M15 28 C14 9 23 6 32 6 C41 6 50 9 49 28 L53 50 C53 56 46 60 41 57 L41 32 L23 32 L23 57 C18 60 11 56 11 50 Z"
        fill="#1e1b2e"
      />

      {/* Tailored Blazer & Open V-Neck Blouse */}
      <path d="M12 64 C13 48 21 43 32 43 C43 43 51 48 52 64 Z" fill="#1e293b" />
      <polygon points="24,43 32,60 40,43" fill="#f8fafc" />
      <polygon points="21,44 30,61 25,64 18,52" fill="#334155" />
      <polygon points="43,44 34,61 39,64 46,52" fill="#334155" />
      <path d="M26 44 Q32 51 38 44" stroke="#0d9488" strokeWidth="2.4" strokeLinecap="round" />

      {/* Hair Locks Framing Front Shoulders */}
      <path d="M16 30 C14 39 14 48 18 56 C21 53 22 44 21 31 Z" fill="#1e1b2e" />
      <path d="M48 30 C50 39 50 48 46 56 C43 53 42 44 43 31 Z" fill="#1e1b2e" />

      {/* Neck */}
      <rect x="28" y="37" width="8" height="7" rx="3" fill="#f5b942" />

      {/* Gold Stud Earrings */}
      <circle cx="19.5" cy="30.5" r="2.1" fill="#fbbf24" />
      <circle cx="44.5" cy="30.5" r="2.1" fill="#fbbf24" />

      {/* Oval Face */}
      <ellipse cx="32" cy="28" rx="11.5" ry="12.5" fill="#fde68a" />

      {/* Rich Full Crown & Side-Swept Bangs (completely covers top of scalp) */}
      <path
        d="M18 28 C17 11 24 7 32 7 C40 7 47 11 46 28 C44 22 39 17.5 34 17.5 C29 17.5 26 21 19 25.5 Z"
        fill="#1e1b2e"
      />
      <path
        d="M19 24 C24 19 30 16 37 16.5 C42 17 45 20 46 24 C42 15 36 12 31 12 C25 12 21 16 19 24 Z"
        fill="#2d2642"
      />
      {/* Subtle Hair Shine */}
      <path d="M25 11.5 Q32 9 39 11.5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

      {/* Arched Eyebrows */}
      <path d="M23.5 23.8 Q26.8 22.2 29.8 23.6" stroke="#1e1b2e" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M34.2 23.6 Q37.2 22.2 40.5 23.8" stroke="#1e1b2e" strokeWidth="1.4" strokeLinecap="round" />

      {/* Rosy Cheek Blush */}
      <ellipse cx="23.5" cy="31.5" rx="2.3" ry="1.3" fill="#fb7185" opacity="0.4" />
      <ellipse cx="40.5" cy="31.5" rx="2.3" ry="1.3" fill="#fb7185" opacity="0.4" />

      {/* Expressive Almond Eyes with White Sclera & Upper Lash */}
      <ellipse cx="27" cy="27.5" rx="3.1" ry="2.5" fill="#ffffff" />
      <ellipse cx="37" cy="27.5" rx="3.1" ry="2.5" fill="#ffffff" />
      <circle cx="27" cy="27.5" r="1.9" fill="#0f172a" />
      <circle cx="37" cy="27.5" r="1.9" fill="#0f172a" />
      <circle cx="27.7" cy="26.7" r="0.75" fill="#ffffff" />
      <circle cx="37.7" cy="26.7" r="0.75" fill="#ffffff" />
      <path d="M23.6 26.2 Q27 24.4 30.2 26.5" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33.8 26.5 Q37 24.4 40.4 26.2" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />

      {/* Sleek Rounded Glasses */}
      <circle cx="27" cy="27.5" r="4.8" stroke="#4c1d95" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.1" />
      <circle cx="37" cy="27.5" r="4.8" stroke="#4c1d95" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.1" />
      <line x1="31.8" y1="27" x2="32.2" y2="27" stroke="#4c1d95" strokeWidth="1.5" />

      {/* Small Bindi */}
      <circle cx="32" cy="22.8" r="1" fill="#be123c" />

      {/* Warm Smile */}
      <path d="M28.5 34.5 Q32 37.5 35.5 34.5" stroke="#be123c" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
};

interface StageIllustrationProps {
  character: Character;
  candidateName: string;
  track: Track;
  domain: CareerDomain;
}

const TRACK_LPA: Record<Track, string> = {
  fresher: '₹3.6 LPA',
  associate: '₹8.5 LPA',
  expert: '₹24.0 LPA',
};

/**
 * Full-height illustrated IT skyline & company gate arcade scene
 * rendered purely in crisp vector SVG to mirror the live Canvas stage.
 */
export const CareerStageIllustration: React.FC<StageIllustrationProps> = ({
  character,
  candidateName,
  track,
  domain,
}) => {
  const isBoy = character === 'boy';
  const displayName = candidateName.trim() || (isBoy ? 'Rahul Mukherjee' : 'Ananya Sen');
  const startingLpa = TRACK_LPA[track];
  const startingRole = getRoleTitleForProgression(domain, track, 22.0);
  const domainInfo = getDomainOption(domain);

  return (
    <div className="relative w-full h-full min-h-[260px] lg:min-h-[460px] rounded-2xl overflow-hidden bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
      {/* Live Career ID Header Strip */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
            <CandidatePortraitSvg character={character} size={30} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">{displayName}</span>
            <span className="text-[11px] text-slate-400 truncate">
              {startingRole} · {domainInfo.label} · Age 22 → 60
            </span>
          </div>
        </div>
        <div className="text-right shrink-0 pl-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Starting CTC</div>
          <div className="text-sm font-mono font-bold text-amber-400 tabular-nums">{startingLpa}</div>
        </div>
      </div>

      {/* Main SVG Arcade Vector Artwork */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-full block"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Vector illustration of an IT engineer flying through TCS and Google corporate gates over a tech park skyline"
        >
          <defs>
            <linearGradient id="wl-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="55%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="wl-pipe" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="28%" stopColor="#334155" />
              <stop offset="55%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="wl-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={isBoy ? '#6366f1' : '#14b8a6'} stopOpacity="0.28" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {/* Sky Backdrop */}
          <rect width="600" height="400" fill="url(#wl-sky)" />
          <ellipse cx="440" cy="120" rx="220" ry="150" fill="url(#wl-glow)" />

          {/* False Office Ceiling Strip */}
          <rect x="0" y="0" width="600" height="12" fill="#334155" />
          <rect x="40" y="3" width="52" height="5" rx="1" fill="#ffffff" opacity="0.45" />
          <rect x="170" y="3" width="52" height="5" rx="1" fill="#ffffff" opacity="0.45" />
          <rect x="300" y="3" width="52" height="5" rx="1" fill="#ffffff" opacity="0.45" />
          <rect x="430" y="3" width="52" height="5" rx="1" fill="#ffffff" opacity="0.45" />

          {/* Far Tech Park Skyline Silhouettes */}
          <g fill="#1e293b" opacity="0.85">
            <rect x="18" y="175" width="58" height="190" />
            <rect x="92" y="130" width="72" height="235" />
            <rect x="182" y="190" width="54" height="175" />
            <rect x="255" y="145" width="68" height="220" />
            <rect x="342" y="110" width="76" height="255" />
            <rect x="435" y="165" width="62" height="200" />
            <rect x="515" y="135" width="70" height="230" />
          </g>

          {/* Warm Overtime Office Windows */}
          <g fill="#facc15" opacity="0.32">
            <rect x="28" y="190" width="8" height="10" />
            <rect x="44" y="190" width="8" height="10" />
            <rect x="28" y="212" width="8" height="10" />
            <rect x="106" y="148" width="9" height="11" />
            <rect x="124" y="148" width="9" height="11" />
            <rect x="142" y="148" width="9" height="11" />
            <rect x="106" y="172" width="9" height="11" />
            <rect x="142" y="172" width="9" height="11" />
            <rect x="268" y="164" width="9" height="11" />
            <rect x="286" y="164" width="9" height="11" />
            <rect x="268" y="186" width="9" height="11" />
            <rect x="358" y="128" width="10" height="12" />
            <rect x="378" y="128" width="10" height="12" />
            <rect x="398" y="128" width="10" height="12" />
            <rect x="358" y="152" width="10" height="12" />
            <rect x="398" y="152" width="10" height="12" />
            <rect x="528" y="154" width="9" height="11" />
            <rect x="546" y="154" width="9" height="11" />
            <rect x="564" y="154" width="9" height="11" />
          </g>

          {/* Rooftop Antenna Beacons */}
          <line x1="128" y1="130" x2="128" y2="104" stroke="#475569" strokeWidth="3" />
          <circle cx="128" cy="102" r="3.5" fill="#ef4444" />
          <line x1="380" y1="110" x2="380" y2="82" stroke="#475569" strokeWidth="3" />
          <circle cx="380" cy="80" r="3.5" fill="#ef4444" />

          {/* Flight Arc Trajectory Path */}
          <path
            d="M 55 245 Q 145 145 225 190 T 395 162 T 535 128"
            fill="none"
            stroke={isBoy ? '#818cf8' : '#2dd4bf'}
            strokeWidth="2.5"
            strokeDasharray="7 7"
            opacity="0.7"
          />

          {/* GATE 1: Mass Hiring (TCS) */}
          <g transform="translate(220, 0)">
            <rect x="0" y="12" width="62" height="108" fill="url(#wl-pipe)" />
            <rect x="4" y="12" width="3" height="108" fill="#0284c7" />
            <rect x="-5" y="100" width="72" height="20" rx="3" fill="url(#wl-pipe)" stroke="#64748b" strokeWidth="1.5" />

            <rect x="0" y="232" width="62" height="132" fill="url(#wl-pipe)" />
            <rect x="4" y="232" width="3" height="132" fill="#0284c7" />
            <rect x="-5" y="232" width="72" height="20" rx="3" fill="url(#wl-pipe)" stroke="#64748b" strokeWidth="1.5" />

            <g transform="translate(-19, 266)">
              <rect width="100" height="36" rx="5" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              <rect x="7" y="6" width="36" height="12" rx="2" fill="#e0f2fe" />
              <text x="25" y="14.5" textAnchor="middle" fill="#0369a1" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">MASS</text>
              <text x="50" y="15" fill="#0f172a" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">TCS</text>
              <text x="8" y="29" fill="#64748b" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">CLEARED · +₹4L</text>
            </g>
          </g>

          {/* GATE 2: FAANG (Google) */}
          <g transform="translate(430, 0)">
            <rect x="0" y="12" width="64" height="74" fill="url(#wl-pipe)" />
            <rect x="4" y="12" width="3" height="74" fill="#16a34a" />
            <rect x="57" y="12" width="3" height="74" fill="#fbbf24" />
            <rect x="-5" y="66" width="74" height="20" rx="3" fill="url(#wl-pipe)" stroke="#fbbf24" strokeWidth="1.6" />

            <rect x="0" y="196" width="64" height="168" fill="url(#wl-pipe)" />
            <rect x="4" y="196" width="3" height="168" fill="#16a34a" />
            <rect x="57" y="196" width="3" height="168" fill="#fbbf24" />
            <rect x="-5" y="196" width="74" height="20" rx="3" fill="url(#wl-pipe)" stroke="#fbbf24" strokeWidth="1.6" />

            <g transform="translate(-20, 232)">
              <rect width="104" height="36" rx="5" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
              <rect x="7" y="6" width="38" height="12" rx="2" fill="#dcfce7" />
              <text x="26" y="14.5" textAnchor="middle" fill="#15803d" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">FAANG</text>
              <text x="51" y="15" fill="#0f172a" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">Google</text>
              <text x="8" y="29" fill="#64748b" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">TARGET · ₹1.8 Cr</text>
            </g>
          </g>

          {/* Flying Offer Paper Particles */}
          <g fill="#f8fafc" opacity="0.78">
            <rect x="85" y="195" width="11" height="7" rx="1" transform="rotate(-18 85 195)" />
            <rect x="66" y="216" width="9" height="6" rx="1" transform="rotate(24 66 216)" />
            <rect x="108" y="220" width="10" height="6" rx="1" fill="#fde68a" transform="rotate(-10 108 220)" />
            <rect x="330" y="172" width="10" height="6" rx="1" transform="rotate(14 330 172)" />
          </g>

          {/* HERO FLYING EMPLOYEE SPRITE — Distinct Vector Art per Gender */}
          <g transform="translate(148, 178)">
            <g className="animate-career-glide">
              {isBoy ? (
                <>
                  {/* Rahul M. (Man) Flying Sprite — exact favicon.svg character vector */}
                  <circle cx="0" cy="0" r="36" fill="#6366f1" opacity="0.2" />
                  <g transform="translate(-32, -33) scale(0.125)">
                    {/* Corporate Suit / Blazer Shoulders with curved floating hem */}
                    <path
                      d="M 76 470 C 76 366 144 328 256 328 C 368 328 436 366 436 470 Q 256 516 76 470 Z"
                      fill="#1e293b"
                      stroke="#0f172a"
                      strokeWidth="10"
                    />

                    {/* White Shirt Collar V */}
                    <polygon
                      points="184,332 256,422 328,332 292,318 256,318 220,318"
                      fill="#ffffff"
                    />

                    {/* Corporate Indigo Tie */}
                    <polygon
                      points="236,374 276,374 290,468 256,496 222,468"
                      fill="#6366f1"
                    />
                    <polygon points="232,344 280,344 272,380 240,380" fill="#4f46e5" />

                    {/* ID Lanyard Accent */}
                    <rect x="342" y="346" width="16" height="58" rx="4" fill="#0284c7" />
                    <rect
                      x="328"
                      y="398"
                      width="44"
                      height="32"
                      rx="6"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="4"
                    />
                    <rect x="336" y="408" width="28" height="6" rx="2" fill="#6366f1" />
                    <rect x="336" y="418" width="18" height="4" rx="2" fill="#94a3b8" />

                    {/* Candidate Head */}
                    <circle cx="256" cy="212" r="122" fill="#fcd34d" />

                    {/* Side-Parted Professional Hair */}
                    <path
                      d="M 134 202 C 134 114 192 78 262 78 C 334 78 378 122 378 202 C 360 170 332 156 290 154 C 242 152 204 170 176 190 C 158 196 144 202 134 202 Z"
                      fill="#1f2937"
                    />

                    {/* Spectacles */}
                    <rect
                      x="156"
                      y="176"
                      width="84"
                      height="72"
                      rx="18"
                      fill="rgba(255, 255, 255, 0.35)"
                      stroke="#0f172a"
                      strokeWidth="14"
                    />
                    <rect
                      x="272"
                      y="176"
                      width="84"
                      height="72"
                      rx="18"
                      fill="rgba(255, 255, 255, 0.35)"
                      stroke="#0f172a"
                      strokeWidth="14"
                    />
                    <line
                      x1="240"
                      y1="210"
                      x2="272"
                      y2="210"
                      stroke="#0f172a"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />

                    {/* Eyes & Glints */}
                    <circle cx="198" cy="212" r="17" fill="#0f172a" />
                    <circle cx="314" cy="212" r="17" fill="#0f172a" />
                    <circle cx="204" cy="205" r="6" fill="#ffffff" />
                    <circle cx="320" cy="205" r="6" fill="#ffffff" />

                    {/* Determined Corporate Smirk */}
                    <path
                      d="M 232 284 Q 258 290 282 276"
                      fill="none"
                      stroke="#991b1b"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                  </g>
                </>
              ) : (
                <>
                  {/* Ananya S. (Woman) Flying Sprite */}
                  <circle cx="0" cy="0" r="36" fill="#14b8a6" opacity="0.2" />

                  {/* Streaming Flowing Hair & Ponytail Silhouette Behind Head/Shoulders */}
                  <path
                    d="M-14 -31 C-32 -29 -39 -14 -40 4 C-34 7 -28 3 -25 -4 C-26 9 -26 20 -18 23 L-14 2 L15 2 L19 20 C25 18 27 8 24 -10 C22 -27 9 -34 -4 -34 Z"
                    fill="#1e1b2e"
                  />
                  {/* Flowing Hair Wave Highlight */}
                  <path
                    d="M-21 -22 C-31 -17 -34 -7 -34 1"
                    stroke="#475569"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.65"
                  />

                  {/* Blazer Torso + V-Neck White Blouse */}
                  <path d="M-23 2 A23 22 0 0 0 23 2 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.4" />
                  <polygon points="-10,2 0,18 10,2" fill="#f8fafc" />
                  <path d="M-8 3.5 Q0 11 8 3.5" stroke="#0d9488" strokeWidth="2.6" strokeLinecap="round" fill="none" />

                  {/* ID Lanyard */}
                  <rect x="-2.5" y="13" width="5" height="7" fill="#0d9488" />
                  <rect x="-5" y="18" width="10" height="6" rx="1" fill="#ffffff" />

                  {/* Gold Stud Earrings */}
                  <circle cx="-18.5" cy="-3.5" r="2.6" fill="#fbbf24" />
                  <circle cx="18.5" cy="-3.5" r="2.6" fill="#fbbf24" />

                  {/* Oval Head */}
                  <ellipse cx="0" cy="-7" rx="17" ry="18" fill="#fde68a" stroke="#f59e0b" strokeWidth="1" />

                  {/* Full Crown Hair & Side-Swept Bangs (completely covers top of scalp) */}
                  <path
                    d="M-19 -8 C-21 -27 -10 -34 1 -34 C12 -34 21 -26 19 -8 C16 -14 10 -18.5 4 -18.5 C-2 -18.5 -9 -14 -19 -8 Z"
                    fill="#1e1b2e"
                  />
                  <path
                    d="M-17 -12 C-10 -20 -2 -22 6 -21 C12 -20 16 -17 18 -13 C14 -24 6 -28 -1 -28 C-9 -28 -15 -22 -17 -12 Z"
                    fill="#312b49"
                  />

                  {/* Arched Eyebrows */}
                  <path d="M-11.5 -12.5 Q-7 -15 -3 -13" stroke="#1e1b2e" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M3 -13 Q7 -15 11.5 -12.5" stroke="#1e1b2e" strokeWidth="1.7" strokeLinecap="round" />

                  {/* Bindi & Rosy Cheeks */}
                  <circle cx="0" cy="-14" r="1.4" fill="#be123c" />
                  <ellipse cx="-11" cy="-2" rx="2.8" ry="1.6" fill="#fb7185" opacity="0.45" />
                  <ellipse cx="11" cy="-2" rx="2.8" ry="1.6" fill="#fb7185" opacity="0.45" />

                  {/* Expressive Eyes with White Sclera, Pupils, Shine & Lashes */}
                  <ellipse cx="-7" cy="-7" rx="4.1" ry="3.5" fill="#ffffff" />
                  <ellipse cx="7" cy="-7" rx="4.1" ry="3.5" fill="#ffffff" />
                  <circle cx="-6.6" cy="-7" r="2.4" fill="#0f172a" />
                  <circle cx="7.4" cy="-7" r="2.4" fill="#0f172a" />
                  <circle cx="-5.7" cy="-8" r="0.95" fill="#ffffff" />
                  <circle cx="8.3" cy="-8" r="0.95" fill="#ffffff" />
                  <path d="M-11.8 -8.8 Q-7 -11.5 -2.6 -8.4" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M2.6 -8.4 Q7 -11.5 11.8 -8.8" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />

                  {/* Sleek Rounded Spectacles */}
                  <circle cx="-7" cy="-7" r="6.3" stroke="#5b21b6" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.1" />
                  <circle cx="7" cy="-7" r="6.3" stroke="#5b21b6" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.1" />
                  <line x1="-0.7" y1="-7.5" x2="0.7" y2="-7.5" stroke="#5b21b6" strokeWidth="1.8" />

                  {/* Warm Smile */}
                  <path d="M-4.5 2 Q0 5.5 4.5 2" stroke="#be123c" strokeWidth="2" strokeLinecap="round" fill="none" />
                </>
              )}
            </g>
          </g>

          {/* Caution Hazard Floor Tape & Corporate Carpet */}
          <rect x="0" y="364" width="600" height="36" fill="#1e293b" />
          <rect x="0" y="364" width="600" height="7" fill="#f59e0b" />
          <g fill="#0f172a">
            <polygon points="0,371 16,364 26,364 10,371" />
            <polygon points="36,371 52,364 62,364 46,371" />
            <polygon points="72,371 88,364 98,364 82,371" />
            <polygon points="108,371 124,364 134,364 118,371" />
            <polygon points="144,371 160,364 170,364 154,371" />
            <polygon points="180,371 196,364 206,364 190,371" />
            <polygon points="216,371 232,364 242,364 226,371" />
            <polygon points="252,371 268,364 278,364 262,371" />
            <polygon points="288,371 304,364 314,364 298,371" />
            <polygon points="324,371 340,364 350,364 334,371" />
            <polygon points="360,371 376,364 386,364 370,371" />
            <polygon points="396,371 412,364 422,364 406,371" />
            <polygon points="432,371 448,364 458,364 442,371" />
            <polygon points="468,371 484,364 494,364 478,371" />
            <polygon points="504,371 520,364 530,364 514,371" />
            <polygon points="540,371 556,364 566,364 550,371" />
            <polygon points="576,371 592,364 602,364 586,371" />
          </g>
        </svg>
      </div>

      {/* Bottom 4-Tier Career Ladder Strip */}
      <div className="relative z-10 grid grid-cols-4 gap-2 px-4 py-3 bg-slate-950/90 border-t border-slate-800 text-left">
        <div>
          <div className="text-[10px] font-mono text-sky-400">22–31 YRS</div>
          <div className="text-xs font-semibold text-white truncate">Mass Hiring</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-indigo-400">31–41 YRS</div>
          <div className="text-xs font-semibold text-white truncate">Global MNC</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-amber-400">41–51 YRS</div>
          <div className="text-xs font-semibold text-white truncate">Big 4 Partner</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-emerald-400">51–60 YRS</div>
          <div className="text-xs font-semibold text-white truncate">FAANG → Retire</div>
        </div>
      </div>
    </div>
  );
};
