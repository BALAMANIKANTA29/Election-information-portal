import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export default function SourceLink({ url, sourceName = 'Official Source', date, className = '' }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors group ${className}`}
      title="Opens official public source in a new tab"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
      <span>{sourceName}</span>
      {date && <span className="text-slate-400 font-normal">({date})</span>}
      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
    </a>
  );
}
