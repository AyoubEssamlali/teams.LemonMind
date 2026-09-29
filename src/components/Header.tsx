import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  const isTeamActive = location.pathname === '/' || location.pathname.startsWith('/equipe');

  return (
    <header className="site-header" role="banner">
      <div className="container header-inner">
        {/* Official LemonMind Logo */}
        <Link to="/" className="header-brand" aria-label="LemonMind Agency — Accueil">
          <img
            src="/logo-white.svg"
            alt="LemonMind Agency"
            className="header-logo-img"
            width="180"
            height="72"
          />
        </Link>

        {/* Navigation */}
        <nav className="header-nav" aria-label="Navigation principale">
          <Link
            to="/"
            className={`header-nav-link ${isTeamActive ? 'active' : ''}`}
            aria-current={isTeamActive ? 'page' : undefined}
          >
            L'équipe
          </Link>

          <a
            href="https://lemonmind.agency/"
            target="_blank"
            rel="noopener noreferrer"
            className="header-nav-link external header-agency-btn"
            aria-label="Consulter le site officiel de LemonMind Agency (ouvre un nouvel onglet)"
          >
            <span>Site de l'agence</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ width: 14, height: 14, minWidth: 14, maxWidth: 14, flexShrink: 0 }}
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  );
};
