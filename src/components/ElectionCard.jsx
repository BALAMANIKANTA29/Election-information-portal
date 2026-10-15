import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function ElectionCard({ election }) {
  const {
    t,
    getElectionName,
    getElectionState,
    getElectionType,
    getElectionStatus,
    getElectionPollingDate,
    getElectionCountingDate
  } = useLanguage();

  const isUpcoming = election.status === 'Upcoming';
  const name = getElectionName(election);
  const state = getElectionState(election);
  const type = getElectionType(election);
  const status = getElectionStatus(election);
  const pollingDate = getElectionPollingDate(election);
  const countingDate = getElectionCountingDate(election);

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
            isUpcoming
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {status}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {type}
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mt-1 mb-2 leading-snug">
          {name}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-4">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{state}</span>
          <span>•</span>
          <span>{election.totalSeats} {t('total_seats')}</span>
        </div>

        {/* Timeline block */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {t('polling_date')}
            </span>
            <span className="font-semibold text-slate-900 text-right">{pollingDate}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {t('counting_date')}
            </span>
            <span className="font-semibold text-slate-900 text-right">{countingDate}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-end">
        <Link
          to={`/elections/${election.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>{t('view_details')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
