import { useState, useCallback } from 'react';
import {
  buildStacks, buildPlayers, calcScores, getWinner,
  executeCard, TOTAL_TURNS
} from './gameLogic';

function makeGame() {
  return {
    stacks: buildStacks(),
    players: buildPlayers(),
    currentPlayer: 0,
    phase: 'card-select',   // card-select | step1 | step2 | raise-piece
    selectedCard: null,
    selectedStack: null,
    turnsPlayed: 0,
    gameStatus: 'playing',  // playing | ended
    winner: null,
  };
}

function applyCard(g, params) {
  const { selectedCard, currentPlayer, players, turnsPlayed } = g;
  const newStacks = executeCard(g.stacks, selectedCard, params);
  const newPlayers = players.map((p, i) =>
    i !== currentPlayer ? p : { ...p, cards: p.cards.filter(c => c !== selectedCard) }
  );
  const turns = turnsPlayed + 1;
  const isOver = turns >= TOTAL_TURNS;
  const scored = calcScores(newStacks, newPlayers);
  const winner = isOver ? getWinner(scored) : null;
  return {
    ...g,
    stacks: newStacks,
    players: scored,
    currentPlayer: (currentPlayer + 1) % players.length,
    phase: 'card-select',
    selectedCard: null,
    selectedStack: null,
    turnsPlayed: turns,
    gameStatus: isOver ? 'ended' : 'playing',
    winner,
  };
}

export function useGame() {
  const [game, setGame] = useState(makeGame);

  const selectCard = useCallback((cardId) => {
    setGame(g => {
      if (g.phase !== 'card-select' || g.gameStatus !== 'playing') return g;
      if (!g.players[g.currentPlayer].cards.includes(cardId)) return g;
      return { ...g, phase: 'step1', selectedCard: cardId, selectedStack: null };
    });
  }, []);

  const cancelCard = useCallback(() => {
    setGame(g => ({ ...g, phase: 'card-select', selectedCard: null, selectedStack: null }));
  }, []);

  const handleStackClick = useCallback((idx) => {
    setGame(g => {
      if (g.gameStatus !== 'playing') return g;
      const { phase, selectedCard, stacks } = g;

      if (phase === 'step1') {
        if (selectedCard === 'LOWER') {
          if (stacks[idx].length <= 1) return g;
          return applyCard(g, { stackIdx: idx });
        }
        if (selectedCard === 'TOPPLE') {
          if (stacks[idx].length === 0) return g;
          return applyCard(g, { stackIdx: idx });
        }
        if (selectedCard === 'RAISE') {
          if (stacks[idx].length <= 1) return g;
          return { ...g, phase: 'raise-piece', selectedStack: idx };
        }
        // MOVE / SWAP — need second stack
        if (selectedCard === 'MOVE' && stacks[idx].length === 0) return g;
        if (selectedCard === 'SWAP' && stacks[idx].length === 0) return g;
        return { ...g, phase: 'step2', selectedStack: idx };
      }

      if (phase === 'step2') {
        if (idx === g.selectedStack) return { ...g, phase: 'step1', selectedStack: null };
        if (selectedCard === 'SWAP' && stacks[idx].length === 0) return g;
        const params = selectedCard === 'MOVE'
          ? { src: g.selectedStack, dest: idx }
          : { stackA: g.selectedStack, stackB: idx };
        return applyCard(g, params);
      }

      return g;
    });
  }, []);

  const handlePieceClick = useCallback((stackIdx, pieceIdx) => {
    setGame(g => {
      if (g.phase !== 'raise-piece' || stackIdx !== g.selectedStack) return g;
      if (pieceIdx === g.stacks[stackIdx].length - 1) return g; // already top
      return applyCard(g, { stackIdx, pieceIdx });
    });
  }, []);

  const resetGame = useCallback(() => setGame(makeGame()), []);

  return { game, selectCard, cancelCard, handleStackClick, handlePieceClick, resetGame };
}
