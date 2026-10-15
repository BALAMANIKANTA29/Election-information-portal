import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { parties } from '../data/parties';
import { candidates } from '../data/candidates';
import { constituencies } from '../data/constituencies';
import { elections } from '../data/elections';
import { policies } from '../data/policies';
import { Users, ArrowLeft } from 'lucide-react';
import SourceLink from '../components/SourceLink';
import CandidateCard from '../components/CandidateCard';
import PolicyCard from '../components/PolicyCard';
import { useLanguage } from '../context/useLanguage';

export default function PartyDetails() {
  const { id } = useParams();
  const {
    t,
    getPartyName,
    getPartyShortName,
    getPartyIdeology,
    getPartyDescription
  } = useLanguage();

  const party = parties.find((p) => p.id === id);

  if (!party) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('parties_page_title')}</h2>
        <Link to="/parties" className="text-sm font-semibold text-blue-600 hover:underline">
          {t('back_to_parties')}
        </Link>
      </div>
    );
  }

  const name = getPartyName(party);
  const shortName = getPartyShortName(party);
  const ideology = getPartyIdeology(party);
  const description = getPartyDescription(party);

  const partyCandidates = candidates.filter((c) => c.partyId === party.id);
  const partyCandidateIds = new Set(partyCandidates.map((c) => c.id));
  const partyPolicies = policies.filter((pol) => partyCandidateIds.has(pol.candidateId));

  const getConstituency = (cId) => constituencies.find((c) => c.id === cId);
  const getElection = (eId) => elections.find((e) => e.id === eId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/parties" className="hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> {t('back_to_parties')}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{name}</span>
      </div>

      {/* Main Party Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-4xl shadow-sm shrink-0">
            {party.symbol}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
                {name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${party.badgeBg}`}>
                {shortName}
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-3">
              <span>{t('est_label')} <strong>{party.foundedYear}</strong></span>
              <span>•</span>
              <span><strong>{party.headquarters}</strong></span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">ECI Recognized</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('party_overview')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
            {description}
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-slate-500 font-medium">{t('foundational_policy')}</span>{' '}
              <span className="font-semibold text-slate-900">{ideology}</span>
            </div>
            <SourceLink url={party.sourceUrl} sourceName="ECI Recognized Parties Registry" />
          </div>
        </div>
      </div>

      {/* Candidates Fielded by this Party */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 shrink-0" /> {t('active_nominees_heading')} ({partyCandidates.length})
          </h2>
          <span className="text-xs text-slate-500">{t('certified_recent')}</span>
        </div>

        {partyCandidates.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            {t('no_party_candidates')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partyCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                party={party}
                constituency={getConstituency(candidate.constituencyId)}
                election={getElection(candidate.electionId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Documented Policy Stances from this Party */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {t('party_policy_stances')} ({partyPolicies.length})
        </h2>

        {partyPolicies.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            {t('no_party_policies')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partyPolicies.map((pol) => {
              const cand = candidates.find((c) => c.id === pol.candidateId);
              return (
                <PolicyCard
                  key={pol.id}
                  policy={pol}
                  candidate={cand}
                  party={party}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
