export type Player = 'X' | 'O' | null;

export type BoardState = Player[];

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface AiMoveResult {
  move: number;
  reasoning: string;
}

export interface WinState {
  winner: Player | 'Draw';
  line: number[] | null;
}