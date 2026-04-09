import Confetti from './Confetti';

export default function VictoryScreen({ players, winner, onPlayAgain, onExit }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <>
      <Confetti />
      <div className="vic-bg">
        <div className="vic-box">
          <div className="vic-crown">👑</div>
          <div className="vic-title">Victory!</div>
          <div className="vic-name" style={{ color: winner.color }}>
            {winner.emoji} {winner.name} Wins!
          </div>

          <div className="score-table">
            {sorted.map((p, i) => (
              <div key={p.id} className={`score-row ${i === 0 ? 'winner-row' : ''}`}>
                <div className="score-player">
                  <span
                    className="score-dot"
                    style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }}
                  />
                  <span style={{ color: i === 0 ? p.color : 'var(--text)', fontSize: i === 0 ? 16 : 13 }}>
                    {p.name} {i === 0 ? '🏆' : ''}
                  </span>
                </div>
                <span className="score-val" style={{ color: i === 0 ? 'var(--gold)' : 'var(--muted)' }}>
                  {p.score}
                  <span style={{ fontSize: 11, fontFamily: 'Nunito,sans-serif', color: 'var(--muted)', marginLeft: 4 }}>
                    tops
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="vic-actions">
            <button className="btn btn-primary btn-md" onClick={onPlayAgain}>
              🎮 Play Again
            </button>
            <button className="btn btn-ghost btn-md" onClick={onExit}>
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
