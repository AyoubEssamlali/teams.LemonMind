import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">
        <div className="footer-brand-block">
          <Link to="/" className="footer-logo-link" aria-label="LemonMind Agency — Accueil">
            <img
              src="/logo-white.svg"
              alt="LemonMind Agency"
              className="footer-logo-img"
              width="145"
              height="54"
            />
          </Link>
          <span className="footer-tagline">Digital Agency</span>
        </div>

        <div className="footer-copyright-block">
          <p>© {currentYear} LemonMind Agency. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
