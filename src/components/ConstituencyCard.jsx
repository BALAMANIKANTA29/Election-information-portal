import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Vote } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function ConstituencyCard({ constituency, election, candidates = [] }) {
  const {
    t,
    getConstituencyName,
    getConstituencyDistrict,
    getCandidateName,
    getElectionName
  } = useLanguage();

  const name = getConstituencyName(constituency);
  const district = getConstituencyDistrict(constituency);
  const electionName = election ? getElectionName(election) : '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-200">
            {constituency.category}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {constituency.state}
          </span>
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-1 leading-snug">
          {name}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{t('label_district')}: {district}</span>
          {electionName && (
            <>
              <span>•</span>
              <span className="truncate">{electionName}</span>
            </>
          )}
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4 text-xs flex items-center justify-between">
          <span className="text-slate-500">{t('registered_electors')}</span>
          <span className="font-semibold text-slate-900">{constituency.totalVoters.toLocaleString()} {t('voters_label')}</span>
        </div>

        {/* Candidates in this Constituency */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Vote className="w-3.5 h-3.5 text-blue-600" /> {t('contesting_nominees')} ({candidates.length}):
          </h4>
          <div className="space-y-1.5">
            {candidates.map((cand) => (
              <Link
                key={cand.id}
                to={`/candidates/${cand.id}`}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-colors text-xs group"
              >
                <span className="font-medium text-slate-800 group-hover:text-blue-700 truncate pr-2">
                  {getCandidateName(cand)}
                </span>
                <span className="text-[11px] text-slate-500 shrink-0 group-hover:text-blue-600">
                  {t('btn_profile')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>{t('official_electoral_roll')}</span>
        <span>{t('delimitation_order')}</span>
      </div>
    </div>
  );
}
