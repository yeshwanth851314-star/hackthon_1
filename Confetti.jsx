import { useMemo } from 'react';

const C = ['#FF4444','#4499FF','#44DD66','#FFCC00','#FF8C00','#CC44FF','#FF69B4','#00FFCC'];
const r = (a, b) => a + Math.random() * (b - a);

export default function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 130 }, (_, i) => ({
    id: i,
    color: C[i % C.length],
    left: `${r(0, 100)}%`,
    delay: `${r(0, 2.2)}s`,
    duration: `${r(2.4, 4.5)}s`,
    size: r(7, 14),
    round: Math.random() > 0.5,
  })), []);

  return (
    <div className="confetti-wrap">
      {pieces.map(p => (
        <div
          key={p.id}
          className="c-piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.round ? p.size : p.size * 0.6,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
