import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Scale } from 'lucide-react';
import SourceLink from './SourceLink';
import { useLanguage } from '../context/useLanguage';

export default function PolicyCard({ policy, candidate, party }) {
  const {
    t,
    getTopicLabel,
    getPolicyPosition,
    getCandidateName,
    getPartyName
  } = useLanguage();

  const topicColors = {
    Education: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Healthcare: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Employment: 'bg-amber-50 text-amber-700 border-amber-200',
    Infrastructure: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Governance: 'bg-purple-50 text-purple-700 border-purple-200',
    Agriculture: 'bg-lime-50 text-lime-700 border-lime-200',
  };

  const badgeClass = topicColors[policy.topic] || 'bg-slate-100 text-slate-700 border-slate-200';
  const topicLabel = getTopicLabel(policy.topic);
  const positionText = getPolicyPosition(policy);
  const candName = candidate ? getCandidateName(candidate) : '';
  const partyName = party ? getPartyName(party) : '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between">
      <div>
        {/* Topic Badge & Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
            {topicLabel}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium shrink-0">
            <Calendar className="w-3 h-3 text-slate-400" />
            {policy.publishedDate}
          </span>
        </div>

        {/* Position Quote */}
        <div className="relative mb-4 pl-4 border-l-2 border-blue-500">
          <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed italic">
            "{positionText}"
          </p>
        </div>

        {/* Candidate Details */}
        {candidate && (
          <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 mb-3">
            <img
              src={candidate.photo}
              alt={candName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <Link
                to={`/candidates/${candidate.id}`}
                className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors block truncate"
              >
                {candName}
              </Link>
              {party && (
                <span className="text-[11px] text-slate-500 font-medium truncate block">
                  {partyName} ({party.shortName})
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sourcing Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t('source_label')}</span>
          <SourceLink url={policy.sourceUrl} sourceName={policy.sourceName} date={policy.publishedDate} />
        </div>
        {candidate && (
          <Link
            to={`/compare?c1=${candidate.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600 transition-colors shrink-0 whitespace-nowrap ml-auto"
            title="Compare this position with another candidate"
          >
            <Scale className="w-3 h-3 text-slate-400" /> {t('btn_compare')}
          </Link>
        )}
      </div>
    </div>
  );
}
