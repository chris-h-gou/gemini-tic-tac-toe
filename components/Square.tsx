import React from 'react';
import { Player } from '../types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  const baseClasses = "h-24 w-24 sm:h-28 sm:w-28 bg-slate-800 border-2 rounded-xl flex items-center justify-center text-4xl sm:text-5xl font-bold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100";
  
  const colorClasses = value === 'X' 
    ? 'text-cyan-400 border-slate-700 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
    : value === 'O' 
      ? 'text-rose-400 border-slate-700 shadow-[0_0_15px_rgba(251,113,133,0.3)]'
      : 'border-slate-700 hover:border-slate-600 hover:bg-slate-750 cursor-pointer';

  const winningClasses = isWinningSquare 
    ? value === 'X' ? 'bg-cyan-900/30 border-cyan-500 scale-105' : 'bg-rose-900/30 border-rose-500 scale-105'
    : '';

  return (
    <button
      className={`${baseClasses} ${colorClasses} ${winningClasses}`}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Square filled with ${value}` : "Empty square"}
    >
      <span className={value ? "scale-100 opacity-100 transition-all duration-300" : "scale-50 opacity-0"}>
        {value}
      </span>
    </button>
  );
};

export default Square;