import { GoogleGenAI, Type } from "@google/genai";
import { BoardState, Difficulty, AiMoveResult } from "../types";

// Initialize the client outside of the function to reuse if possible, 
// though typically this is stateless.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBestMove = async (
  board: BoardState,
  difficulty: Difficulty
): Promise<AiMoveResult> => {
  const ai = getClient();

  // Construct a clear text representation of the board for the prompt
  const boardRepresentation = board.map((cell, index) => 
    cell === null ? `[${index}]` : cell
  ).join(' ');

  let systemInstruction = "You are playing Tic-Tac-Toe. You are playing as 'O'. The opponent (User) is 'X'. The board is a flat array of 9 positions, indexed 0-8. 0 is top-left, 8 is bottom-right.";

  if (difficulty === Difficulty.EASY) {
    systemInstruction += " You are a novice player. You make random moves and do not try to block the opponent or win aggressively.";
  } else if (difficulty === Difficulty.MEDIUM) {
    systemInstruction += " You are a competent player. You try to win, but you occasionally miss blocks or opportunities.";
  } else {
    systemInstruction += " You are an unbeatable Grandmaster. You must play optimally. Win if possible, block immediately if threatened, and never lose. If a win is impossible, force a draw.";
  }

  const prompt = `
    Current Board State: ${JSON.stringify(board)}
    (Null indicates an empty square).
    
    Analyze the board. Choose the single best valid move (an index where the value is currently null).
    Provide a short reasoning for your move.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            move: {
              type: Type.INTEGER,
              description: "The index (0-8) of the square to place 'O'."
            },
            reasoning: {
              type: Type.STRING,
              description: "Short explanation of why this move was chosen."
            }
          },
          required: ["move", "reasoning"]
        },
        temperature: difficulty === Difficulty.EASY ? 1.0 : 0.3, // Higher temp for easy mode errors
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }

    const result = JSON.parse(text) as AiMoveResult;
    return result;

  } catch (error) {
    console.error("Error fetching AI move:", error);
    // Fallback logic: find first available spot to prevent game crash
    const availableMoves = board.map((val, idx) => val === null ? idx : -1).filter(idx => idx !== -1);
    const randomFallback = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    
    return {
      move: randomFallback,
      reasoning: "Fallback move due to connection error."
    };
  }
};