import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SaveGameModalProps {
    onSave: () => void;
    onExit: () => void;
    onCancel: () => void;
}

const SaveGameModal: React.FC<SaveGameModalProps> = ({ onSave, onExit, onCancel }) => {
    const { t } = useLanguage();

    return (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-dialog-title"
        >
            <div className="bg-slate-800 rounded-lg p-6 md:p-8 border border-slate-600 shadow-2xl max-w-sm w-full m-4 text-center">
                <h2 id="save-dialog-title" className="text-2xl font-bold text-amber-300 mb-4">{t('saveGameTitle')}</h2>
                <p className="text-slate-300 mb-8">{t('saveGamePrompt')}</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onSave} 
                        className="w-full px-4 py-2 font-bold bg-amber-500 text-slate-900 rounded-md hover:bg-amber-400 transition-colors transform hover:scale-105"
                    >
                        {t('saveAndExit')}
                    </button>
                    <button 
                        onClick={onExit} 
                        className="w-full px-4 py-2 font-semibold bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors"
                    >
                        {t('exitWithoutSaving')}
                    </button>
                    <button 
                        onClick={onCancel} 
                        className="w-full px-4 py-2 font-semibold text-slate-400 rounded-md hover:bg-slate-700/50 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SaveGameModal;
