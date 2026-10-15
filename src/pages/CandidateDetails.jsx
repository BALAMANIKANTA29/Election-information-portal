import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { candidates } from '../data/candidates';
import { parties } from '../data/parties';
import { constituencies } from '../data/constituencies';
import { elections } from '../data/elections';
import { policies } from '../data/policies';
import { ArrowLeft, Scale } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import SourceLink from '../components/SourceLink';

export default function CandidateDetails() {
  const { id } = useParams();
  const {
    t,
    getCandidateName,
    getCandidateEducation,
    getCandidateWealth,
    getCandidateBio,
    getPartyName,
    getConstituencyName,
    getElectionName,
    getTopicLabel,
    getPolicyPosition
  } = useLanguage();

  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('no_candidates_found')}</h2>
        <Link to="/candidates" className="text-sm font-bold text-blue-600 hover:underline">
          {t('back_to_candidates')}
        </Link>
      </div>
    );
  }

  const displayName = getCandidateName(candidate);
  const displayEducation = getCandidateEducation(candidate);
  const displayWealth = getCandidateWealth(candidate);
  const displayBio = getCandidateBio(candidate);

  const party = parties.find((p) => p.id === candidate.partyId);
  const constituency = constituencies.find((c) => c.id === candidate.constituencyId);
  const election = elections.find((e) => e.id === candidate.electionId);
  const candidatePolicies = policies.filter((pol) => pol.candidateId === candidate.id);

  const displayParty = party ? getPartyName(party) : '';
  const displayConstituency = constituency ? getConstituencyName(constituency) : '';
  const displayElection = election ? getElectionName(election) : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link to="/candidates" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> {t('back_to_candidates')}
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={candidate.photo}
            alt={displayName}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-slate-100 shadow-sm shrink-0"
          />

          <div className="space-y-2 flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
              {displayName}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xl">{party?.symbol}</span>
              <span className="font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm">
                {displayParty}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 text-sm font-semibold">
                {t('card_age')}: {candidate.age}
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-500 font-medium flex flex-wrap items-center gap-1 justify-center sm:justify-start">
              <span>📍 {t('label_constituency')}: <strong>{displayConstituency}</strong></span>
              {displayElection && (
                <>
                  <span>•</span>
                  <span>{t('label_election')}: <strong>{displayElection}</strong></span>
                </>
              )}
            </div>

            <div className="pt-2">
              <Link
                to={`/compare?c1=${candidate.id}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-xs"
              >
                <Scale className="w-4 h-4" /> {t('btn_compare')}
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Clear Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t-2 border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-normal text-slate-500 uppercase tracking-wider block">
              🎓 {t('card_education')}
            </span>
            <div className="text-sm font-semibold text-slate-900 leading-snug">{displayEducation}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-normal text-slate-500 uppercase tracking-wider block">
              💰 {t('card_wealth')}
            </span>
            <div className="text-base font-semibold text-emerald-700">{displayWealth}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs font-normal text-slate-500 uppercase tracking-wider block">
              ⚖️ {t('card_cases')}
            </span>
            <div className="text-sm font-semibold text-slate-900">
              {candidate.criminalCases === 0 ? t('clean_record') : `${candidate.criminalCases} Cases Declared`}
            </div>
          </div>
        </div>

        {/* Bio in Simple Words */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base font-semibold text-slate-900">{t('about_leader')}</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {displayBio}
          </p>
        </div>
      </div>

      {/* Documented Promises */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
          {t('promises_heading')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidatePolicies.map((pol) => {
            const topicLabel = getTopicLabel(pol.topic);
            const positionText = getPolicyPosition(pol);

            return (
              <div key={pol.id} className="bg-white p-5 rounded-2xl border-2 border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg">
                    {topicLabel}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed italic">
                    "{positionText}"
                  </p>
                </div>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span>{pol.publishedDate}</span>
                  <SourceLink url={pol.sourceUrl} sourceName={pol.sourceName} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
