import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { candidates } from '../data/candidates';
import { parties } from '../data/parties';
import { constituencies } from '../data/constituencies';
import { elections } from '../data/elections';
import CandidateCard from '../components/CandidateCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { useLanguage } from '../context/useLanguage';

export default function Candidates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialParty = searchParams.get('party') || 'All';
  const initialConst = searchParams.get('constituency') || 'All';
  const initialElec = searchParams.get('election') || 'All';

  const [search, setSearch] = useState(initialQuery);
  const [partyFilter, setPartyFilter] = useState(initialParty);
  const [constituencyFilter, setConstituencyFilter] = useState(initialConst);
  const [electionFilter, setElectionFilter] = useState(initialElec);

  const { t, getCandidateName, getPartyName, getConstituencyName, getElectionName } = useLanguage();

  const partyOptions = [
    { label: t('all_parties'), value: 'All' },
    ...parties.map((p) => ({ label: `${p.shortName} - ${getPartyName(p)}`, value: p.id })),
  ];

  const constituencyOptions = [
    { label: t('all_constituencies'), value: 'All' },
    ...constituencies.map((c) => ({ label: `${getConstituencyName(c)} (${c.state})`, value: c.id })),
  ];

  const electionOptions = [
    { label: t('all_elections'), value: 'All' },
    ...elections.map((e) => ({ label: getElectionName(e), value: e.id })),
  ];

  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      const party = parties.find((p) => p.id === cand.partyId);
      const constituency = constituencies.find((c) => c.id === cand.constituencyId);
      const localizedName = getCandidateName(cand);
      const partyName = party ? getPartyName(party) : '';
      const constituencyName = constituency ? getConstituencyName(constituency) : '';

      const query = search.toLowerCase();
      const matchSearch =
        cand.name.toLowerCase().includes(query) ||
        localizedName.toLowerCase().includes(query) ||
        (party && (party.name.toLowerCase().includes(query) || partyName.toLowerCase().includes(query))) ||
        (constituency && (constituency.name.toLowerCase().includes(query) || constituencyName.toLowerCase().includes(query)));

      const matchParty = partyFilter === 'All' || cand.partyId === partyFilter;
      const matchConst = constituencyFilter === 'All' || cand.constituencyId === constituencyFilter;
      const matchElec = electionFilter === 'All' || cand.electionId === electionFilter;

      return matchSearch && matchParty && matchConst && matchElec;
    });
  }, [search, partyFilter, constituencyFilter, electionFilter, getCandidateName, getPartyName, getConstituencyName]);

  const activeCount =
    (partyFilter !== 'All' ? 1 : 0) +
    (constituencyFilter !== 'All' ? 1 : 0) +
    (electionFilter !== 'All' ? 1 : 0) +
    (search ? 1 : 0);

  const handleReset = () => {
    setSearch('');
    setPartyFilter('All');
    setConstituencyFilter('All');
    setElectionFilter('All');
    setSearchParams({});
  };

  const filterConfigs = [
    {
      id: 'party',
      label: t('label_party'),
      value: partyFilter,
      onChange: setPartyFilter,
      options: partyOptions,
    },
    {
      id: 'constituency',
      label: t('label_constituency'),
      value: constituencyFilter,
      onChange: setConstituencyFilter,
      options: constituencyOptions,
    },
    {
      id: 'election',
      label: t('label_election'),
      value: electionFilter,
      onChange: setElectionFilter,
      options: electionOptions,
    },
  ];

  const getParty = (pId) => parties.find((p) => p.id === pId);
  const getConstituency = (cId) => constituencies.find((c) => c.id === cId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            {t('candidates_page_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t('candidates_page_sub')}
          </p>
        </div>

        <Link
          to="/compare"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto shrink-0"
        >
          {t('compare_candidates_btn')}
        </Link>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder={t('search_candidates_placeholder')}
        />

        <FilterPanel
          filters={filterConfigs}
          onReset={handleReset}
          activeCount={activeCount}
          title={t('filter_candidates_title')}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{t('showing_candidates').replace('{count}', filteredCandidates.length)}</span>
        <span className="text-[11px] text-slate-400">{t('neutral_order')}</span>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <div className="text-3xl">👤</div>
          <h3 className="font-semibold text-slate-800">{t('no_candidates_found')}</h3>
          <button
            onClick={handleReset}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            {t('reset_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              party={getParty(candidate.partyId)}
              constituency={getConstituency(candidate.constituencyId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
