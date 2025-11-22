import React from 'react';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';

const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
        <header className="w-full max-w-md mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-tight mb-2">
            Gemini Tic-Tac-Toe
          </h1>
          <p className="text-slate-400 text-sm">
            Can you beat the AI?
          </p>
        </header>
        
        <main className="w-full max-w-md">
          <Game />
        </main>

        <footer className="mt-12 text-slate-500 text-xs text-center">
          Powered by Google Gemini 2.5 Flash
        </footer>
      </div>
    </GameProvider>
  );
};

export default App;