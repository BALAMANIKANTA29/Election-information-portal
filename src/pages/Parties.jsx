import React, { useState, useMemo } from 'react';
import { parties } from '../data/parties';
import { candidates } from '../data/candidates';
import PartyCard from '../components/PartyCard';
import SearchBar from '../components/SearchBar';
import { Building2 } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function Parties() {
  const [search, setSearch] = useState('');
  const {
    t,
    getPartyName,
    getPartyShortName,
    getPartyIdeology,
    getPartyDescription
  } = useLanguage();

  const filteredParties = useMemo(() => {
    const q = search.toLowerCase();
    return parties.filter((p) => {
      const name = getPartyName(p).toLowerCase();
      const shortName = getPartyShortName(p).toLowerCase();
      const ideology = getPartyIdeology(p).toLowerCase();
      const desc = getPartyDescription(p).toLowerCase();

      return (
        p.name.toLowerCase().includes(q) ||
        name.includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        shortName.includes(q) ||
        p.ideology.toLowerCase().includes(q) ||
        ideology.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        desc.includes(q)
      );
    });
  }, [search, getPartyName, getPartyShortName, getPartyIdeology, getPartyDescription]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-blue-600" /> {t('parties_page_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('parties_page_sub')}
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch('')}
        placeholder={t('search_parties_placeholder')}
      />

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{t('showing_parties').replace('{count}', filteredParties.length)}</span>
        <span className="text-[11px] text-slate-400">ECI Recognized</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredParties.map((party) => {
          const count = candidates.filter((c) => c.partyId === party.id).length;
          return <PartyCard key={party.id} party={party} candidateCount={count} />;
        })}
      </div>
    </div>
  );
}
