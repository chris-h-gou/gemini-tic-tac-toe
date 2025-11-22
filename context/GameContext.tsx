import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Difficulty } from '../types';

interface GameContextType {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.HARD);

  return (
    <GameContext.Provider value={{ difficulty, setDifficulty }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};