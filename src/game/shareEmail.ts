import { FlightState } from '../types/game';
import { formatPackage } from './companies';
import { CAREER_DOMAINS } from './domains';

export const CREATOR_EMAIL = 'mallickchirantan@gmail.com';

export function buildScoreEmailHref(flight: FlightState): string {
  const domainLabel = CAREER_DOMAINS.find((d) => d.id === flight.domain)?.label ?? 'Analyst';
  const packageText = formatPackage(flight.packageLPA);
  const trackLabel = flight.track.charAt(0).toUpperCase() + flight.track.slice(1);
  const lastCompany = flight.crashedCompany?.name || flight.currentCompany.name;
  const outcome =
    flight.cause === 'clock'
      ? 'Retired at Age 60 (Completed full 75-second career)'
      : flight.cause === 'pipe'
      ? `Terminated at ${lastCompany} (Age ${flight.age.toFixed(1)})`
      : flight.cause === 'ceiling'
      ? `Hit the Corporate Glass Ceiling (Age ${flight.age.toFixed(1)})`
      : `Office Floor Burnout (Age ${flight.age.toFixed(1)})`;

  const subject = `WorkLife Score: ${flight.score} ${
    flight.score === 1 ? 'Company' : 'Companies'
  } Cleared (${packageText}) — ${flight.candidateName}`;

  const bodyLines = [
    'Hey Chirantan,',
    '',
    `I just played WorkLife — Hire & Fire and cleared ${flight.score} ${
      flight.score === 1 ? 'company' : 'companies'
    }!`,
    '',
    '--- Career Run Summary ---',
    `Player: ${flight.candidateName}`,
    `Track & Domain: ${trackLabel} · ${domainLabel}`,
    `Final Designation: ${flight.targetRole}`,
    `Companies Cleared: ${flight.score}`,
    `Final Package (CTC): ${packageText}`,
    `Age Reached: ${flight.age.toFixed(1)} yrs (${flight.elapsedSeconds.toFixed(1)}s / 75s)`,
    `Last Organization: ${lastCompany}`,
    `Outcome: ${outcome}`,
    '',
    'Wanted to share my career run and connect!',
    '',
    'Best,',
    flight.candidateName
  ];

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join('\n')
  });

  // Replace '+' with '%20' so mailto clients render clean spaces instead of plus signs
  const encodedQuery = params.toString().replace(/\+/g, '%20');
  return `mailto:${CREATOR_EMAIL}?${encodedQuery}`;
}
