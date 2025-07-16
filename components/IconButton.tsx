
import React from 'react';

interface IconButtonProps {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ text, icon, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-3 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-lg shadow-lg hover:bg-amber-400 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300/50 ${className}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default IconButton;
