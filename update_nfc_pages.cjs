const fs = require('fs');
const path = require('path');

const EQUIPE_DIR = path.join(__dirname, 'equipe');

const cardsFile = path.join(__dirname, 'data', 'cards.json');
const cards = JSON.parse(fs.readFileSync(cardsFile, 'utf8'));

const members = cards.map(c => ({
  slug: c.slug,
  firstName: c.firstName,
  lastName: c.lastName,
  fullName: c.fullName || `${c.firstName} ${c.lastName}`,
  jobTitle: c.jobTitle || c.profession,
  profession: c.profession,
  badge: c.badge || c.jobTitle,
  phone: c.phone,
  phoneClean: c.phoneClean || c.phone.replace(/[^0-9]/g, ''),
  email: c.email,
  photo: c.photo ? c.photo.replace(/^\/photos\//, '') : `${c.slug}.webp`
}));

function generateHtml(m) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${m.fullName} — ${m.profession} | LemonMind Agency</title>
  <meta name="description" content="Contactez ${m.fullName}, ${m.profession} chez LemonMind Agency. Téléphone direct : ${m.phone}, Email : ${m.email}.">
  <meta name="author" content="LemonMind Agency">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#FFD400">

  <!-- Performance Preloads -->
  <link rel="preload" as="image" href="../assets/logo-header.png" type="image/png">
  <link rel="preload" as="image" href="../assets/photos/${m.photo}" type="image/webp">

  <!-- Open Graph -->
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${m.fullName} — ${m.profession}">
  <meta property="og:description" content="Contactez ${m.fullName}, ${m.profession} chez LemonMind Agency. Téléphone direct : ${m.phone}, Email : ${m.email}.">
  <meta property="og:image" content="../assets/photos/${m.photo}">
  <meta property="og:site_name" content="LemonMind Agency">
  <meta property="og:locale" content="fr_FR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${m.fullName} — ${m.profession}">
  <meta name="twitter:description" content="Contactez ${m.fullName}, ${m.profession} chez LemonMind Agency. Téléphone direct : ${m.phone}, Email : ${m.email}.">
  <meta name="twitter:image" content="../assets/photos/${m.photo}">

  <!-- Favicon -->
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">

  <!-- Google Fonts Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">

  <!-- Master Stylesheet -->
  <link rel="stylesheet" href="../css/style.css">

  <!-- Structured Data JSON-LD (Person Schema) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "${m.fullName}",
    "jobTitle": "${m.profession}",
    "telephone": "${m.phone}",
    "email": "${m.email}",
    "image": "../assets/photos/${m.photo}",
    "worksFor": {
      "@type": "Organization",
      "name": "LemonMind Agency",
      "url": "https://lemonmind.agency/"
    }
  }
  </script>
</head>
<body class="nfc-page">
    <!-- Header Sophistiqué de Luxe -->
  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="../index.html" class="header-brand" aria-label="LemonMind Agency — Accueil">
        <img
          src="../assets/logo-header.png"
          alt="LemonMind Agency"
          class="header-logo-img"
          width="135"
          height="48"
          loading="eager"
        >
      </a>

      <nav class="header-nav" aria-label="Navigation principale">
        <a href="../index.html" class="header-nav-link active" aria-current="page">
          <span class="nav-link-dot" aria-hidden="true"></span>
          <span>L'équipe</span>
        </a>
        <a
          href="https://lemonmind.agency/"
          target="_blank"
          rel="noopener noreferrer"
          class="header-nav-link external header-agency-btn"
          aria-label="Site officiel de LemonMind Agency (ouvre un nouvel onglet)"
        >
          <span>Site de l'agence</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.3"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </nav>
    </div>
  </header>

  <!-- Profile / NFC Content -->
  <main class="container profile-page-container nfc-experience" id="main-content">
    <div class="nfc-ambient-spotlight" aria-hidden="true"></div>

    <div class="nfc-stage-wrapper">
      <!-- NFC Top Bar -->
      <div class="nfc-top-bar">
        <!-- Back to Team Button -->
        <a href="../index.html" class="back-link-btn" id="btn-back-${m.slug}" aria-label="Retourner à la grille de l'équipe">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>L'équipe</span>
        </a>

        <!-- NFC Active Status Pill -->
        <div class="nfc-status-pill" aria-label="Carte NFC connectée">
          <span class="nfc-live-pulse" aria-hidden="true"></span>
          <svg class="nfc-icon-contactless" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 8a8 8 0 0 1 12 0"/>
            <path d="M9 11a4 4 0 0 1 6 0"/>
            <circle cx="12" cy="14" r="1" fill="currentColor"/>
          </svg>
          <span>NFC PASS ACTIF</span>
        </div>
      </div>

      <!-- THE CARD (RECTO) -->
      <div class="nfc-card-container">
        <div class="identity-panel gold">
          <div class="gold-specular-sheen" aria-hidden="true"></div>
          <div class="gold-bevel-rim" aria-hidden="true"></div>

          <div class="identity-portrait-frame">
            <img
              src="../assets/photos/${m.photo}"
              alt="Portrait officiel de ${m.fullName}"
              class="identity-portrait-img"
              loading="eager"
              decoding="async"
              width="400"
              height="420"
            >
          </div>

          <div class="identity-content-block">
            <div class="identity-panel-badge gold-badge">
              ${m.badge}
            </div>

            <h1 class="identity-panel-name">
              ${m.firstName}<br>${m.lastName}
            </h1>

            <p class="identity-panel-job">${m.profession}</p>

            <div class="identity-panel-footer">
              <span>Organisation : <strong>Lemon Mind Digital</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- COORDONNÉES PANEL (White Luxury Prestige) -->
      <div class="contact-details-panel">
        <div class="luxury-coords-card">
          <!-- Coordonnées Header -->
          <div class="contact-section-title">
            <div class="contact-title-with-badge">
              <span class="gold-badge-dot" aria-hidden="true"></span>
              <span>Coordonnées</span>
            </div>
            <span class="contact-badge-corp">LemonMind Agency</span>
          </div>

          <!-- 3 Luxury Contact Rows: Simple, Élégant, Organisé -->
          <div class="luxury-coords-list">
            <!-- 1. Téléphone Direct -->
            <div class="luxury-coord-tile">
              <div class="luxury-coord-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div class="luxury-coord-info">
                <span class="luxury-coord-label">Téléphone direct</span>
                <a href="tel:${m.phone}" class="luxury-coord-value" id="text-phone-${m.slug}">
                  ${m.phone}
                </a>
              </div>
              <div class="luxury-coord-actions">
                <a href="tel:${m.phone}" class="luxury-tile-action-btn phone" aria-label="Appeler ${m.fullName}" title="Appeler">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </a>
                <a href="https://wa.me/${m.phoneClean}" target="_blank" rel="noopener noreferrer" class="luxury-tile-action-btn whatsapp" aria-label="WhatsApp ${m.fullName}" title="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- 2. E-mail Professionnel -->
            <div class="luxury-coord-tile">
              <div class="luxury-coord-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div class="luxury-coord-info">
                <span class="luxury-coord-label">E-mail professionnel</span>
                <a href="mailto:${m.email}" class="luxury-coord-value" id="text-email-${m.slug}">
                  ${m.email}
                </a>
              </div>
              <div class="luxury-coord-actions">
                <a href="mailto:${m.email}" class="luxury-tile-action-btn mail" aria-label="Envoyer un e-mail à ${m.fullName}" title="Envoyer un e-mail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- 3. Agence & Localisation -->
            <div class="luxury-coord-tile">
              <div class="luxury-coord-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <div class="luxury-coord-info">
                <span class="luxury-coord-label">Agence digitale</span>
                <a href="https://lemonmind.agency/" target="_blank" rel="noopener noreferrer" class="luxury-coord-value">
                  Casablanca • lemonmind.agency
                </a>
              </div>
              <div class="luxury-coord-actions">
                <a href="https://lemonmind.agency/" target="_blank" rel="noopener noreferrer" class="luxury-tile-action-btn web" aria-label="Visiter le site de LemonMind Agency" title="Visiter le site">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Bottom Action: Enregistrer (.vcf) ONLY -->
          <div class="luxury-coord-footer">
            <button
              type="button"
              class="luxury-action-pill vcard-btn"
              id="btn-vcard-${m.slug}"
              onclick="downloadVCard('${m.firstName}', '${m.lastName}', '${m.profession}', '${m.phone}', '${m.email}')"
              aria-label="Enregistrer la fiche de contact de ${m.fullName} (.vcf)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              <span>Enregistrer (.vcf)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>

    <!-- Footer -->
  <footer class="site-footer" role="contentinfo">
    <div class="container footer-inner">
      <div class="footer-main">
        <!-- Marque & Tagline -->
        <div class="footer-brand-block">
          <a href="../index.html" class="footer-logo-link" aria-label="LemonMind Agency — Accueil">
            <img
              src="../assets/logo-header.png"
              alt="LemonMind Agency"
              class="footer-logo-img"
              width="100"
              height="38"
              loading="lazy"
              decoding="async"
            >
          </a>
          <span class="footer-tagline">Digital Agency</span>
        </div>

        <!-- Coordonnées Agence -->
        <div class="footer-contacts-block">
          <a href="tel:+212661768009" class="footer-contact-item" aria-label="Téléphone de l'agence : +212 661-768009">
            <span class="footer-contact-icon-wrapper" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <span class="footer-contact-text">+212 661-768009</span>
          </a>

          <a href="mailto:contact@lemonmind.agency" class="footer-contact-item" aria-label="Email de l'agence : contact@lemonmind.agency">
            <span class="footer-contact-icon-wrapper" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </span>
            <span class="footer-contact-text">contact@lemonmind.agency</span>
          </a>
        </div>

        <!-- Réseaux Sociaux Officiels -->
        <div class="footer-social-block" aria-label="Réseaux sociaux LemonMind Agency">
          <a href="https://www.facebook.com/lemonmind.agency/" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="Facebook LemonMind Agency" title="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/lemonmind.agency/" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="Instagram LemonMind Agency" title="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/lemonmind-agency/posts/?feedView=all" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="LinkedIn LemonMind Agency" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Séparateur & Droits Réservés -->
      <div class="footer-bottom">
        <p class="footer-copyright">© <span data-current-year>2026</span> LemonMind Agency. Tous droits réservés.</p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="../js/main.js" defer></script>
  <script>
    function downloadVCard(firstName, lastName, jobTitle, phone, email) {
      const vcardContent = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        \`FN:\${firstName} \${lastName}\`,
        \`N:\${lastName};\${firstName};;;\`,
        'ORG:Lemon Mind Digital;',
        \`TITLE:\${jobTitle}\`,
        \`TEL;TYPE=CELL,VOICE:\${phone}\`,
        \`EMAIL;TYPE=WORK,INTERNET:\${email}\`,
        'URL;TYPE=WORK:https://lemonmind.agency/',
        'ADR;TYPE=WORK:;;Casablanca;Casablanca;;;Morocco',
        'END:VCARD'
      ].join('\\r\\n');

      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', \`\${firstName}_\${lastName}_LemonMind.vcf\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

console.log('Generating optimized, professional luxury NFC HTML files for 9 team members...');
members.forEach(m => {
  const filePath = path.join(EQUIPE_DIR, `${m.slug}.html`);
  fs.writeFileSync(filePath, generateHtml(m), 'utf8');
  console.log(`✅ Generated: equipe/${m.slug}.html`);
});
console.log('✨ All 9 NFC profiles regenerated!');
