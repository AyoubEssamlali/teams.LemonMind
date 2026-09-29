import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMemberBySlug, getFullName } from '../data/teamData';
import { downloadVCard } from '../utils/vcard';

export const ProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const goldPanelRef = useRef<HTMLDivElement>(null);

  const member = slug ? getMemberBySlug(slug) : undefined;

  useEffect(() => {
    if (member) {
      document.title = `${getFullName(member)} — LemonMind Agency`;
    } else {
      document.title = "Profil introuvable — LemonMind Agency";
    }
    window.scrollTo(0, 0);
  }, [member]);

  // Pointer specular tracking for Amal's gold identity panel
  const handleGoldPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (e.pointerType === 'touch') return;

    const el = goldPanelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    el.style.setProperty('--mouse-x', `${x}%`);
    el.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleGoldPointerLeave = () => {
    const el = goldPanelRef.current;
    if (!el) return;
    el.style.setProperty('--mouse-x', '50%');
    el.style.setProperty('--mouse-y', '30%');
  };

  if (!member) {
    return (
      <main className="container profile-page-container" id="main-content">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <h1 className="font-heading" style={{ fontSize: '36px', marginBottom: '16px' }}>
            Profil introuvable
          </h1>
          <p style={{ color: 'var(--color-grey-600)', marginBottom: '32px', fontSize: '18px' }}>
            Le profil demandé n'existe pas ou a été déplacé.
          </p>
          <Link to="/" className="back-link-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retour à l'équipe
          </Link>
        </div>
      </main>
    );
  }

  const fullName = getFullName(member);
  const isGold = true;

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <motion.main
      className="container profile-page-container"
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Return to Team Button */}
      <div className="profile-nav-back">
        <button
          type="button"
          onClick={handleBackClick}
          className="back-link-btn"
          id={`btn-back-${member.slug}`}
          aria-label="Retourner à la grille de l'équipe"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Retour à l'équipe</span>
        </button>
      </div>

      {/* Profile Layout Grid */}
      <div className="profile-layout-grid">
        {/* Left Column: Shared-Element Identity Panel with Portrait */}
        <motion.div
          ref={isGold ? goldPanelRef : undefined}
          layoutId={`identity-surface-${member.slug}`}
          className={`identity-panel ${isGold ? 'gold' : ''}`}
          onPointerMove={isGold ? handleGoldPointerMove : undefined}
          onPointerLeave={isGold ? handleGoldPointerLeave : undefined}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Specular sheen & bevel if Gold */}
          {isGold && <div className="gold-specular-sheen" aria-hidden="true" />}
          {isGold && <div className="gold-bevel-rim" aria-hidden="true" />}

          {/* Portrait in Identity Panel */}
          <div className="identity-portrait-frame">
            <img
              src={member.photo}
              alt={`Portrait de ${fullName}`}
              className="identity-portrait-img"
              loading="eager"
            />
          </div>

          {/* Member Details */}
          <div className="identity-content-block">
            <div className={`identity-panel-badge ${isGold ? 'gold-badge' : ''}`}>
              {member.jobTitle}
            </div>

            <h1 className="identity-panel-name">
              {member.firstName}
              <br />
              {member.lastName}
            </h1>

            <p className="identity-panel-job">{member.profession}</p>

            {/* Footer of identity card */}
            <div className="identity-panel-footer">
              <span>Organisation : <strong>Lemon Mind Digital</strong></span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Details & Action Buttons */}
        {/* Right Column: Luxury Integrated Coordonnées Panel */}
        <motion.div
          className="contact-details-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="luxury-coords-card">
            {/* Header */}
            <div className="contact-section-title">
              <div className="contact-title-with-badge">
                <span className="gold-badge-dot" aria-hidden="true" />
                <span>Coordonnées</span>
              </div>
            </div>

            {/* Interactive Luxury Contact Tiles */}
            <div className="luxury-coords-list">
              {/* 1. Téléphone Direct */}
              <div className="luxury-coord-tile">
                <div className="luxury-coord-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="luxury-coord-info">
                  <span className="luxury-coord-label">Téléphone direct</span>
                  <a href={`tel:${member.phoneLink}`} className="luxury-coord-value" id={`text-phone-${member.slug}`}>
                    {member.phone}
                  </a>
                </div>
                <div className="luxury-coord-actions">
                  <a href={`tel:${member.phoneLink}`} className="luxury-tile-action-btn call" aria-label={`Appeler ${fullName}`} title="Appeler">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </a>
                  <a href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="luxury-tile-action-btn whatsapp" aria-label={`WhatsApp ${fullName}`} title="WhatsApp">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* 2. Adresse E-mail */}
              <div className="luxury-coord-tile">
                <div className="luxury-coord-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="luxury-coord-info">
                  <span className="luxury-coord-label">Adresse e-mail</span>
                  <a href={`mailto:${member.email}`} className="luxury-coord-value" id={`text-email-${member.slug}`}>
                    {member.email}
                  </a>
                </div>
                <div className="luxury-coord-actions">
                  <a href={`mailto:${member.email}`} className="luxury-tile-action-btn mail" aria-label={`Envoyer un e-mail à ${fullName}`} title="Envoyer un e-mail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* 3. Agence LemonMind */}
              <div className="luxury-coord-tile">
                <div className="luxury-coord-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="luxury-coord-info">
                  <span className="luxury-coord-label">Agence</span>
                  <a href="https://lemonmind.agency/" target="_blank" rel="noopener noreferrer" className="luxury-coord-value">
                    LemonMind Agency
                  </a>
                </div>
                <div className="luxury-coord-actions">
                  <a href="https://lemonmind.agency/" target="_blank" rel="noopener noreferrer" className="luxury-tile-action-btn web" aria-label="Site officiel" title="Visiter le site">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Sophisticated VIP Action Footer: Enregistrer (.vcf) + E-mail (remplace Partager) */}
            <div className="luxury-coord-footer">
              <button
                type="button"
                className="luxury-action-pill vcard-btn"
                id={`btn-vcard-${member.slug}`}
                onClick={() => downloadVCard(member)}
                aria-label={`Enregistrer la fiche de contact de ${fullName} (.vcf)`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Enregistrer (.vcf)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

