import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, PhoneCall, Globe } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_elections'), path: '/elections' },
    { name: t('nav_candidates'), path: '/candidates' },
    { name: t('nav_parties'), path: '/parties' },
    { name: t('nav_areas'), path: '/constituencies' },
    { name: t('nav_promises'), path: '/policies' },
    { name: t('nav_compare'), path: '/compare' },
    { name: t('nav_help'), path: '/resources' },
  ];

  return (
    <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between min-h-[64px] py-2 gap-3">
          {/* Logo - Compact single-line to prevent overlap */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="text-2xl sm:text-3xl" role="img" aria-label="Ballot Box">🗳️</span>
            <div>
              <div className="font-semibold text-slate-900 text-base sm:text-lg tracking-tight whitespace-nowrap leading-tight group-hover:text-blue-600 transition-colors">
                {t('portal_title')}
              </div>
              <div className="text-[11px] text-slate-500 font-normal leading-tight hidden sm:block">
                {t('portal_subtitle')}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - xl breakpoint ensures plenty of space */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Controls: Language Dropdown + Helpline + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                title="Select Language"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Helpline button */}
            <a
              href="tel:1950"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-medium text-xs px-3 py-1.5 rounded-xl transition-colors shrink-0"
              title="National Voter Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('helpline_label')}</span>
            </a>

            {/* Hamburger for mobile and tablet under xl */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5 pb-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-center ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700 border border-slate-200'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <a
            href="tel:1950"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('call_free')}</span>
          </a>
        </div>
      )}
    </header>
  );
}
