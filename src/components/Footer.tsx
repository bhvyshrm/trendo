import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest text-primary border-t border-outline-variant/10 mt-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin py-8 gap-4 max-w-7xl mx-auto text-on-surface-variant">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-body-md font-headline-md lowercase tracking-tight text-primary font-syne font-bold">
            trendo<span className="text-emerald-400">.</span>
          </Link>
          <span className="text-label-mono-sm text-outline">
            trendo. live telemetry cinema curation
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-body-sm text-outline hover:text-on-surface">
          <span className="hover:text-primary transition-colors cursor-pointer">Daily Archive</span>
          <span className="hover:text-primary transition-colors cursor-pointer">TMDB Telemetry Signals</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Curation Journal</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Privacy & Telemetry</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Colophon</span>
        </nav>
      </div>
    </footer>
  );
};
