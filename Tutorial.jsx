import { useState } from 'react';
import { CARD_DEFS, ALL_CARDS, PLAYER_DEFS } from './gameLogic';

const STEPS = [
  {
    icon: '🗿',
    title: 'Welcome to Tiki Topple!',
    content: (
      <>
        <p className="tut-text">
          Tiki Topple is a turn-based strategy game where you secretly control a color
          and try to get it to the top of as many stacks as possible.
        </p>
        <div className="tut-highlight">
          🎯 You are one of 4 players — each secretly representing a color:<br />
          🔴 Red &nbsp;·&nbsp; 🔵 Blue &nbsp;·&nbsp; 🟢 Green &nbsp;·&nbsp; 🟡 Yellow
        </div>
      </>
    ),
  },
  {
    icon: '🎯',
    title: 'Your Objective',
    content: (
      <>
        <p className="tut-text">
          The board has <strong>5 stacks</strong> of tiki pieces, each stack holding multiple colored pieces.
          Your goal is simple: get your color to the <strong>top</strong> of as many stacks as possible.
        </p>
        <div className="tut-highlight">
          🏆 At the end, the player whose color sits on top of the <strong>most stacks</strong> wins!
        </div>
      </>
    ),
  },
  {
    icon: '🏛️',
    title: 'The Board',
    content: (
      <>
        <p className="tut-text">
          Each stack is a column of colored tiki pieces. The <strong>top piece</strong> (shown brighter, with a ★) is the
          one that scores at the end. All other pieces are buried.
        </p>
        <BoardPreview />
        <div className="tut-highlight">
          💡 Only the <strong>top piece</strong> of each stack counts for scoring!
        </div>
      </>
    ),
  },
  {
    icon: '🃏',
    title: 'Your Action Cards',
    content: (
      <>
        <p className="tut-text">Each player has 5 action cards. Each card is used <strong>exactly once</strong> per game.</p>
        <div className="tut-cards-grid">
          {ALL_CARDS.map(id => {
            const c = CARD_DEFS[id];
            return (
              <div className="tut-card" key={id} style={{ borderColor: c.color + '88' }}>
                <div className="tut-card-icon" style={{ color: c.color }}>{c.icon}</div>
                <div className="tut-card-name" style={{ color: c.color }}>{c.label}</div>
                <div className="tut-card-desc">{c.desc}</div>
              </div>
            );
          })}
        </div>
      </>
    ),
  },
  {
    icon: '⚔️',
    title: 'Taking Your Turn',
    content: (
      <>
        <p className="tut-text">On your turn, you do two things:</p>
        <div className="tut-highlight">
          1️⃣ &nbsp;<strong>Pick a card</strong> from your hand<br />
          2️⃣ &nbsp;<strong>Perform its action</strong> by clicking stacks
        </div>
        <p className="tut-text">
          Then play passes to the next player. Once all players have played all 5 cards
          (20 turns total), the game ends.
        </p>
        <div className="tut-highlight">
          🧠 <strong>Strategy tip:</strong> Don't reveal your color too early — opponents
          will target you! Save powerful cards like Raise and Topple for later.
        </div>
      </>
    ),
  },
  {
    icon: '🏆',
    title: 'Winning the Game',
    content: (
      <>
        <p className="tut-text">
          After all 20 turns, look at the <strong>top piece</strong> of each stack. Count how many
          stacks have your color on top. The player with the most <strong>tops</strong> wins!
        </p>
        <div className="tut-highlight">
          Example final board:<br />
          Stack 1 🔴 · Stack 2 🟢 · Stack 3 🔴 · Stack 4 🔵 · Stack 5 🔴<br />
          <strong style={{ color: '#FF4444' }}>→ Red wins with 3 tops!</strong>
        </div>
        <p className="tut-text" style={{ fontSize: 13, color: 'var(--muted)' }}>
          Ties are broken by total pieces visible across stacks (not just tops).
        </p>
      </>
    ),
  },
];

function BoardPreview() {
  const colors = [
    ['#4499FF', '#FF4444', '#44DD66'],
    ['#44DD66', '#FF4444', '#4499FF'],
    ['#FF4444', '#44DD66', '#4499FF'],
    ['#4499FF', '#FFCC00', '#FF4444'],
    ['#44DD66', '#4499FF', '#FFCC00'],
  ];
  return (
    <div className="tut-board">
      {colors.map((stack, si) => (
        <div className="tut-stack" key={si}>
          {[...stack].reverse().map((color, pi) => {
            const isTop = pi === 0;
            return (
              <div
                key={pi}
                className={`tut-piece ${isTop ? 'tut-top' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${color}cc, ${color}66)`,
                  borderColor: isTop ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
                }}
              />
            );
          })}
          <div className="tut-base" />
        </div>
      ))}
    </div>
  );
}

export default function Tutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const isLast = step === total - 1;
  const s = STEPS[step];

  return (
    <div className="tutorial-bg">
      <div className="tutorial-box">
        <div className="tut-step-badge">Step {step + 1} of {total}</div>
        <div className="tut-icon">{s.icon}</div>
        <div className="tut-title">{s.title}</div>
        {s.content}

        <div className="tut-dots">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`tut-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>

        <div className="tut-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Skip Tutorial
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            <button
              className={`btn btn-sm ${isLast ? 'btn-gold' : 'btn-primary'}`}
              style={{ minWidth: 110 }}
              onClick={() => isLast ? onClose() : setStep(s => s + 1)}
            >
              {isLast ? "Let's Play! 🗿" : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
