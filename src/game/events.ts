import { CorporateEvent } from '../types/game';

export const CORPORATE_EVENTS: CorporateEvent[] = [
  {
    id: 'bond_period',
    triggerAgeMin: 22.5,
    triggerAgeMax: 25.5,
    headline: 'BOND PERIOD ACTIVE',
    subtext: '2-year service agreement locked. Penalty for premature resignation: ₹2,00,000.',
    severity: 'warning'
  },
  {
    id: 'mandatory_rto',
    triggerAgeMin: 27.0,
    triggerAgeMax: 30.0,
    headline: 'MANDATORY RETURN-TO-OFFICE',
    subtext: '5 days a week in office. Turnstile badge swipes linked directly to monthly payroll.',
    severity: 'alert'
  },
  {
    id: 'bell_curve',
    triggerAgeMin: 32.0,
    triggerAgeMax: 35.0,
    headline: 'ANNUAL APPRAISAL: RATING 2.5/5',
    subtext: 'Bell curve normalization applied. "Exceeds Expectations" quota was exhausted.',
    severity: 'info'
  },
  {
    id: 'pizza_party',
    triggerAgeMin: 37.0,
    triggerAgeMax: 40.0,
    headline: 'PIZZA PARTY ANNOUNCED',
    subtext: 'Company records $1.2B quarterly profit! Leadership celebrates with 2 cheese slices.',
    severity: 'info'
  },
  {
    id: 'client_escalation',
    triggerAgeMin: 42.0,
    triggerAgeMax: 45.0,
    headline: 'CLIENT P1 SEV-1 ESCALATION',
    subtext: 'Production down on Sunday evening. All-hands bridge call dial-in mandatory.',
    severity: 'alert'
  },
  {
    id: 'pip_warning',
    triggerAgeMin: 47.0,
    triggerAgeMax: 50.0,
    headline: 'PIP PROTOCOL INITIATED',
    subtext: 'Skip manager instituted a 30-day Performance Improvement Plan. Start interviewing.',
    severity: 'warning'
  },
  {
    id: 'silent_layoffs',
    triggerAgeMin: 52.0,
    triggerAgeMax: 55.0,
    headline: 'ORGANIZATIONAL RESTRUCTURING',
    subtext: '12% workforce optimization underway to "streamline operational synergies".',
    severity: 'alert'
  },
  {
    id: 'faang_recruit',
    triggerAgeMin: 56.0,
    triggerAgeMax: 59.0,
    headline: 'FAANG RECRUITER INMAIL',
    subtext: '"Hey, saw your impressive profile! Have time for a 6-round DSA marathon?"',
    severity: 'info'
  }
];
