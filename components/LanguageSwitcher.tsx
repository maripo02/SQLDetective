import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
          language === 'en'
            ? 'bg-amber-500 text-slate-900'
            : 'bg-transparent hover:bg-slate-700 text-slate-300'
        }`}
        aria-pressed={language === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
          language === 'es'
            ? 'bg-amber-500 text-slate-900'
            : 'bg-transparent hover:bg-slate-700 text-slate-300'
        }`}
        aria-pressed={language === 'es'}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;