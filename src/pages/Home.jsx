import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { elections } from '../data/elections';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const {
    t,
    getElectionName,
    getElectionState,
    getElectionType,
    getElectionStatus,
    getElectionPollingDate,
    getElectionCountingDate
  } = useLanguage();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/candidates?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Friendly Main Welcome Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium rounded-full">
            <span>{t('hero_badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            {t('hero_title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {t('hero_subtitle')}
          </p>
        </div>

        {/* Big Touch-Friendly Search Box */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 focus:border-blue-600 rounded-2xl text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-2xl text-sm sm:text-base shadow-sm transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('search_btn')}</span>
          </button>
        </form>

        <div className="text-xs text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span>{t('popular_searches')}</span>
          <button
            type="button"
            onClick={() => navigate('/candidates?q=Ravi')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg cursor-pointer"
          >
            Ravi Kumari
          </button>
          <button
            type="button"
            onClick={() => navigate('/candidates?q=Sita')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg cursor-pointer"
          >
            Sita Devi
          </button>
          <button
            type="button"
            onClick={() => navigate('/constituencies?state=Andhra+Pradesh')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg cursor-pointer"
          >
            Kakinada
          </button>
        </div>
      </div>

      {/* Free Voter Help Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
            📞
          </div>
          <div>
            <div className="text-xs text-emerald-800 font-medium uppercase tracking-wider">
              {t('helpline_badge')}
            </div>
            <div className="text-base sm:text-lg font-semibold text-slate-900">
              {t('helpline_title')}
            </div>
            <p className="text-xs text-slate-600">
              {t('helpline_desc')}
            </p>
          </div>
        </div>

        <a
          href="tel:1950"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors shrink-0"
        >
          {t('call_now')}
        </a>
      </div>

      {/* 4 Big, Clear Quick Access Buttons */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
          {t('check_heading')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/elections"
            className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="text-3xl mb-3">📅</div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                {t('elections_title')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('elections_desc')}
              </p>
            </div>
            <div className="mt-4 text-xs font-medium text-blue-600 flex items-center gap-1">
              {t('check_dates')}
            </div>
          </Link>

          <Link
            to="/candidates"
            className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="text-3xl mb-3">👤</div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                {t('candidates_title')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('candidates_desc')}
              </p>
            </div>
            <div className="mt-4 text-xs font-medium text-blue-600 flex items-center gap-1">
              {t('see_candidates')}
            </div>
          </Link>

          <Link
            to="/parties"
            className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="text-3xl mb-3">🚩</div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                {t('parties_title')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('parties_desc')}
              </p>
            </div>
            <div className="mt-4 text-xs font-medium text-blue-600 flex items-center gap-1">
              {t('browse_parties')}
            </div>
          </Link>

          <Link
            to="/compare?c1=ravi-kumar&c2=sita-devi"
            className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="text-3xl mb-3">⚖️</div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                {t('compare_title')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('compare_desc')}
              </p>
            </div>
            <div className="mt-4 text-xs font-medium text-blue-600 flex items-center gap-1">
              {t('compare_btn')}
            </div>
          </Link>
        </div>
      </div>

      {/* Big Notice for Transparency */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 flex items-center gap-3">
        <span className="text-2xl shrink-0">⚠️</span>
        <div>
          <strong>{t('notice_title')}</strong> {t('notice_text')}
        </div>
      </div>

      {/* Simple Elections by Poll Date */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            {t('voting_schedules')}
          </h2>
          <Link to="/elections" className="text-xs sm:text-sm font-medium text-blue-600 hover:underline">
            {t('view_all_elections')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {elections.map((elec) => {
            const elecName = getElectionName(elec);
            const elecState = getElectionState(elec);
            const elecType = getElectionType(elec);
            const elecStatus = getElectionStatus(elec);
            const elecPolling = getElectionPollingDate(elec);
            const elecCounting = getElectionCountingDate(elec);

            return (
              <div
                key={elec.id}
                className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mb-2 gap-2">
                    <span className="font-semibold text-slate-700 uppercase tracking-wider">{elecState}</span>
                    <span className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-md">
                      {elecType}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base text-slate-900 mb-3 leading-snug">
                    {elecName}
                  </h3>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-slate-500">{t('voting_day')}</span>
                      <span className="font-semibold text-slate-900 text-sm text-right">{elecPolling}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-slate-500">{t('results_day')}</span>
                      <span className="font-semibold text-slate-900 text-sm text-right">{elecCounting}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                  <span className="text-slate-500 font-medium">{t('status')} {elecStatus}</span>
                  <Link
                    to={`/elections/${elec.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0"
                  >
                    {t('see_candidates_in_election')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
