import React from 'react';
import { Difficulty, Player } from '../types';
import { useGameContext } from '../context/GameContext';

interface GameInfoProps {
  status: string;
  winner: Player | 'Draw' | null;
  onReset: () => void;
  isAiThinking: boolean;
  aiReasoning: string | null;
}

const GameInfo: React.FC<GameInfoProps> = ({ status, winner, onReset, isAiThinking, aiReasoning }) => {
  const { difficulty, setDifficulty } = useGameContext();

  return (
    <div className="flex flex-col w-full mt-6 space-y-4">
      
      {/* Status Banner */}
      <div className={`flex items-center justify-center p-4 rounded-lg shadow-lg border transition-colors duration-500 ${
        winner === 'X' ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-300' :
        winner === 'O' ? 'bg-rose-900/20 border-rose-500/50 text-rose-300' :
        winner === 'Draw' ? 'bg-slate-700/50 border-slate-500 text-slate-300' :
        isAiThinking ? 'bg-slate-800 border-indigo-500/50 text-indigo-300' :
        'bg-slate-800 border-slate-700 text-slate-300'
      }`}>
        {isAiThinking ? (
           <div className="flex items-center space-x-2">
             <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <span className="font-semibold">Gemini is thinking...</span>
           </div>
        ) : (
          <span className="text-lg font-bold tracking-wide">{status}</span>
        )}
      </div>

      {/* AI Reasoning Display (Only show if AI made a move and game isn't reset) */}
      {aiReasoning && !winner && !isAiThinking && (
         <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700/50 text-sm text-slate-400 italic">
            <span className="text-slate-500 font-semibold not-italic mr-2">Gemini:</span>
            "{aiReasoning}"
         </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-col space-y-1 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Difficulty</label>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                {(Object.values(Difficulty) as Difficulty[]).map((level) => (
                    <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            difficulty === level 
                            ? 'bg-slate-700 text-white shadow-sm' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
};

export default GameInfo;