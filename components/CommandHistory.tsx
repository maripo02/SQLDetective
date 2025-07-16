
import React from 'react';
import type { QueryResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CommandHistoryProps {
  history: QueryResult[];
  onCommandSelect: (command: string) => void;
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ history, onCommandSelect }) => {
  const { t } = useLanguage();
  
  // Get unique commands, keeping the most recent instance
  const uniqueCommands = Array.from(new Set(history.map(item => item.query).reverse())).reverse();

  return (
    <div className="bg-slate-800/50 h-full flex flex-col rounded-lg border border-slate-700 shadow-lg">
      <h3 className="text-lg font-bold text-amber-300 p-3 border-b border-slate-700 flex-shrink-0">
        {t('commandHistory')}
      </h3>
      <div className="flex-grow p-2 overflow-y-auto min-h-0">
        {uniqueCommands.length === 0 ? (
             <p className="text-slate-500 text-sm p-2">Your query history will appear here.</p>
        ) : (
            <ul className="space-y-1">
            {uniqueCommands.map((command, index) => (
                <li key={index}>
                <button
                    onClick={() => onCommandSelect(command)}
                    className="w-full text-left p-2 font-mono text-xs text-slate-300 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    {command}
                </button>
                </li>
            ))}
            </ul>
        )}
      </div>
    </div>
  );
};

export default CommandHistory;