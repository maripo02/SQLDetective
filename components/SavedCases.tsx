import React from 'react';
import type { SavedGame } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SavedCasesProps {
    cases: SavedGame[];
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
}

const SavedCases: React.FC<SavedCasesProps> = ({ cases, onLoad, onDelete }) => {
    const { t, language } = useLanguage();

    if (cases.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-2xl mt-12 border-t border-slate-700 pt-8">
            <h2 className="text-2xl font-bold text-amber-300 mb-4 text-center">{t('savedCasesTitle')}</h2>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {cases.map(game => (
                    <li key={game.id} className="bg-slate-800/60 p-3 rounded-lg flex items-center justify-between transition-all hover:bg-slate-800/90">
                        <div className="flex flex-col">
                           <span className="font-semibold text-slate-200">{game.case.title}</span>
                           <span className="text-xs text-slate-400">
                                {new Date(game.timestamp).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button 
                                onClick={() => onLoad(game.id)} 
                                className="px-3 py-1 text-sm font-semibold bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-colors"
                            >
                                {t('loadCase')}
                            </button>
                            <button 
                                onClick={() => onDelete(game.id)} 
                                className="px-3 py-1 text-sm font-semibold bg-red-800 text-red-100 rounded-md hover:bg-red-700 transition-colors"
                            >
                                {t('deleteCase')}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SavedCases;
