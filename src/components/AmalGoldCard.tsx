import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TeamMember, getFullName } from '../data/teamData';

interface AmalGoldCardProps {
  member: TeamMember;
}

export const AmalGoldCard: React.FC<AmalGoldCardProps> = ({ member }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Gentle pointer specular reflection tracker (respects reduced motion & touch)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (e.pointerType === 'touch') return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '30%');
  };

  return (
    <div className="featured-card-wrapper">
      <Link
        to={`/equipe/${member.slug}`}
        className="amal-gold-card"
        id={`card-${member.slug}`}
        aria-label={`Découvrir le profil de ${getFullName(member)}, ${member.jobTitle}`}
      >
        <motion.div
          ref={cardRef}
          layoutId={`identity-surface-${member.slug}`}
          className="gold-surface"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Specular sheen & bevel */}
          <div className="gold-specular-sheen" aria-hidden="true" />
          <div className="gold-bevel-rim" aria-hidden="true" />

          {/* Integrated Portrait and Typographic Content */}
          <div className="gold-card-layout">
            {/* Portrait Frame */}
            <div className="gold-portrait-container">
              <img
                src={member.photo}
                alt={`Portrait officiel de ${getFullName(member)}`}
                className="gold-portrait-img"
                loading="eager"
              />
            </div>

            {/* Information Block */}
            <div className="gold-card-content">
              <div className="gold-info-block">
                <div className="gold-badge">
                  <span className="gold-badge-dot" aria-hidden="true" />
                  {member.profession}
                </div>

                <h2 className="gold-name">
                  {member.firstName}
                  <br />
                  {member.lastName}
                </h2>
              </div>

              <div className="gold-cta-button">
                <span>Découvrir le profil</span>
                <span className="gold-cta-arrow" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};
