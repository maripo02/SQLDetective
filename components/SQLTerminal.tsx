
import React, { useState } from 'react';
import type { QueryResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SQLTerminalProps {
  onRunQuery: () => void;
  history: QueryResult[];
  query: string;
  setQuery: (query: string) => void;
}

const SQLTerminal: React.FC<SQLTerminalProps> = ({ onRunQuery, history, query, setQuery }) => {
  const { t } = useLanguage();
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onRunQuery();
      setCommandHistory(prev => [query, ...prev.filter(c => c !== query)]);
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
            const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
            setHistoryIndex(newIndex);
            setQuery(commandHistory[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > -1) {
            const newIndex = Math.max(historyIndex - 1, -1);
            setHistoryIndex(newIndex);
            setQuery(newIndex === -1 ? '' : commandHistory[newIndex]);
        }
    }
  };
  
  const renderResult = (result: QueryResult) => {
    if (result.isSolutionAttempt) {
        return <p className="text-yellow-400">{t('solutionAttempt')}</p>;
    }
    
    if (result.error) {
      return <p className="text-red-400 font-mono">{result.error}</p>;
    }

    const dataToRender = result.translatedData || result.data;

    if (!dataToRender || dataToRender.length === 0) {
      return <p className="text-slate-500">{t('noRowsReturned')}</p>;
    }

    const headers = Object.keys(dataToRender[0]);

    return (
      <div className="overflow-x-auto">
        {result.isTranslating && (
          <div className="text-center p-2 text-cyan-400 text-xs font-mono animate-pulse">
            {t('translatingResults')}
          </div>
        )}
        <table className="w-full text-left text-sm font-mono">
          <thead className="border-b-2 border-slate-600 text-slate-300">
            <tr>
              {headers.map(header => (
                <th key={header} className="p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataToRender.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                {headers.map(header => (
                  <td key={header} className="p-2 whitespace-pre-wrap break-words max-w-xs text-slate-200">{String(row[header])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-slate-800/50 h-full flex flex-col rounded-lg border border-slate-700 shadow-2xl">
      <div className="flex-grow p-4 overflow-y-auto bg-black/20 rounded-t-lg min-h-0">
        <div className="space-y-4">
          <p className="text-green-400 font-mono">{t('welcomeMessage')}</p>
          {history.map((result, index) => (
            <div key={result.id || index} className="font-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">&gt;</span>
                <p className="text-slate-300">{result.query}</p>
              </div>
              <div className="mt-2 pl-4 border-l-2 border-slate-700">
                {renderResult(result)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-2 border-t border-slate-700 bg-slate-900/50 rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="flex-grow bg-slate-950 text-green-300 font-mono p-2 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
            placeholder={t('queryPlaceholder')}
          />
          <button type="submit" className="bg-cyan-600 text-white font-bold px-4 rounded-md hover:bg-cyan-500 transition-colors self-stretch">
            {t('runQuery')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SQLTerminal;