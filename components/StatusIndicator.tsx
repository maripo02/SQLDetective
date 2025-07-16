import React from 'react';
import IconButton from './IconButton';
import { PlayIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface StatusIndicatorProps {
  message: string;
  isError?: boolean;
  onRetry?: () => void;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ message, isError = false, onRetry }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      {!isError ? (
        <div className="w-16 h-16 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin mb-6"></div>
      ) : (
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">!</span>
        </div>
      )}
      <p className={`text-xl ${isError ? 'text-red-400' : 'text-slate-300'}`}>{message}</p>
      {isError && onRetry && (
         <div className="mt-8">
            <IconButton text={t('tryAgain')} icon={<PlayIcon />} onClick={onRetry} />
         </div>
      )}
    </div>
  );
};

export default StatusIndicator;