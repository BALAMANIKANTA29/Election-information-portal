import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { elections } from '../data/elections';
import { constituencies } from '../data/constituencies';
import { candidates } from '../data/candidates';
import { parties } from '../data/parties';
import { Calendar, MapPin, Users, ArrowLeft, Clock, FileCheck } from 'lucide-react';
import SourceLink from '../components/SourceLink';
import CandidateCard from '../components/CandidateCard';
import { useLanguage } from '../context/useLanguage';

export default function ElectionDetails() {
  const { id } = useParams();
  const {
    t,
    getElectionName,
    getElectionState,
    getElectionType,
    getElectionStatus,
    getElectionPollingDate,
    getElectionCountingDate,
    getConstituencyName,
    getConstituencyDistrict
  } = useLanguage();

  const election = elections.find((e) => e.id === id);

  if (!election) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('no_elections_found')}</h2>
        <Link to="/elections" className="text-sm font-semibold text-blue-600 hover:underline">
          {t('back_to_elections')}
        </Link>
      </div>
    );
  }

  const name = getElectionName(election);
  const state = getElectionState(election);
  const type = getElectionType(election);
  const status = getElectionStatus(election);
  const pollingDate = getElectionPollingDate(election);
  const countingDate = getElectionCountingDate(election);

  const electionConstituencies = constituencies.filter((c) => c.electionId === election.id);
  const electionCandidates = candidates.filter((cand) => cand.electionId === election.id);
  const getParty = (pId) => parties.find((p) => p.id === pId);
  const getConstituency = (cId) => constituencies.find((c) => c.id === cId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/elections" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> {t('back_to_elections')}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{name}</span>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
            {type}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            election.status === 'Upcoming'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {t('status')} {status}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
          {name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> {t('label_state')}: <strong>{state}</strong>
          </span>
          <span>•</span>
          <span>{t('total_seats')}: <strong>{election.totalSeats}</strong></span>
          <span>•</span>
          <span>{t('label_year')}: <strong>{election.year}</strong></span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          {election.description}
        </p>

        {/* Timelines Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" /> {t('gazette_notification')}
            </span>
            <div className="text-base font-bold text-slate-900">{election.notificationDate}</div>
            <div className="text-[11px] text-slate-400">{t('formal_nominations')}</div>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" /> {t('polling_day')}
            </span>
            <div className="text-base font-bold text-blue-950">{pollingDate}</div>
            <div className="text-[11px] text-blue-600 font-medium">{t('evm_vvpat_note')}</div>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 space-y-1">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" /> {t('counting_declaration')}
            </span>
            <div className="text-base font-bold text-amber-950">{countingDate}</div>
            <div className="text-[11px] text-amber-600 font-medium">{t('public_tabulation')}</div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>{t('source_label')}:</span>
          <SourceLink url={election.sourceUrl} sourceName="Election Commission of India Notification" />
        </div>
      </div>

      {/* Contesting Constituencies */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600 shrink-0" /> {t('key_constituencies')} ({electionConstituencies.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {electionConstituencies.map((constituency) => (
            <div key={constituency.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">{getConstituencyName(constituency)}</h3>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                  {constituency.category}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {t('label_district')}: {getConstituencyDistrict(constituency)} • {constituency.totalVoters.toLocaleString()} {t('voters_label')}
              </div>
              <Link
                to={`/constituencies?state=${encodeURIComponent(election.state)}`}
                className="text-xs text-blue-600 font-semibold hover:underline block pt-1"
              >
                {t('explore_constituency')}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Certified Contesting Candidates */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 shrink-0" /> {t('certified_candidates')} ({electionCandidates.length})
          </h2>
          <Link
            to={`/candidates?election=${election.id}`}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
          >
            {t('filter_candidates_link')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {electionCandidates.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              party={getParty(cand.partyId)}
              constituency={getConstituency(cand.constituencyId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
