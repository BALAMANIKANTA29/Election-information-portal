import React, { useState, useMemo } from 'react';
import { policies } from '../data/policies';
import { candidates } from '../data/candidates';
import { parties } from '../data/parties';
import PolicyCard from '../components/PolicyCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function Policies() {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('All');
  const [partyFilter, setPartyFilter] = useState('All');
  const [candidateFilter, setCandidateFilter] = useState('All');

  const {
    t,
    getTopicLabel,
    getPolicyPosition,
    getCandidateName,
    getPartyName
  } = useLanguage();

  const rawTopics = ['All', 'Education', 'Healthcare', 'Employment', 'Infrastructure', 'Governance', 'Agriculture'];
  const topicOptions = rawTopics.map((top) => ({
    label: top === 'All' ? t('all_topics') : getTopicLabel(top),
    value: top,
  }));

  const partyOptions = [
    { label: t('all_parties'), value: 'All' },
    ...parties.map((p) => ({ label: `${p.shortName} - ${getPartyName(p)}`, value: p.id })),
  ];
  const candidateOptions = [
    { label: t('all_candidates') || 'All Candidates', value: 'All' },
    ...candidates.map((c) => ({ label: getCandidateName(c), value: c.id })),
  ];

  const filteredPolicies = useMemo(() => {
    return policies.filter((pol) => {
      const cand = candidates.find((c) => c.id === pol.candidateId);
      const party = cand ? parties.find((p) => p.id === cand.partyId) : null;

      const localizedPos = getPolicyPosition(pol);
      const localizedTop = getTopicLabel(pol.topic);
      const candName = cand ? getCandidateName(cand) : '';
      const partyName = party ? getPartyName(party) : '';

      const q = search.toLowerCase();
      const matchSearch =
        pol.position.toLowerCase().includes(q) ||
        localizedPos.toLowerCase().includes(q) ||
        pol.topic.toLowerCase().includes(q) ||
        localizedTop.toLowerCase().includes(q) ||
        (cand && cand.name.toLowerCase().includes(q)) ||
        candName.toLowerCase().includes(q) ||
        (party && party.name.toLowerCase().includes(q)) ||
        partyName.toLowerCase().includes(q);

      const matchTopic = topicFilter === 'All' || pol.topic === topicFilter;
      const matchParty = partyFilter === 'All' || (cand && cand.partyId === partyFilter);
      const matchCandidate = candidateFilter === 'All' || pol.candidateId === candidateFilter;

      return matchSearch && matchTopic && matchParty && matchCandidate;
    });
  }, [search, topicFilter, partyFilter, candidateFilter, getPolicyPosition, getTopicLabel, getCandidateName, getPartyName]);

  const activeCount =
    (topicFilter !== 'All' ? 1 : 0) +
    (partyFilter !== 'All' ? 1 : 0) +
    (candidateFilter !== 'All' ? 1 : 0) +
    (search ? 1 : 0);

  const handleReset = () => {
    setSearch('');
    setTopicFilter('All');
    setPartyFilter('All');
    setCandidateFilter('All');
  };

  const filterConfigs = [
    {
      id: 'topic',
      label: t('label_topic'),
      value: topicFilter,
      onChange: setTopicFilter,
      options: topicOptions,
    },
    {
      id: 'party',
      label: t('label_party'),
      value: partyFilter,
      onChange: setPartyFilter,
      options: partyOptions,
    },
    {
      id: 'candidate',
      label: t('nav_candidates'),
      value: candidateFilter,
      onChange: setCandidateFilter,
      options: candidateOptions,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" /> {t('policies_page_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('policies_page_sub')}
        </p>
      </div>

      {/* Neutrality Callout Pill */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-blue-900">
        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
        <div>
          <strong className="font-semibold">{t('neutrality_standard_title')}</strong> {t('neutrality_standard_desc')}
        </div>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder={t('search_policies_placeholder')}
        />

        <FilterPanel
          filters={filterConfigs}
          onReset={handleReset}
          activeCount={activeCount}
          title={t('filter_policies_title')}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{t('showing_policies').replace('{count}', filteredPolicies.length)}</span>
        <span className="text-[11px] text-slate-400">{t('chronological_order')}</span>
      </div>

      {filteredPolicies.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-800">{t('no_policies_found')}</h3>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            {t('reset_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map((pol) => {
            const cand = candidates.find((c) => c.id === pol.candidateId);
            const party = cand ? parties.find((p) => p.id === cand.partyId) : null;
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
  );
}
