
import React from 'react';
import { LightbulbIcon } from './icons/Icons';

interface CaseBriefingProps {
  title: string;
  story: string;
}

const CaseBriefing: React.FC<CaseBriefingProps> = ({ title, story }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700 shadow-md">
      <h2 className="text-2xl font-bold text-amber-300 mb-3">{title}</h2>
      <div className="flex items-start gap-3 bg-slate-900/40 p-4 rounded-md border border-slate-600">
        <LightbulbIcon className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
        <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{story}</p>
      </div>
    </div>
  );
};

export default CaseBriefing;
