
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SkullIcon } from './icons/Icons';

interface IncorrectSolutionModalProps {
    onClose: () => void;
}

const IncorrectSolutionModal: React.FC<IncorrectSolutionModalProps> = ({ onClose }) => {
    const { t } = useLanguage();

    return (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="incorrect-solution-dialog-title"
        >
            <div className="bg-slate-800 rounded-lg p-6 md:p-8 border border-red-700 shadow-2xl max-w-sm w-full m-4 text-center">
                <div className="flex justify-center mb-4">
                  <SkullIcon className="w-16 h-16 text-red-500"/>
                </div>
                <h2 id="incorrect-solution-dialog-title" className="text-2xl font-bold text-red-400 mb-4">{t('incorrectSolutionTitle')}</h2>
                <p className="text-slate-300 mb-8">{t('incorrectSolutionBody')}</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onClose} 
                        className="w-full px-4 py-2 font-bold bg-amber-500 text-slate-900 rounded-md hover:bg-amber-400 transition-colors transform hover:scale-105"
                    >
                        {t('tryAgain')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IncorrectSolutionModal;
