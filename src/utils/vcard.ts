import { TeamMember } from '../types';

/**
 * Generates an RFC 2426 compliant vCard 3.0 string for a given team member.
 */
export function generateVCard(member: TeamMember): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${member.lastName};${member.firstName};;;`,
    `FN:${member.firstName} ${member.lastName}`,
    `TITLE:${member.jobTitle}`,
    'ORG:Lemon Mind Digital',
    `TEL;TYPE=CELL:${member.phoneLink}`,
    `EMAIL;TYPE=INTERNET:${member.email}`,
    'URL:https://lemonmind.agency/',
    'END:VCARD'
  ].join('\r\n');
}

/**
 * Triggers a client-side .vcf file download in the browser.
 */
export function downloadVCard(member: TeamMember): void {
  const content = generateVCard(member);
  const blob = new Blob([content], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${member.firstName}-${member.lastName}.vcf`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 150);
}
