export const NUM_STACKS = 5;
export const PIECES_PER_STACK = 5;
export const NUM_PLAYERS = 4;

export const PLAYER_DEFS = [
  { id: 0, name: 'Player 1', color: '#FF4444', emoji: '🔴' },
  { id: 1, name: 'Player 2', color: '#4499FF', emoji: '🔵' },
  { id: 2, name: 'Player 3', color: '#44DD66', emoji: '🟢' },
  { id: 3, name: 'Player 4', color: '#FFCC00', emoji: '🟡' },
];

export const CARD_DEFS = {
  MOVE:   { id: 'MOVE',   icon: '↗',  color: '#4499FF', label: 'Move',   desc: 'Move top piece of any stack onto another stack.' },
  SWAP:   { id: 'SWAP',   icon: '⇄',  color: '#FF8C00', label: 'Swap',   desc: 'Swap the top pieces of two different stacks.' },
  RAISE:  { id: 'RAISE',  icon: '▲',  color: '#44DD66', label: 'Raise',  desc: 'Pick any piece from a stack and bring it to the top.' },
  LOWER:  { id: 'LOWER',  icon: '▼',  color: '#FF4444', label: 'Lower',  desc: 'Push the top piece of a stack down to the bottom.' },
  TOPPLE: { id: 'TOPPLE', icon: '💥', color: '#CC44FF', label: 'Topple', desc: 'Topple a whole stack — pieces spread to other stacks.' },
};

export const ALL_CARDS = ['MOVE', 'SWAP', 'RAISE', 'LOWER', 'TOPPLE'];
export const TOTAL_TURNS = NUM_PLAYERS * ALL_CARDS.length; // 20

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildStacks() {
  const total = NUM_STACKS * PIECES_PER_STACK; // 25
  const pieces = shuffle(Array.from({ length: total }, (_, i) => PLAYER_DEFS[i % NUM_PLAYERS].color));
  return Array.from({ length: NUM_STACKS }, (_, i) =>
    pieces.slice(i * PIECES_PER_STACK, (i + 1) * PIECES_PER_STACK)
  );
}

export function buildPlayers() {
  return shuffle([...PLAYER_DEFS]).map(p => ({ ...p, score: 0, cards: [...ALL_CARDS] }));
}

export function calcScores(stacks, players) {
  const tops = stacks.filter(s => s.length > 0).map(s => s[s.length - 1]);
  return players.map(p => ({ ...p, score: tops.filter(c => c === p.color).length }));
}

export function getWinner(players) {
  return [...players].sort((a, b) => b.score - a.score)[0];
}

export function executeCard(stacks, card, params) {
  const s = stacks.map(st => [...st]);
  switch (card) {
    case 'MOVE': {
      const piece = s[params.src].pop();
      s[params.dest].push(piece);
      break;
    }
    case 'SWAP': {
      const a = s[params.stackA].pop();
      const b = s[params.stackB].pop();
      s[params.stackA].push(b);
      s[params.stackB].push(a);
      break;
    }
    case 'RAISE': {
      const [piece] = s[params.stackIdx].splice(params.pieceIdx, 1);
      s[params.stackIdx].push(piece);
      break;
    }
    case 'LOWER': {
      const top = s[params.stackIdx].pop();
      s[params.stackIdx].unshift(top);
      break;
    }
    case 'TOPPLE': {
      const pieces = s[params.stackIdx];
      s[params.stackIdx] = [];
      const others = s.map((_, i) => i).filter(i => i !== params.stackIdx);
      pieces.forEach((p, i) => s[others[i % others.length]].push(p));
      break;
    }
  }
  return s;
}
