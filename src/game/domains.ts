import { CareerDomain, Track } from '../types/game';

export interface CareerDomainOption {
  id: CareerDomain;
  label: string;
  focus: string;
}

export const DEFAULT_CAREER_DOMAIN: CareerDomain = 'analyst';

export const CAREER_DOMAINS: CareerDomainOption[] = [
  {
    id: 'analyst',
    label: 'Analyst',
    focus: 'SQL · BI Decks',
  },
  {
    id: 'developer',
    label: 'Developer',
    focus: 'Full-Stack · Code',
  },
  {
    id: 'devops',
    label: 'Cloud & DevOps',
    focus: 'K8s · SRE Alerts',
  },
  {
    id: 'ai',
    label: 'AI & Data',
    focus: 'ML · LLM Ops',
  },
  {
    id: 'qa',
    label: 'QA & SDET',
    focus: 'Selenium · Suites',
  },
  {
    id: 'product',
    label: 'Product',
    focus: 'PRDs · Roadmaps',
  },
];

export function isValidCareerDomain(value: string | null): value is CareerDomain {
  return CAREER_DOMAINS.some((item) => item.id === value);
}

export function getDomainOption(domain: CareerDomain): CareerDomainOption {
  return CAREER_DOMAINS.find((item) => item.id === domain) || CAREER_DOMAINS[0];
}

export function getRoleTitleForProgression(
  domain: CareerDomain,
  track: Track,
  age: number
): string {
  switch (domain) {
    case 'analyst':
      if (track === 'fresher') {
        if (age < 26) return 'Junior Analyst';
        if (age < 32) return 'Business Analyst';
        if (age < 42) return 'Senior Data Analyst';
        if (age < 52) return 'Analytics Manager';
        return 'VP (Business Insights)';
      }
      if (track === 'associate') {
        if (age < 30) return 'Associate Business Analyst';
        if (age < 38) return 'Lead Data Analyst';
        if (age < 48) return 'Principal BI Architect';
        return 'Director of Analytics';
      }
      if (age < 32) return 'Lead Analytics Consultant';
      if (age < 42) return 'Head of Data Strategy';
      if (age < 52) return 'VP of Business Intelligence';
      return 'Chief Data Officer';

    case 'developer':
      if (track === 'fresher') {
        if (age < 26) return 'Junior Developer';
        if (age < 32) return 'Software Engineer';
        if (age < 42) return 'Senior Software Engineer';
        if (age < 52) return 'Engineering Manager';
        return 'VP of Engineering';
      }
      if (track === 'associate') {
        if (age < 30) return 'Software Engineer II';
        if (age < 38) return 'Technical Lead';
        if (age < 48) return 'Principal Architect';
        return 'Director of Engineering';
      }
      if (age < 32) return 'Staff Software Engineer';
      if (age < 42) return 'Senior Engineering Manager';
      if (age < 52) return 'VP of Technology';
      return 'Distinguished Engineer';

    case 'devops':
      if (track === 'fresher') {
        if (age < 26) return 'Cloud Support Trainee';
        if (age < 32) return 'DevOps Engineer';
        if (age < 42) return 'Senior Site Reliability Eng.';
        if (age < 52) return 'Cloud Infrastructure Lead';
        return 'VP of Cloud Platform';
      }
      if (track === 'associate') {
        if (age < 30) return 'Site Reliability Engineer';
        if (age < 38) return 'Lead Platform Engineer';
        if (age < 48) return 'Principal Cloud Architect';
        return 'Director of Infrastructure';
      }
      if (age < 32) return 'Staff SRE';
      if (age < 42) return 'Head of Platform Eng.';
      if (age < 52) return 'VP of Cloud Operations';
      return 'Chief Infrastructure Architect';

    case 'ai':
      if (track === 'fresher') {
        if (age < 26) return 'Junior ML Analyst';
        if (age < 32) return 'Data Scientist';
        if (age < 42) return 'Applied AI Engineer';
        if (age < 52) return 'Machine Learning Lead';
        return 'VP of AI Research';
      }
      if (track === 'associate') {
        if (age < 30) return 'Machine Learning Engineer';
        if (age < 38) return 'Senior Data Scientist';
        if (age < 48) return 'Principal AI Architect';
        return 'Director of Machine Learning';
      }
      if (age < 32) return 'Staff AI Scientist';
      if (age < 42) return 'Head of Generative AI';
      if (age < 52) return 'VP of Artificial Intelligence';
      return 'Chief AI Scientist';

    case 'qa':
      if (track === 'fresher') {
        if (age < 26) return 'QA Trainee';
        if (age < 32) return 'Test Automation Engineer';
        if (age < 42) return 'Senior SDET';
        if (age < 52) return 'QA Delivery Manager';
        return 'VP of Quality Engineering';
      }
      if (track === 'associate') {
        if (age < 30) return 'Automation Engineer (SDET)';
        if (age < 38) return 'Lead QA Architect';
        if (age < 48) return 'Principal Quality Strategist';
        return 'Director of Quality Assurance';
      }
      if (age < 32) return 'Staff SDET';
      if (age < 42) return 'Head of Quality Engineering';
      if (age < 52) return 'VP of Release Reliability';
      return 'Chief Quality Officer';

    case 'product':
      if (track === 'fresher') {
        if (age < 26) return 'Associate Product Analyst';
        if (age < 32) return 'Product Executive';
        if (age < 42) return 'Product Manager';
        if (age < 52) return 'Group Product Manager';
        return 'VP of Product';
      }
      if (track === 'associate') {
        if (age < 30) return 'Product Manager';
        if (age < 38) return 'Senior Product Manager';
        if (age < 48) return 'Principal Product Lead';
        return 'Director of Product';
      }
      if (age < 32) return 'Group Product Manager';
      if (age < 42) return 'Head of Product Strategy';
      if (age < 52) return 'VP of Product Management';
      return 'Chief Product Officer';
  }
}
