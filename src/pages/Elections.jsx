import React, { useState, useMemo } from 'react';
import { elections } from '../data/elections';
import ElectionCard from '../components/ElectionCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function Elections() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  const { t, getElectionName, getElectionState } = useLanguage();

  const states = ['All', ...new Set(elections.map((e) => e.state))];
  const types = ['All', 'Assembly', 'Parliament'];
  const years = ['All', ...new Set(elections.map((e) => String(e.year)))];

  const filteredElections = useMemo(() => {
    return elections.filter((e) => {
      const localizedName = getElectionName(e);
      const localizedState = getElectionState(e);
      const q = search.toLowerCase();

      const matchSearch =
        e.name.toLowerCase().includes(q) ||
        localizedName.toLowerCase().includes(q) ||
        e.state.toLowerCase().includes(q) ||
        localizedState.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q);

      const matchState = stateFilter === 'All' || e.state === stateFilter;
      const matchType = typeFilter === 'All' || e.type === typeFilter;
      const matchYear = yearFilter === 'All' || String(e.year) === yearFilter;

      return matchSearch && matchState && matchType && matchYear;
    });
  }, [search, stateFilter, typeFilter, yearFilter, getElectionName, getElectionState]);

  const activeCount =
    (stateFilter !== 'All' ? 1 : 0) +
    (typeFilter !== 'All' ? 1 : 0) +
    (yearFilter !== 'All' ? 1 : 0) +
    (search ? 1 : 0);

  const handleReset = () => {
    setSearch('');
    setStateFilter('All');
    setTypeFilter('All');
    setYearFilter('All');
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
      id: 'type',
      label: t('label_type'),
      value: typeFilter,
      onChange: setTypeFilter,
      options: types.map((tp) => ({
        label: tp === 'All' ? t('all_types') : tp,
        value: tp
      })),
    },
    {
      id: 'year',
      label: t('label_year'),
      value: yearFilter,
      onChange: setYearFilter,
      options: years.map((y) => ({
        label: y === 'All' ? t('all_years') : y,
        value: y
      })),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-blue-600" /> {t('elections_page_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('elections_page_sub')}
        </p>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder={t('search_placeholder')}
        />

        <FilterPanel
          filters={filterConfigs}
          onReset={handleReset}
          activeCount={activeCount}
          title={t('filter_elections_title')}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{t('showing_elections').replace('{count}', filteredElections.length)}</span>
      </div>

      {filteredElections.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-800">{t('no_elections_found')}</h3>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            {t('reset_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map((elec) => (
            <ElectionCard key={elec.id} election={elec} />
          ))}
        </div>
      )}
    </div>
  );
}
