import React from 'react';
import Square from './Square';
import { BoardState } from '../types';

interface BoardProps {
  squares: BoardState;
  winningLine: number[] | null;
  onSquareClick: (index: number) => void;
  isPlayerTurn: boolean;
  gameEnded: boolean;
}

const Board: React.FC<BoardProps> = ({ squares, winningLine, onSquareClick, isPlayerTurn, gameEnded }) => {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onClick={() => onSquareClick(i)}
          isWinningSquare={winningLine?.includes(i) ?? false}
          disabled={!isPlayerTurn || gameEnded}
        />
      ))}
    </div>
  );
};

export default Board;