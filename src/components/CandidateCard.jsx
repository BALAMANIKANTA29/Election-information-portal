import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export default function CandidateCard({ candidate, party, constituency }) {
  const {
    t,
    getCandidateName,
    getCandidateEducation,
    getCandidateWealth,
    getPartyName,
    getConstituencyName
  } = useLanguage();

  const displayName = getCandidateName(candidate);
  const displayParty = getPartyName(party);
  const displayConstituency = getConstituencyName(constituency);
  const displayEducation = getCandidateEducation(candidate);
  const displayWealth = getCandidateWealth(candidate);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top: Photo, Name, Party */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <img
            src={candidate.photo}
            alt={displayName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg text-slate-900 truncate">
              {displayName}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-base sm:text-lg">{party?.symbol}</span>
              <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                {displayParty}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-normal whitespace-nowrap">
                {t('card_age')}: {candidate.age}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 truncate">
              📍 {displayConstituency}
            </div>
          </div>
        </div>

        {/* Clear Details in Simple Words */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-700 mb-3">
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-500 shrink-0">{t('card_education')}:</span>
            <span className="font-medium text-slate-900 truncate text-right">{displayEducation}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-500 shrink-0">{t('card_wealth')}:</span>
            <span className="font-medium text-emerald-700 whitespace-nowrap">{displayWealth}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-500 shrink-0">{t('card_cases')}:</span>
            <span className="font-medium text-slate-800 whitespace-nowrap">
              {candidate.criminalCases === 0 ? t('clean_record') : `${candidate.criminalCases} Cases`}
            </span>
          </div>
        </div>
      </div>

      {/* Touch Buttons - Responsive flex with no overflow */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
        <Link
          to={`/compare?c1=${candidate.id}`}
          className="text-slate-600 hover:text-blue-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
        >
          {t('btn_compare')}
        </Link>
        <Link
          to={`/candidates/${candidate.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-1.5 rounded-xl transition-colors shadow-xs whitespace-nowrap shrink-0 ml-auto"
        >
          {t('btn_profile')}
        </Link>
      </div>
    </div>
  );
}
