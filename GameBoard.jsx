import { CARD_DEFS, TOTAL_TURNS } from './gameLogic';
import Modal from './Modal';
import VictoryScreen from './VictoryScreen';

/* ─── Piece ─────────────────────────────────── */
function Piece({ color, isTop, isWinning, raiseMode, isRaiseTop, onClick }) {
  const cls = [
    'piece',
    isTop ? 'piece-top' : '',
    isWinning ? 'winning' : '',
    raiseMode && !isRaiseTop ? 'piece-raise' : '',
    raiseMode && isRaiseTop ? 'piece-raise-top' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={{ background: `linear-gradient(135deg, ${color}dd, ${color}77)` }}
      onClick={onClick}
      title={raiseMode && !isRaiseTop ? `Raise this piece to the top` : undefined}
    >
      {isTop ? '🗿' : '●'}
    </div>
  );
}

/* ─── Stack ─────────────────────────────────── */
function Stack({ pieces, index, isSelected, isSource, phase, selectedCard, winnerColor, onStackClick, onPieceClick }) {
  const isRaiseMode = selectedCard === 'RAISE' && phase === 'raise-piece' && isSelected;
  const isEmpty = pieces.length === 0;
  const topColor = isEmpty ? null : pieces[pieces.length - 1];
  const isWinning = topColor && topColor === winnerColor;

  const disabled =
    (phase === 'step1' && selectedCard === 'MOVE' && isEmpty) ||
    (phase === 'step1' && selectedCard === 'SWAP' && isEmpty) ||
    (phase === 'step1' && selectedCard === 'LOWER' && pieces.length <= 1) ||
    (phase === 'step1' && selectedCard === 'TOPPLE' && isEmpty) ||
    (phase === 'step1' && selectedCard === 'RAISE' && pieces.length <= 1) ||
    (phase === 'step2' && selectedCard === 'SWAP' && isEmpty) ||
    phase === 'card-select';

  return (
    <div
      className={[
        'stack-col',
        isSelected ? 'stack-selected' : '',
        isSource ? 'stack-source' : '',
        disabled ? 'stack-disabled' : '',
      ].filter(Boolean).join(' ')}
      onClick={() => !disabled && !isRaiseMode && onStackClick(index)}
    >
      {[...pieces].reverse().map((color, ri) => {
        const actualIdx = pieces.length - 1 - ri;
        const isTop = actualIdx === pieces.length - 1;
        return (
          <Piece
            key={ri}
            color={color}
            isTop={isTop}
            isWinning={isWinning && isTop}
            raiseMode={isRaiseMode}
            isRaiseTop={isRaiseMode && isTop}
            onClick={isRaiseMode && !isTop ? () => onPieceClick(index, actualIdx) : undefined}
          />
        );
      })}
      {isEmpty && (
        <div style={{ height: 34, opacity: 0.25, fontSize: 11, color: 'var(--muted)', textAlign: 'center', lineHeight: '34px' }}>
          empty
        </div>
      )}
      <div
        className="stack-pole"
        style={{ height: Math.max(14, 54 - pieces.length * 8) + 'px' }}
      />
      <div className="stack-base" />
      <div className="stack-label" style={{ color: isSelected ? 'var(--gold)' : undefined }}>
        {isRaiseMode ? 'click piece' : `Stack ${index + 1}`}
      </div>
    </div>
  );
}

/* ─── Card ──────────────────────────────────── */
function GameCard({ cardId, isSelected, isUsed, isLocked, onSelect }) {
  const def = CARD_DEFS[cardId];
  const cls = [
    'game-card',
    isSelected ? 'card-selected' : '',
    isUsed ? 'card-used' : '',
    isLocked ? 'card-locked' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={{
        color: def.color,
        borderColor: isSelected ? def.color : undefined,
        boxShadow: isSelected ? `0 0 24px ${def.color}88` : undefined,
      }}
      onClick={() => !isUsed && !isLocked && onSelect(cardId)}
    >
      <div className="card-icon">{def.icon}</div>
      <div className="card-name">{def.label}</div>
      <div className="card-desc">{def.desc}</div>
      {isUsed && <div className="card-used-x">✕</div>}
    </div>
  );
}

/* ─── Main GameBoard ────────────────────────── */
const ALL_CARD_IDS = ['MOVE', 'SWAP', 'RAISE', 'LOWER', 'TOPPLE'];

export default function GameBoard({
  game, onSelectCard, onCancelCard, onStackClick, onPieceClick,
  onReset, onExit, onShowTutorial
}) {
  const { stacks, players, currentPlayer: cpIdx, phase, selectedCard, selectedStack, turnsPlayed, gameStatus, winner } = game;
  const cp = players[cpIdx];
  const turnsLeft = TOTAL_TURNS - turnsPlayed;

  const instruction = (() => {
    if (phase === 'card-select') return `${cp.emoji} ${cp.name} — choose a card to play`;
    const def = CARD_DEFS[selectedCard];
    if (phase === 'step1') {
      if (selectedCard === 'MOVE')   return `${def.label}: click the stack to move FROM`;
      if (selectedCard === 'SWAP')   return `${def.label}: click the first stack to swap`;
      if (selectedCard === 'RAISE')  return `${def.label}: click a stack, then a buried piece`;
      if (selectedCard === 'LOWER')  return `${def.label}: click the stack to lower`;
      if (selectedCard === 'TOPPLE') return `${def.label}: click the stack to topple`;
    }
    if (phase === 'step2') {
      if (selectedCard === 'MOVE')   return `${def.label}: now click the destination stack`;
      if (selectedCard === 'SWAP')   return `${def.label}: now click the second stack`;
    }
    if (phase === 'raise-piece') return `${def.label}: click any buried piece to raise it`;
    return '';
  })();

  return (
    <div className="game-screen">
      {/* Victory */}
      {gameStatus === 'ended' && winner && (
        <VictoryScreen
          players={players}
          winner={winner}
          onPlayAgain={onReset}
          onExit={onExit}
        />
      )}

      {/* Header */}
      <div className="game-header">
        <div className="header-logo">🗿 Tiki Topple</div>

        <div className="header-turn">
          <div className="turn-dot" style={{ background: cp.color, color: cp.color }} />
          <span style={{ color: cp.color, fontWeight: 900, fontSize: 15 }}>{cp.name}</span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>— {CARD_DEFS[selectedCard]?.label ?? 'pick card'}</span>
        </div>

        <div className="turns-badge">{turnsLeft} turn{turnsLeft !== 1 ? 's' : ''} left</div>

        <div className="header-actions">
          <button className="btn btn-ghost btn-sm" onClick={onShowTutorial}>❓ How to Play</button>
          <button className="btn btn-ghost btn-sm" onClick={onReset}>🔄 Reset</button>
          <button className="btn btn-danger btn-sm" onClick={onExit}>🚪 Exit</button>
        </div>
      </div>

      {/* Body */}
      <div className="game-body">
        <div className="game-main">
          {/* Instruction */}
          <div className="instr-bar">{instruction}</div>

          {/* Cancel card button */}
          {selectedCard && phase !== 'card-select' && (
            <button className="btn btn-ghost btn-sm" onClick={onCancelCard} style={{ alignSelf: 'center' }}>
              ✕ Cancel {CARD_DEFS[selectedCard].label}
            </button>
          )}

          {/* Stacks */}
          <div className="stacks-area">
            {stacks.map((pieces, i) => (
              <Stack
                key={i}
                index={i}
                pieces={pieces}
                isSelected={i === selectedStack}
                isSource={i === selectedStack && phase === 'step2'}
                phase={phase}
                selectedCard={selectedCard}
                winnerColor={winner?.color}
                onStackClick={onStackClick}
                onPieceClick={onPieceClick}
              />
            ))}
          </div>

          {/* Card Hand */}
          <div className="card-hand">
            <div className="card-hand-label">{cp.name}'s cards</div>
            {ALL_CARD_IDS.map(id => (
              <GameCard
                key={id}
                cardId={id}
                isSelected={selectedCard === id}
                isUsed={!cp.cards.includes(id)}
                isLocked={phase !== 'card-select' && selectedCard !== id}
                onSelect={onSelectCard}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-title">Players</div>
          {players.map((p, i) => (
            <div
              key={p.id}
              className={`player-card ${i === cpIdx ? 'active' : ''}`}
              style={{ borderColor: i === cpIdx ? p.color : 'transparent' }}
            >
              <div className="player-card-name" style={{ color: p.color }}>
                {p.emoji} {p.name}
                {i === cpIdx && <span className="active-arrow">▶</span>}
              </div>
              <div className="player-score-row">
                <span className="player-score-num" style={{ color: p.color }}>{p.score}</span>
                <span className="player-score-lbl">tops</span>
              </div>
              <div className="player-cards-left">
                {p.cards.map(c => (
                  <span key={c} className="mini-card" style={{ color: CARD_DEFS[c].color }}>
                    {CARD_DEFS[c].icon}
                  </span>
                ))}
                {p.cards.length === 0 && <span style={{ fontSize: 10, color: 'var(--muted)' }}>done</span>}
              </div>
            </div>
          ))}

          {/* Live tops */}
          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Current Tops
            </div>
            {stacks.map((s, i) => {
              const top = s.length > 0 ? s[s.length - 1] : null;
              const owner = top ? players.find(p => p.color === top) : null;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--muted)', width: 42 }}>Stack {i + 1}</span>
                  <span style={{
                    width: 9, height: 9, borderRadius: '50%',
                    background: owner?.color ?? '#444',
                    boxShadow: owner ? `0 0 5px ${owner.color}` : 'none',
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: 10, color: owner?.color ?? 'var(--muted)' }}>
                    {owner?.name ?? 'empty'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
