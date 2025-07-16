import React from 'react';
import type { Table } from '../types';
import { DatabaseIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface SchemaViewerProps {
  tables: Table[];
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ tables }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700 shadow-md">
      <h3 className="text-xl font-bold text-amber-300 mb-4">{t('databaseSchema')}</h3>
      <div className="space-y-4">
        {tables.map(table => (
          <div key={table.name} className="bg-slate-900/40 p-4 rounded-md border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <DatabaseIcon className="w-5 h-5 text-cyan-400" />
              <h4 className="text-lg font-semibold text-cyan-300">{table.name}</h4>
            </div>
            <p className="text-xs text-slate-400 italic mb-3">{table.description}</p>
            <div className="text-sm font-mono bg-slate-950/50 p-2 rounded-sm">
              {Object.entries(table.schema).map(([key, value]) => (
                <div key={key}>
                  <span className="text-slate-400">{key}:</span> <span className="text-amber-400">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaViewer;