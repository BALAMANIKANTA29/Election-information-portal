import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-medium text-slate-700">
            {t('footer_text')}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/elections" className="hover:text-slate-900">{t('nav_elections')}</Link>
            <Link to="/candidates" className="hover:text-slate-900">{t('nav_candidates')}</Link>
            <Link to="/parties" className="hover:text-slate-900">{t('nav_parties')}</Link>
            <Link to="/constituencies" className="hover:text-slate-900">{t('nav_areas')}</Link>
            <Link to="/policies" className="hover:text-slate-900">{t('nav_promises')}</Link>
            <Link to="/compare" className="hover:text-slate-900">{t('nav_compare')}</Link>
            <Link to="/resources" className="hover:text-slate-900">{t('nav_help')}</Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center sm:text-left flex flex-col sm:flex-row justify-between gap-2">
          <span>{t('footer_disclaimer')}</span>
          <span>© 2026 {t('portal_title')}</span>
        </div>
      </div>
    </footer>
  );
}
