const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');

// ============================================================
// Configuration
// ============================================================
const PORT = 3001;
const JWT_SECRET = 'lm_admin_jwt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
const JWT_EXPIRY = '24h';
const DATA_DIR = path.join(__dirname, 'data');
const CARDS_FILE = path.join(DATA_DIR, 'cards.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PHOTOS_DIR = path.join(__dirname, 'assets', 'photos');
const EQUIPE_DIR = path.join(__dirname, 'equipe');

// ============================================================
// Initialize data files
// ============================================================
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });
if (!fs.existsSync(EQUIPE_DIR)) fs.mkdirSync(EQUIPE_DIR, { recursive: true });

// Create default admin user if users.json doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  const defaultPassword = bcrypt.hashSync('LemonMind2026!', 12);
  const users = [{
    id: 'admin',
    username: 'admin',
    password: defaultPassword,
    role: 'admin',
    createdAt: new Date().toISOString()
  }];
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  console.log('✅ Default admin user created (username: admin, password: LemonMind2026!)');
}

// ============================================================
// Helpers
// ============================================================
function readCards() {
  if (!fs.existsSync(CARDS_FILE)) return [];
  return JSON.parse(fs.readFileSync(CARDS_FILE, 'utf8'));
}
function writeCards(cards) {
  fs.writeFileSync(CARDS_FILE, JSON.stringify(cards, null, 2), 'utf8');
}
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function slugify(text) {
  return text.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================
// Multer config for photo uploads
// ============================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PHOTOS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webp';
    const slug = req.params.id || 'upload-' + Date.now();
    cb(null, slug + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    cb(null, extname && mimetype);
  }
});

// ============================================================
// NFC Page Generator (same template as update_nfc_pages.cjs)
// ============================================================
function generateNfcHtml(m) {
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

function regenerateNfcPage(card) {
  const photoFile = card.photo ? card.photo.replace(/^\/photos\//, '') : `${card.slug}.webp`;
  const m = {
    slug: card.slug,
    firstName: card.firstName,
    lastName: card.lastName,
    fullName: card.fullName || `${card.firstName} ${card.lastName}`,
    jobTitle: card.jobTitle || card.profession,
    profession: card.profession,
    badge: card.badge || card.jobTitle,
    phone: card.phone,
    phoneClean: (card.phoneClean || card.phone.replace(/[^0-9]/g, '')),
    email: card.email,
    photo: photoFile
  };
  const html = generateNfcHtml(m);
  const filePath = path.join(EQUIPE_DIR, `${card.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Regenerated NFC page: equipe/${card.slug}.html`);
}

function deleteNfcPage(slug) {
  const filePath = path.join(EQUIPE_DIR, `${slug}.html`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️  Deleted NFC page: equipe/${slug}.html`);
  }
}

// ============================================================
// Homepage Synchronizer (index.html)
// ============================================================
function generateIndexTeamSection(cards) {
  const published = cards
    .filter(c => c.status === 'published')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const featured = published.filter(c => c.featured);
  const others = published.filter(c => !c.featured);

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPhoto(c) {
    if (!c.photo) return 'assets/logo-header.png';
    return c.photo.startsWith('/') ? `assets${c.photo}` : `assets/${c.photo}`;
  }

  let html = `    <!-- Team Showcase Section -->\n    <section class="team-grid-section container" aria-label="Présentation des membres de l'équipe">\n`;

  if (featured.length > 0) {
    html += `      <!-- Featured Gold Cards Grid -->\n      <div class="featured-cards-grid">\n`;
    featured.forEach((c, idx) => {
      const photoSrc = getPhoto(c);
      const fullName = escapeHtml(c.fullName || `${c.firstName} ${c.lastName}`);
      const firstName = escapeHtml(c.firstName || '');
      const lastName = escapeHtml(c.lastName || '');
      const role = escapeHtml(c.profession || c.jobTitle || c.badge || 'Direction');
      const badge = escapeHtml(c.badge || c.profession || c.jobTitle || 'Direction');

      html += `        <!-- ${idx + 1}. ${fullName} -->
        <div class="featured-card-wrapper">
          <a
            href="equipe/${c.slug}.html"
            class="amal-gold-card"
            id="card-${c.slug}"
            aria-label="Découvrir le profil de ${fullName}, ${role}"
          >
            <div class="gold-surface">
              <div class="gold-specular-sheen" aria-hidden="true"></div>
              <div class="gold-bevel-rim" aria-hidden="true"></div>
              <div class="gold-card-layout">
                <div class="gold-portrait-container">
                  <img
                    src="${photoSrc}"
                    alt="Portrait officiel de ${fullName}"
                    class="gold-portrait-img"
                    loading="eager"
                    decoding="async"
                    onerror="this.src='assets/logo-header.png'"
                    width="400"
                    height="420"
                  >
                </div>
                <div class="gold-card-content">
                  <div class="gold-info-block">
                    <div class="gold-badge">
                      <span class="gold-badge-dot" aria-hidden="true"></span>
                      ${badge}
                    </div>
                    <h2 class="gold-name">
                      ${firstName}<br>${lastName}
                    </h2>
                  </div>
                  <div class="gold-cta-button">
                    <span>Découvrir le profil</span>
                    <span class="gold-cta-arrow" aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>\n`;
    });
    html += `      </div>\n\n`;
  }

  if (others.length > 0) {
    const colClass = others.length >= 3 ? ' three-cols' : '';
    html += `      <!-- Other Team Members Grid (${others.length} members) -->\n      <div class="team-grid${colClass}" id="team-grid">\n`;
    others.forEach((c, idx) => {
      const photoSrc = getPhoto(c);
      const fullName = escapeHtml(c.fullName || `${c.firstName} ${c.lastName}`);
      const role = escapeHtml(c.badge || c.jobTitle || c.profession || 'LemonMind');

      html += `        <!-- ${featured.length + idx + 1}. ${fullName} -->
        <div class="team-card-wrapper reveal-on-scroll" style="display: flex;">
          <a
            href="equipe/${c.slug}.html"
            class="team-card"
            id="card-${c.slug}"
            aria-label="Voir le profil de ${fullName}, ${role}"
            style="width: 100%;"
          >
            <div class="team-card-portrait-wrapper">
              <img
                src="${photoSrc}"
                alt="Portrait de ${fullName}"
                class="team-card-portrait-img"
                loading="lazy"
                decoding="async"
                onerror="this.src='assets/logo-header.png'"
                width="300"
                height="300"
              >
              <div class="gold-portrait-sheen" aria-hidden="true"></div>
            </div>
            <div class="team-card-info-section">
              <div class="team-card-body">
                <span class="team-card-role-tag">${role}</span>
                <h3 class="team-card-name">${fullName}</h3>
              </div>
              <div class="team-card-footer">
                <span class="team-card-hint">Coordonnées directes</span>
                <div class="team-card-arrow-circle" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </div>\n`;
    });
    html += `      </div>\n`;
  }

  html += `    </section>`;
  return html;
}

function regenerateIndexHtml() {
  const indexPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(indexPath)) return;

  const cards = readCards();
  const newSection = generateIndexTeamSection(cards);

  let content = fs.readFileSync(indexPath, 'utf8');

  const markerRegex = /<!-- BEGIN_TEAM_SHOWCASE -->[\s\S]*?<!-- END_TEAM_SHOWCASE -->/;
  if (markerRegex.test(content)) {
    content = content.replace(markerRegex, `<!-- BEGIN_TEAM_SHOWCASE -->\n${newSection}\n    <!-- END_TEAM_SHOWCASE -->`);
  } else {
    const fallbackRegex = /<!-- Team Showcase Section -->[\s\S]*?<\/section>\s*(?=<\/main>)/;
    if (fallbackRegex.test(content)) {
      content = content.replace(fallbackRegex, `<!-- BEGIN_TEAM_SHOWCASE -->\n${newSection}\n    <!-- END_TEAM_SHOWCASE -->\n  `);
    } else {
      console.warn('⚠️ Could not find team showcase section in index.html to replace');
      return;
    }
  }

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✅ Synchronized index.html with published cards');

  // Also sync dist/index.html if exists
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'index.html'), content, 'utf8');
  }
}

// ============================================================
// Express App
// ============================================================
const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname)));

// Root route serves the public LemonMind website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================
// Auth Middleware
// ============================================================
function authMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Non autorisé' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

// ============================================================
// AUTH Routes
// ============================================================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Identifiants requis' });

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
  res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/change-password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Mots de passe requis' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });

  const users = readUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
  }

  user.password = bcrypt.hashSync(newPassword, 12);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  res.json({ success: true });
});

// ============================================================
// CARDS CRUD Routes
// ============================================================

// GET all cards
app.get('/api/cards', authMiddleware, (req, res) => {
  const cards = readCards();
  res.json(cards);
});

// GET single card
app.get('/api/cards/:id', authMiddleware, (req, res) => {
  const cards = readCards();
  const card = cards.find(c => c.id === req.params.id);
  if (!card) return res.status(404).json({ error: 'Carte non trouvée' });
  res.json(card);
});

// CREATE card
app.post('/api/cards', authMiddleware, (req, res) => {
  const cards = readCards();
  const { firstName, lastName, jobTitle, profession, badge, department, phone, whatsapp, email, location, website, linkedin, status, featured } = req.body;

  if (!firstName || !lastName) return res.status(400).json({ error: 'Prénom et nom requis' });

  const slug = slugify(`${firstName} ${lastName}`);
  if (cards.find(c => c.slug === slug)) {
    return res.status(409).json({ error: 'Une carte avec ce nom existe déjà' });
  }

  const now = new Date().toISOString();
  const newCard = {
    id: slug,
    slug,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    jobTitle: jobTitle || '',
    profession: profession || jobTitle || '',
    badge: badge || jobTitle || '',
    department: department || '',
    organization: 'Lemon Mind Digital',
    phone: phone || '',
    phoneClean: (phone || '').replace(/[^0-9]/g, ''),
    phoneLink: phone || '',
    whatsapp: whatsapp || phone || '',
    email: email || '',
    location: location || 'Casablanca, Maroc',
    website: website || 'https://lemonmind.agency/',
    linkedin: linkedin || '',
    photo: `/photos/${slug}.webp`,
    order: cards.length + 1,
    featured: featured === true || featured === 'true',
    status: status || 'published',
    createdAt: now,
    updatedAt: now
  };

  cards.push(newCard);
  writeCards(cards);

  // If published, generate NFC page immediately
  if (newCard.status === 'published') {
    regenerateNfcPage(newCard);
  }
  // Synchronize homepage
  regenerateIndexHtml();

  res.status(201).json(newCard);
});

// UPDATE card
app.put('/api/cards/:id', authMiddleware, (req, res) => {
  const cards = readCards();
  const index = cards.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Carte non trouvée' });

  const existing = cards[index];
  const updates = req.body;

  // If slug changed, check for conflicts
  if (updates.slug && updates.slug !== existing.slug) {
    if (cards.find(c => c.slug === updates.slug && c.id !== existing.id)) {
      return res.status(409).json({ error: 'Ce slug est déjà utilisé' });
    }
  }

  const updated = {
    ...existing,
    ...updates,
    id: existing.id, // ID cannot change
    updatedAt: new Date().toISOString()
  };

  // Recalculate phone clean
  if (updates.phone) {
    updated.phoneClean = updates.phone.replace(/[^0-9]/g, '');
    updated.phoneLink = updates.phone;
  }
  if (updates.firstName || updates.lastName) {
    updated.fullName = `${updated.firstName} ${updated.lastName}`;
  }

  cards[index] = updated;
  writeCards(cards);

  // If published, regenerate NFC page, otherwise remove
  if (updated.status === 'published') {
    regenerateNfcPage(updated);
  } else {
    deleteNfcPage(updated.slug);
  }
  // Synchronize homepage
  regenerateIndexHtml();

  res.json(updated);
});

// PUBLISH / UNPUBLISH card
app.post('/api/cards/:id/publish', authMiddleware, (req, res) => {
  const cards = readCards();
  const index = cards.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Carte non trouvée' });

  cards[index].status = 'published';
  cards[index].updatedAt = new Date().toISOString();
  writeCards(cards);
  regenerateNfcPage(cards[index]);
  regenerateIndexHtml();
  res.json(cards[index]);
});

app.post('/api/cards/:id/unpublish', authMiddleware, (req, res) => {
  const cards = readCards();
  const index = cards.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Carte non trouvée' });

  cards[index].status = 'draft';
  cards[index].updatedAt = new Date().toISOString();
  writeCards(cards);
  deleteNfcPage(cards[index].slug);
  regenerateIndexHtml();
  res.json(cards[index]);
});

// DELETE card
app.delete('/api/cards/:id', authMiddleware, (req, res) => {
  const cards = readCards();
  const index = cards.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Carte non trouvée' });

  const card = cards[index];

  // Delete NFC page
  deleteNfcPage(card.slug);

  // Remove from array
  cards.splice(index, 1);
  writeCards(cards);
  regenerateIndexHtml();

  res.json({ success: true, deleted: card.id });
});

// UPLOAD photo
app.post('/api/cards/:id/photo', authMiddleware, upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucune photo fournie' });

  const cards = readCards();
  const index = cards.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Carte non trouvée' });

  const ext = path.extname(req.file.filename);
  const photoPath = `/photos/${req.params.id}${ext}`;
  cards[index].photo = photoPath;
  cards[index].updatedAt = new Date().toISOString();
  writeCards(cards);

  // Regenerate if published
  if (cards[index].status === 'published') {
    regenerateNfcPage(cards[index]);
  }
  regenerateIndexHtml();

  res.json({ success: true, photo: photoPath });
});

// REORDER cards
app.post('/api/cards/reorder', authMiddleware, (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds requis' });

  const cards = readCards();
  orderedIds.forEach((id, i) => {
    const card = cards.find(c => c.id === id);
    if (card) card.order = i + 1;
  });
  cards.sort((a, b) => a.order - b.order);
  writeCards(cards);
  regenerateIndexHtml();
  res.json({ success: true });
});

// Regenerate ALL published NFC pages & homepage
app.post('/api/regenerate', authMiddleware, (req, res) => {
  const cards = readCards();
  let count = 0;
  cards.filter(c => c.status === 'published').forEach(card => {
    regenerateNfcPage(card);
    count++;
  });
  regenerateIndexHtml();
  res.json({ success: true, regenerated: count });
});

// Public read-only cards endpoint
app.get('/api/public-cards', (req, res) => {
  const cards = readCards();
  const published = cards
    .filter(c => c.status === 'published')
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(c => ({
      id: c.id,
      slug: c.slug,
      firstName: c.firstName,
      lastName: c.lastName,
      fullName: c.fullName || `${c.firstName} ${c.lastName}`,
      profession: c.profession || c.jobTitle,
      badge: c.badge || c.jobTitle,
      photo: c.photo,
      featured: !!c.featured
    }));
  res.json(published);
});

// Stats
app.get('/api/stats', authMiddleware, (req, res) => {
  const cards = readCards();
  res.json({
    total: cards.length,
    published: cards.filter(c => c.status === 'published').length,
    draft: cards.filter(c => c.status === 'draft').length,
    departments: [...new Set(cards.map(c => c.department).filter(Boolean))]
  });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🍋 LemonMind Admin API running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🔑 Default login: admin / LemonMind2026!\n`);
});
