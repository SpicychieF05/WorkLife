export type Character = 'boy' | 'girl';

export type Track = 'fresher' | 'associate' | 'expert';

export type GameMode = 'IDLE' | 'PLAYING' | 'PAUSED' | 'EXIT' | 'RETIRED';

export type CompanyTier = 'MASS' | 'MNC' | 'CONSULTING' | 'FAANG';

export interface Company {
  name: string;
  tier: CompanyTier;
  color: string;
  badgeBg: string;
  badgeText: string;
  lpaBonus: number;
  quips: string[];
}

export interface Pipe {
  id: number;
  x: number;
  top: number;       // Bottom edge of the top pipe (y coordinate)
  bottom: number;    // Top edge of the bottom pipe (y coordinate)
  width: number;
  gap: number;
  cleared: boolean;
  company: Company;
  highlight?: boolean;
}

export interface Bird {
  x: number;
  y: number;
  vy: number;
  radius: number;
  rotation: number;
  alive: boolean;
  retired: boolean;
}

export interface FlightState {
  character: Character;
  candidateName: string;
  track: Track;
  age: number;               // 22.0 -> 60.0
  elapsedSeconds: number;    // 0.0 -> 75.0
  score: number;             // companies cleared
  packageLPA: number;        // in LPA or Cr
  currentCompany: Company;
  targetRole: string;
  cause: 'pipe' | 'floor' | 'ceiling' | 'clock' | null;
  crashedCompany?: Company;
}

export interface BestScores {
  fresher: number;
  associate: number;
  expert: number;
}

export interface CareerRecord {
  id: string;
  date: string;
  character: Character;
  candidateName: string;
  track: Track;
  exitAge: number;
  companiesCleared: number;
  finalLPA: number;
  finalRole: string;
  cause: 'pipe' | 'floor' | 'ceiling' | 'clock';
  companyName: string;
}

export interface CorporateEvent {
  id: string;
  triggerAgeMin: number;
  triggerAgeMax: number;
  headline: string;
  subtext: string;
  severity: 'info' | 'warning' | 'alert';
}
