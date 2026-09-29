import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedMembers, getGridMembers } from '../data/teamData';
import { AmalGoldCard } from '../components/AmalGoldCard';
import { TeamCard } from '../components/TeamCard';

export const HomePage: React.FC = () => {
  const featuredMembers = getFeaturedMembers();
  const gridMembers = getGridMembers();

  useEffect(() => {
    document.title = "LemonMind Agency — L'équipe";
    window.scrollTo(0, 0);
  }, []);

  // Adapt to 3 columns if 4 or more non-featured members exist on desktop
  const isThreeCols = gridMembers.length >= 4;

  return (
    <motion.main
      id="main-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Centered Intro Section */}
      <section className="intro-section intro-section--centered container" aria-labelledby="intro-title">
        <div className="intro-badge">
          <span className="intro-badge-dot" aria-hidden="true" />
          TEAM
        </div>
        <h1 id="intro-title" className="intro-heading intro-heading--centered">
          LemonMind's <span>Team</span>
        </h1>
        <p className="intro-subtitle intro-subtitle--centered">
          Découvrez notre équipe et contactez directement votre interlocuteur.
        </p>
      </section>

      {/* Team Showcase */}
      <section className="team-grid-section container" aria-label="Présentation des membres">
        {/* Featured Gold Cards Grid (Amal, Elhoussine, Salah, Tarik — 2 per line) */}
        <div className="featured-cards-grid">
          {featuredMembers.map((member) => (
            <AmalGoldCard key={member.id} member={member} />
          ))}
        </div>

        {/* Other Team Members Grid */}
        <div className={`team-grid ${isThreeCols ? 'three-cols' : ''}`} id="team-grid">
          {gridMembers.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </section>
    </motion.main>
  );
};
