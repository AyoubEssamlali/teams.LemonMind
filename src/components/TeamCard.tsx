import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TeamMember, getFullName } from '../data/teamData';

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  return (
    <motion.div
      layoutId={`identity-surface-${member.slug}`}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex' }}
    >
      <Link
        to={`/equipe/${member.slug}`}
        className="team-card gold"
        id={`card-${member.slug}`}
        aria-label={`Voir le profil de ${getFullName(member)}, ${member.jobTitle}`}
        style={{ width: '100%' }}
      >
        {/* Card Portrait */}
        <div className="team-card-portrait-wrapper">
          <img
            src={member.photo}
            alt={`Portrait de ${getFullName(member)}`}
            className="team-card-portrait-img"
            loading="lazy"
          />
          {/* Gold specular sheen overlay */}
          <div className="gold-portrait-sheen" aria-hidden="true" />
        </div>

        {/* Card Info */}
        <div className="team-card-info-section">
          <div className="team-card-body">
            <span className="team-card-role-tag">{member.profession}</span>
            <h3 className="team-card-name">
              {member.firstName} {member.lastName}
            </h3>
          </div>

          {/* Card Footer */}
          <div className="team-card-footer">
            <span className="team-card-hint">Coordonnées directes</span>
            <div className="team-card-arrow-circle" aria-hidden="true">
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
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
