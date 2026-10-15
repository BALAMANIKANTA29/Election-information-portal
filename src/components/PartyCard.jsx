import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export default function PartyCard({ party, candidateCount = 0 }) {
  const { t, getPartyName, getPartyDescription } = useLanguage();

  const name = getPartyName(party);
  const description = getPartyDescription(party);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0">
            {party.symbol}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 leading-snug">{name}</h3>
            <div className="text-xs text-slate-500">
              {t('est_label')} {party.foundedYear} • {party.headquarters}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
        <span className="text-slate-500 font-medium">
          {candidateCount} {t('candidates_count_suffix')}
        </span>
        <Link
          to={`/parties/${party.id}`}
          className="text-blue-600 font-medium hover:underline shrink-0"
        >
          {t('view_details_arrow')}
        </Link>
      </div>
    </div>
  );
}
