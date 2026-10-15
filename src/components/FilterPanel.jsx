import React from 'react';
import { useLanguage } from '../context/useLanguage';

export default function FilterPanel({
  filters = [],
  onReset,
  activeCount = 0,
  title = 'Filters'
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800">{title}</span>
        {activeCount > 0 && onReset && (
          <button
            onClick={onReset}
            type="button"
            className="text-blue-600 hover:underline"
          >
            {t('reset_filters')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {filters.map((filter) => (
          <div key={filter.id}>
            <label className="block text-[11px] text-slate-500 mb-1">
              {filter.label}
            </label>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
