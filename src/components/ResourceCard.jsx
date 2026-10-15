import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function ResourceCard({ resource }) {
  const {
    t,
    getResourceTitle,
    getResourceDescription,
    getResourceCategory
  } = useLanguage();

  const categoryColors = {
    'Model Code of Conduct': 'bg-red-50 text-red-700 border-red-200',
    'Voter Guidelines': 'bg-blue-50 text-blue-700 border-blue-200',
    'Election Rules': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Affidavits & Disclosures': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const badgeClass = categoryColors[resource.category] || 'bg-slate-100 text-slate-700 border-slate-200';
  const title = getResourceTitle(resource);
  const description = getResourceDescription(resource);
  const categoryLabel = getResourceCategory(resource);

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
            {categoryLabel}
          </span>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0">
            {resource.fileType}
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
          {title}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] text-slate-500">
          <span className="text-slate-400">{t('source_label')}:</span> {resource.sourceName}
        </div>
        <a
          href={resource.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors shrink-0 whitespace-nowrap ml-auto"
        >
          <span>{t('visit_portal')}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
