/**
 * LemonMind Agency — Vanilla JavaScript
 * High performance, zero framework overhead, fully responsive.
 */

// 1. Dynamic Specular Sheen for Gold Cards and Panels
document.addEventListener('DOMContentLoaded', () => {
  const surfaces = document.querySelectorAll('.gold-surface, .identity-panel.gold');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    surfaces.forEach((surface) => {
      surface.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const rect = surface.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        surface.style.setProperty('--mouse-x', `${x}%`);
        surface.style.setProperty('--mouse-y', `${y}%`);
      });

      surface.addEventListener('pointerleave', () => {
        surface.style.setProperty('--mouse-x', '50%');
        surface.style.setProperty('--mouse-y', '30%');
      });
    });
  }

  // 2. Keyboard shortcut: 'Escape' to go back to the team grid
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const backBtn = document.querySelector('.back-link-btn');
      if (backBtn) {
        backBtn.click();
      }
    }
  });

  // 3. Update current year dynamically in footer
  const yearEls = document.querySelectorAll('[data-current-year]');
  const currentYear = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = currentYear;
  });
});

/**
 * Generates and downloads an RFC 2426 compliant vCard (.vcf)
 */
function downloadVCard(firstName, lastName, profession, phone, email) {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${firstName} ${lastName}`,
    `TITLE:${profession}`,
    'ORG:LemonMind Agency',
    `TEL;TYPE=CELL:${phone}`,
    `EMAIL;TYPE=INTERNET:${email}`,
    'URL:https://lemonmind.agency/',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${firstName}-${lastName}.vcf`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 150);
}
