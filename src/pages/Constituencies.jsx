import React, { useState, useMemo } from 'react';
import { constituencies } from '../data/constituencies';
import { candidates } from '../data/candidates';
import { elections } from '../data/elections';
import ConstituencyCard from '../components/ConstituencyCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { MapPin } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export default function Constituencies() {
  const [searchParams] = useSearchParams();
  const initialDistrict = searchParams.get('district') || 'All';
  const initialState = searchParams.get('state') || 'All';

  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState(initialState);
  const [districtFilter, setDistrictFilter] = useState(initialDistrict);

  const { t, getConstituencyName, getConstituencyDistrict } = useLanguage();

  const states = ['All', ...new Set(constituencies.map((c) => c.state))];
  const districts = ['All', ...new Set(constituencies.map((c) => c.district))];

  const filteredConstituencies = useMemo(() => {
    return constituencies.filter((c) => {
      const q = search.toLowerCase();
      const localizedName = getConstituencyName(c).toLowerCase();
      const localizedDistrict = getConstituencyDistrict(c).toLowerCase();

      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        localizedName.includes(q) ||
        c.district.toLowerCase().includes(q) ||
        localizedDistrict.includes(q) ||
        c.state.toLowerCase().includes(q);

      const matchState = stateFilter === 'All' || c.state === stateFilter;
      const matchDistrict = districtFilter === 'All' || c.district === districtFilter;

      return matchSearch && matchState && matchDistrict;
    });
  }, [search, stateFilter, districtFilter, getConstituencyName, getConstituencyDistrict]);

  const activeCount =
    (stateFilter !== 'All' ? 1 : 0) +
    (districtFilter !== 'All' ? 1 : 0) +
    (search ? 1 : 0);

  const handleReset = () => {
    setSearch('');
    setStateFilter('All');
    setDistrictFilter('All');
  };

  const filterConfigs = [
    {
      id: 'state',
      label: t('label_state'),
      value: stateFilter,
      onChange: setStateFilter,
      options: states.map((s) => ({
        label: s === 'All' ? t('all_states') : s,
        value: s
      })),
    },
    {
      id: 'district',
      label: t('label_district'),
      value: districtFilter,
      onChange: setDistrictFilter,
      options: districts.map((d) => ({
        label: d === 'All' ? t('all_districts') : d,
        value: d
      })),
    },
  ];

  const getElection = (eId) => elections.find((e) => e.id === eId);
  const getCandidatesForConstituency = (cId) => candidates.filter((c) => c.constituencyId === cId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-blue-600" /> {t('constituencies_page_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('constituencies_page_sub')}
        </p>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder={t('search_constituencies_placeholder')}
        />

        <FilterPanel
          filters={filterConfigs}
          onReset={handleReset}
          activeCount={activeCount}
          title={t('filter_constituencies_title')}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{t('showing_constituencies').replace('{count}', filteredConstituencies.length)}</span>
        <span className="text-[11px] text-slate-400">ECI Delimitation Basis</span>
      </div>

      {filteredConstituencies.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-800">{t('no_candidates_found')}</h3>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            {t('reset_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConstituencies.map((con) => (
            <ConstituencyCard
              key={con.id}
              constituency={con}
              election={getElection(con.electionId)}
              candidates={getCandidatesForConstituency(con.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
