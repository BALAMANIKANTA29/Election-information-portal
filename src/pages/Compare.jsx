import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { candidates } from '../data/candidates';
import { parties } from '../data/parties';
import { constituencies } from '../data/constituencies';
import { policies } from '../data/policies';
import { useLanguage } from '../context/useLanguage';

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    t,
    getCandidateName,
    getCandidateEducation,
    getCandidateWealth,
    getPartyName,
    getConstituencyName,
    getTopicLabel,
    getPolicyPosition
  } = useLanguage();

  const c1Param = searchParams.get('c1') || 'ravi-kumar';
  const c2Param = searchParams.get('c2') || 'sita-devi';

  const [cand1Id, setCand1Id] = useState(c1Param);
  const [cand2Id, setCand2Id] = useState(c2Param);

  useEffect(() => {
    setSearchParams({ c1: cand1Id, c2: cand2Id });
  }, [cand1Id, cand2Id, setSearchParams]);

  const candidate1 = candidates.find((c) => c.id === cand1Id) || candidates[0];
  const candidate2 = candidates.find((c) => c.id === cand2Id) || candidates[1];

  const party1 = parties.find((p) => p.id === candidate1?.partyId);
  const party2 = parties.find((p) => p.id === candidate2?.partyId);

  const const1 = constituencies.find((c) => c.id === candidate1?.constituencyId);
  const const2 = constituencies.find((c) => c.id === candidate2?.constituencyId);

  const policies1 = policies.filter((p) => p.candidateId === candidate1?.id);
  const policies2 = policies.filter((p) => p.candidateId === candidate2?.id);

  const topics = [
    { key: 'Education', icon: '🏫' },
    { key: 'Healthcare', icon: '🏥' },
    { key: 'Employment', icon: '💼' },
    { key: 'Infrastructure', icon: '🛣️' },
    { key: 'Governance', icon: '🏛️' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
          {t('compare_page_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t('compare_page_sub')}
        </p>
      </div>

      {/* Selectors */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {t('cand1_label')}
            </label>
            <select
              value={cand1Id}
              onChange={(e) => setCand1Id(e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm font-semibold bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 truncate"
            >
              {candidates.map((c) => {
                const p = parties.find((pt) => pt.id === c.partyId);
                return (
                  <option key={c.id} value={c.id} disabled={c.id === cand2Id}>
                    {getCandidateName(c)} ({getPartyName(p)}) - {getCandidateEducation(c)}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {t('cand2_label')}
            </label>
            <select
              value={cand2Id}
              onChange={(e) => setCand2Id(e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm font-semibold bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 truncate"
            >
              {candidates.map((c) => {
                const p = parties.find((pt) => pt.id === c.partyId);
                return (
                  <option key={c.id} value={c.id} disabled={c.id === cand1Id}>
                    {getCandidateName(c)} ({getPartyName(p)}) - {getCandidateEducation(c)}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
        {/* Candidate Headers */}
        <div className="grid grid-cols-2 divide-x-2 divide-slate-200 bg-slate-50 border-b-2 border-slate-200 p-4 sm:p-6 text-center sm:text-left">
          {/* Candidate 1 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 pr-2 min-w-0">
            <img
              src={candidate1.photo}
              alt={getCandidateName(candidate1)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-xl font-semibold text-slate-900 truncate">
                {getCandidateName(candidate1)}
              </h2>
              <div className="text-xs sm:text-sm font-medium text-slate-700 mt-1 flex items-center justify-center sm:justify-start gap-1 flex-wrap">
                <span>{party1?.symbol}</span>
                <span className="truncate">{getPartyName(party1)}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">
                📍 {getConstituencyName(const1)}
              </div>
            </div>
          </div>

          {/* Candidate 2 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 pl-2 sm:pl-4 min-w-0">
            <img
              src={candidate2.photo}
              alt={getCandidateName(candidate2)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-xl font-semibold text-slate-900 truncate">
                {getCandidateName(candidate2)}
              </h2>
              <div className="text-xs sm:text-sm font-medium text-slate-700 mt-1 flex items-center justify-center sm:justify-start gap-1 flex-wrap">
                <span>{party2?.symbol}</span>
                <span className="truncate">{getPartyName(party2)}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">
                📍 {getConstituencyName(const2)}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Stats Table */}
        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          {/* Education Row */}
          <div className="p-4 bg-slate-50/50">
            <div className="text-center font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">
              {t('stat_education')}
            </div>
            <div className="grid grid-cols-2 divide-x-2 divide-slate-200">
              <div className="pr-3 text-center sm:text-left font-bold text-slate-900 break-words">
                {getCandidateEducation(candidate1)}
              </div>
              <div className="pl-3 text-center sm:text-left font-bold text-slate-900 break-words">
                {getCandidateEducation(candidate2)}
              </div>
            </div>
          </div>

          {/* Declared Wealth Row */}
          <div className="p-4">
            <div className="text-center font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">
              {t('stat_wealth')}
            </div>
            <div className="grid grid-cols-2 divide-x-2 divide-slate-200">
              <div className="pr-3 text-center sm:text-left font-semibold text-emerald-700 text-sm sm:text-base whitespace-nowrap">
                {getCandidateWealth(candidate1)}
              </div>
              <div className="pl-3 text-center sm:text-left font-semibold text-emerald-700 text-sm sm:text-base whitespace-nowrap">
                {getCandidateWealth(candidate2)}
              </div>
            </div>
          </div>

          {/* Police Cases Row */}
          <div className="p-4 bg-slate-50/50">
            <div className="text-center font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">
              {t('stat_cases')}
            </div>
            <div className="grid grid-cols-2 divide-x-2 divide-slate-200">
              <div className="pr-3 text-center sm:text-left font-semibold text-emerald-700">
                {candidate1.criminalCases === 0 ? t('clean_record') : `${candidate1.criminalCases} Cases Declared`}
              </div>
              <div className="pl-3 text-center sm:text-left font-semibold text-emerald-700">
                {candidate2.criminalCases === 0 ? t('clean_record') : `${candidate2.criminalCases} Cases Declared`}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Promises Comparison */}
        <div className="bg-blue-600 text-white p-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">
          {t('promises_heading')}
        </div>

        <div className="divide-y-2 divide-slate-200 text-xs sm:text-sm">
          {topics.map((topicItem) => {
            const pol1 = policies1.find((p) => p.topic === topicItem.key);
            const pol2 = policies2.find((p) => p.topic === topicItem.key);
            const topicLabel = `${topicItem.icon} ${getTopicLabel(topicItem.key)}`;

            return (
              <div key={topicItem.key} className="p-4 sm:p-6 space-y-3">
                <div className="text-center font-semibold text-slate-800 text-xs sm:text-sm bg-slate-100 py-1.5 px-3 rounded-xl inline-block mx-auto">
                  {topicLabel}
                </div>

                <div className="grid grid-cols-2 divide-x-2 divide-slate-200 pt-2">
                  <div className="pr-3 space-y-2 min-w-0">
                    {pol1 ? (
                      <p className="text-slate-800 leading-relaxed font-medium italic break-words">
                        "{getPolicyPosition(pol1)}"
                      </p>
                    ) : (
                      <span className="text-slate-400 italic">{t('no_promise')}</span>
                    )}
                  </div>

                  <div className="pl-3 space-y-2 min-w-0">
                    {pol2 ? (
                      <p className="text-slate-800 leading-relaxed font-medium italic break-words">
                        "{getPolicyPosition(pol2)}"
                      </p>
                    ) : (
                      <span className="text-slate-400 italic">{t('no_promise')}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
