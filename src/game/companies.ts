import { Company, CompanyTier } from '../types/game';

export const MASS_COMPANIES: Company[] = [
  {
    name: 'TCS',
    tier: 'MASS',
    color: '#00539b',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    lpaBonus: 0.5,
    quips: [
      'Placed via NQT exam. Assigned to support project on day 2.',
      'Served a 2-year service bond. The penalty was higher than the annual salary.',
      'Mandatory formal dress code enforced even during work-from-home.',
      'Manager rejected resignation citing critical release dependencies.'
    ]
  },
  {
    name: 'Infosys',
    tier: 'MASS',
    color: '#007cc3',
    badgeBg: '#e0f2fe',
    badgeText: '#0284c7',
    lpaBonus: 0.6,
    quips: [
      'Spent 6 months at Mysore campus learning Java 8, then put on manual testing.',
      'Founder suggested working 70 hours a week to build national character.',
      'Appraisal rating: "Consistent Performer" (translates to 3.2% hike).',
      'Timesheet was submitted at 11:59 PM on Friday. Still got a warning email.'
    ]
  },
  {
    name: 'Wipro',
    tier: 'MASS',
    color: '#ff6600',
    badgeBg: '#ffedd5',
    badgeText: '#c2410c',
    lpaBonus: 0.6,
    quips: [
      'Offer letter delayed by 8 months. Onboarding held at 7:30 AM.',
      'Fired for allegedly moonlighting because HR spotted a personal GitHub commit.',
      'Manager promised an onsite visa next year. That was 4 years ago.',
      'Laptop delivered without charger. IT ticket closed as "Resolved".'
    ]
  },
  {
    name: 'Tech Mahindra',
    tier: 'MASS',
    color: '#d0021b',
    badgeBg: '#fee2e2',
    badgeText: '#b91c1c',
    lpaBonus: 0.7,
    quips: [
      'Assigned to legacy telecom billing system written in COBOL in 1998.',
      'Attended 4 mandatory agile standups before lunch.',
      'HR organized a Bollywood dance workshop instead of yearly bonus.',
      'Served 90-day notice period. Handover doc was never read.'
    ]
  },
  {
    name: 'Cognizant',
    tier: 'MASS',
    color: '#0033a0',
    badgeBg: '#dbeafe',
    badgeText: '#1d4ed8',
    lpaBonus: 0.8,
    quips: [
      'Promoted to Associate. Got ₹800 extra in in-hand monthly salary.',
      'Client meeting scheduled during India-Pakistan cricket match.',
      'Bench period exceeded 30 days. Received automated exit paperwork.'
    ]
  },
  {
    name: 'Capgemini',
    tier: 'MASS',
    color: '#0070ad',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    lpaBonus: 0.8,
    quips: [
      'Spade logo badge displayed with pride in cafeteria queue.',
      'Worked 14-hour weekend shift for "client delight". Received a coffee mug.',
      'Benched because project was deshipped back to Paris.'
    ]
  },
  {
    name: 'Accenture',
    tier: 'MASS',
    color: '#a100ff',
    badgeBg: '#f3e8ff',
    badgeText: '#7e22ce',
    lpaBonus: 0.9,
    quips: [
      '"High Performance. Delivered." (Specifically, 60 hours of slide decks).',
      'Changed designation from Senior Software Engineer to "Technology Consultant".',
      'Attended a 2-hour design thinking webinar while production was down.'
    ]
  },
  {
    name: 'HCLTech',
    tier: 'MASS',
    color: '#0083ca',
    badgeBg: '#e0f2fe',
    badgeText: '#0284c7',
    lpaBonus: 0.7,
    quips: [
      'Assigned to Noida SEZ tower. Elevator queue took 25 minutes.',
      'Employee engagement team requested selfie with company lanyard.',
      'Manager asked to cancel approved earned leave for client demo.'
    ]
  }
];

export const MNC_COMPANIES: Company[] = [
  {
    name: 'IBM',
    tier: 'MNC',
    color: '#0f62fe',
    badgeBg: '#dbeafe',
    badgeText: '#1d4ed8',
    lpaBonus: 1.5,
    quips: [
      'Put on Watson AI migration that was quietly cancelled three months later.',
      'Blue suit culture replaced by hybrid badge-swipe attendance monitoring.',
      'Requested MacBook for development; received 6kg ThinkPad running Windows 10.'
    ]
  },
  {
    name: 'Concentrix',
    tier: 'MNC',
    color: '#2563eb',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    lpaBonus: 1.2,
    quips: [
      'Process excellence manager scrutinized bathroom break duration in seconds.',
      'Surpassed all quarterly SLA targets. Reward was higher SLA targets.'
    ]
  },
  {
    name: 'Genpact',
    tier: 'MNC',
    color: '#e11d48',
    badgeBg: '#ffe4e6',
    badgeText: '#be123c',
    lpaBonus: 1.4,
    quips: [
      'Six Sigma Black Belt certification completed during 3:00 AM night shift.',
      'Excel sheet with 450,000 rows crashed the VDI machine.'
    ]
  }
];

export const CONSULTING_COMPANIES: Company[] = [
  {
    name: 'Deloitte',
    tier: 'CONSULTING',
    color: '#86bc25',
    badgeBg: '#ecfccb',
    badgeText: '#4d7c0f',
    lpaBonus: 3.5,
    quips: [
      'Green dot on resume. 80-hour week building decks that client CEO ignored.',
      'Stayed at 5-star hotel in Gurgaon, but only slept 3 hours per night.',
      'Billed to client at $250/hour; salary remained ₹14 LPA.'
    ]
  },
  {
    name: 'KPMG',
    tier: 'CONSULTING',
    color: '#00338d',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    lpaBonus: 3.2,
    quips: [
      'Audit season crunch: lived on energy drinks and cafeteria samosas.',
      'Manager scheduled 9 PM sync call titled "Quick 5 min catchup" (lasted 90 mins).'
    ]
  },
  {
    name: 'EY',
    tier: 'CONSULTING',
    color: '#ffe600',
    badgeBg: '#fef9c3',
    badgeText: '#854d0e',
    lpaBonus: 3.4,
    quips: [
      'Building a better working world, one unread weekend email at a time.',
      'Timesheet was 15 minutes late; HR marked the day as Leave Without Pay.'
    ]
  },
  {
    name: 'PwC',
    tier: 'CONSULTING',
    color: '#d04a02',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    lpaBonus: 3.6,
    quips: [
      'Presented digital transformation strategy using 140 PowerPoint slides.',
      'Promotion to Senior Associate delayed due to "macroeconomic headwinds".'
    ]
  }
];

export const FAANG_COMPANIES: Company[] = [
  {
    name: 'Amazon',
    tier: 'FAANG',
    color: '#ff9900',
    badgeBg: '#ffedd5',
    badgeText: '#c2410c',
    lpaBonus: 18.0,
    quips: [
      'Earned 14 Leadership Principles badge. Put on unregretted attrition quota.',
      'On-call pager beeped at 3:14 AM for P1 ticket in Dublin data center.',
      'Two-pizza team reduced to half-pizza team following restructuring.'
    ]
  },
  {
    name: 'Microsoft',
    tier: 'FAANG',
    color: '#00a4ef',
    badgeBg: '#e0f2fe',
    badgeText: '#0284c7',
    lpaBonus: 22.0,
    quips: [
      'Joined for work-life balance. Spent all day reviewing Azure PRs and Teams chats.',
      'Copilot suggested rewriting entire repository. It did not compile.',
      'Stock vest occurred right as the market took a 20% dip.'
    ]
  },
  {
    name: 'Google',
    tier: 'FAANG',
    color: '#4285f4',
    badgeBg: '#dbeafe',
    badgeText: '#1d4ed8',
    lpaBonus: 28.0,
    quips: [
      'Free gourmet micro-kitchen snacks consumed while debugging Bazel build flags.',
      'Internal messaging app you built was cancelled to launch another messaging app.',
      'Promotion committee rejected packet: "Impact not sufficiently Google-scale".'
    ]
  },
  {
    name: 'Meta',
    tier: 'FAANG',
    color: '#0668e1',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    lpaBonus: 32.0,
    quips: [
      'Year of Efficiency: VP announced 10,000 layoffs in a video post.',
      'PSC rating calibrated down by Director to maintain bell curve quota.',
      'Moved fast and broke things, including personal sleep cycle.'
    ]
  },
  {
    name: 'Apple',
    tier: 'FAANG',
    color: '#555555',
    badgeBg: '#f1f5f9',
    badgeText: '#334155',
    lpaBonus: 35.0,
    quips: [
      'Signed 14 NDAs. Couldn’t even tell family which device you were coding for.',
      'Spent 3 weeks choosing the exact border radius for a confirmation dialog.',
      'Black curtain confidentiality protocols strictly monitored at cafeteria tables.'
    ]
  },
  {
    name: 'Netflix',
    tier: 'FAANG',
    color: '#e50914',
    badgeBg: '#fee2e2',
    badgeText: '#991b1b',
    lpaBonus: 40.0,
    quips: [
      'Keeper Test: Manager asked "If you wanted to leave, would I fight to keep you?" (Answer was No).',
      'All-cash compensation was great until generous severance arrived in email.',
      'Chaos Monkey simulated outage in production; your microservice did not recover.'
    ]
  }
];

export function getCompanyForProgression(clearedCount: number, age: number, trackRing: number): Company {
  // Pacing matches PRD:
  // Ages 22-31: Mass hiring companies (TCS, Infosys, Wipro, etc.)
  // Ages 31-41: Transition to MNC & first consulting
  // Ages 41-51: Consulting & early big tech
  // Ages 51-60: FAANG gauntlet
  if (age < 31) {
    const idx = clearedCount % MASS_COMPANIES.length;
    return MASS_COMPANIES[idx];
  } else if (age < 41) {
    const pool = [...MASS_COMPANIES.slice(3), ...MNC_COMPANIES];
    const idx = clearedCount % pool.length;
    return pool[idx];
  } else if (age < 51) {
    const pool = [...MNC_COMPANIES, ...CONSULTING_COMPANIES, FAANG_COMPANIES[0]];
    const idx = clearedCount % pool.length;
    return pool[idx];
  } else {
    // FAANG cycles with ring multiplier
    const idx = (clearedCount) % FAANG_COMPANIES.length;
    const base = FAANG_COMPANIES[idx];
    return {
      ...base,
      lpaBonus: base.lpaBonus * (1 + (trackRing * 0.5))
    };
  }
}

export function formatPackage(lpa: number): string {
  if (lpa >= 100) {
    const cr = (lpa / 100).toFixed(2);
    return `₹${cr} Cr`;
  }
  return `₹${lpa.toFixed(1)} LPA`;
}
