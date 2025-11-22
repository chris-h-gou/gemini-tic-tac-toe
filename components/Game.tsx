import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import GameInfo from './GameInfo';
import { BoardState, Player, WinState } from '../types';
import { getBestMove } from '../services/geminiService';
import { useGameContext } from '../context/GameContext';

const Game: React.FC = () => {
  const [history, setHistory] = useState<BoardState[]>([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const { difficulty } = useGameContext();

  const currentSquares = history[stepNumber];

  // Game Logic Helper
  const calculateWinner = (squares: BoardState): WinState => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every((square) => square !== null)) {
      return { winner: 'Draw', line: null };
    }
    return { winner: null, line: null };
  };

  const winState = calculateWinner(currentSquares);
  const gameEnded = winState.winner !== null;

  // Handle Player Move
  const handleClick = (i: number) => {
    if (winState.winner || currentSquares[i] || !xIsNext || isAiThinking) {
      return;
    }

    const newSquares = currentSquares.slice();
    newSquares[i] = 'X';
    handleMove(newSquares);
  };

  // Handle Game State Update
  const handleMove = (newSquares: BoardState) => {
    const newHistory = history.slice(0, stepNumber + 1);
    setHistory([...newHistory, newSquares]);
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  // AI Turn Effect
  useEffect(() => {
    const makeAiMove = async () => {
      if (!xIsNext && !gameEnded) {
        setIsAiThinking(true);
        try {
          const result = await getBestMove(currentSquares, difficulty);
          
          // Validation: Ensure move is valid
          if (currentSquares[result.move] === null) {
            const newSquares = currentSquares.slice();
            newSquares[result.move] = 'O';
            setAiReasoning(result.reasoning);
            handleMove(newSquares);
          } else {
             // Fallback if AI hallucinates an occupied spot (rare with Gemini 2.5)
             const firstEmpty = currentSquares.findIndex(s => s === null);
             if (firstEmpty !== -1) {
                const newSquares = currentSquares.slice();
                newSquares[firstEmpty] = 'O';
                setAiReasoning("Correction: Selected available spot.");
                handleMove(newSquares);
             }
          }
        } catch (error) {
          console.error("AI Move failed", error);
        } finally {
          setIsAiThinking(false);
        }
      }
    };

    makeAiMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, gameEnded, difficulty]); 
  // Note: currentSquares is derived from stepNumber, effectively depended on by xIsNext change flow. 
  // We avoid adding currentSquares to deps to prevent rapid re-triggering if state updates are batched weirdly, 
  // though with xIsNext toggle it should be fine.

  // Reset Game
  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
    setIsAiThinking(false);
    setAiReasoning(null);
  };

  // Status Text
  let status;
  if (winState.winner === 'Draw') {
    status = "It's a Draw!";
  } else if (winState.winner) {
    status = `Winner: ${winState.winner === 'X' ? 'You' : 'Gemini'}`;
  } else {
    status = xIsNext ? "Your Turn (X)" : "Gemini is thinking...";
  }

  return (
    <div className="flex flex-col items-center">
      <Board
        squares={currentSquares}
        winningLine={winState.line}
        onSquareClick={handleClick}
        isPlayerTurn={xIsNext && !isAiThinking}
        gameEnded={gameEnded}
      />
      <GameInfo
        status={status}
        winner={winState.winner}
        onReset={resetGame}
        isAiThinking={isAiThinking}
        aiReasoning={aiReasoning}
      />
    </div>
  );
};

export default Game;