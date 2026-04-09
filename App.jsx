import { useState } from 'react';
import './index.css';
import Tutorial from './Tutorial';
import Modal from './Modal';
import GameBoard from './GameBoard';
import { useGame } from './useGame';

function safeLS(key) {
  try { return !!localStorage.getItem(key); } catch { return false; }
}
function safeLSSet(key) {
  try { localStorage.setItem(key, '1'); } catch {}
}

export default function App() {
  const [screen, setScreen] = useState('menu');           // menu | game
  const [showTutorial, setShowTutorial] = useState(!safeLS('tiki-seen'));
  const [showExit, setShowExit] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const { game, selectCard, cancelCard, handleStackClick, handlePieceClick, resetGame } = useGame();

  const closeTutorial = () => {
    safeLSSet('tiki-seen');
    setShowTutorial(false);
  };

  const startGame = () => {
    setScreen('game');
  };

  const doExit = () => {
    setShowExit(false);
    setScreen('menu');
  };

  const doReset = () => {
    resetGame();
    setShowReset(false);
  };

  return (
    <>
      {/* Tutorial overlay (shown on top of whatever screen) */}
      {showTutorial && <Tutorial onClose={closeTutorial} />}

      {/* Exit confirmation */}
      {showExit && (
        <Modal
          icon="🚪"
          title="Exit Game?"
          text="Are you sure you want to return to the main menu? Your current progress will be lost."
          onYes={doExit}
          onNo={() => setShowExit(false)}
          yesDanger
        />
      )}

      {/* Reset confirmation */}
      {showReset && (
        <Modal
          icon="🔄"
          title="Restart Game?"
          text="Do you want to restart? Stacks will be reshuffled, player colors reassigned, and all scores reset."
          onYes={doReset}
          onNo={() => setShowReset(false)}
        />
      )}

      {screen === 'menu' && (
        <div className="menu-screen">
          <div className="menu-tikis">🗿🗿🗿</div>
          <div className="menu-title">Tiki Topple</div>
          <div className="menu-tagline">Stack · Topple · Conquer</div>
          <div className="menu-actions">
            <button className="btn btn-primary btn-lg" onClick={startGame}>
              🎮 Start Game
            </button>
            <button className="btn btn-gold btn-md" onClick={() => setShowTutorial(true)}>
              📖 How to Play
            </button>
          </div>
          <div className="menu-hint">
            4 players · 5 stacks · 5 action cards each.<br />
            Own the most stack tops to win!
          </div>
        </div>
      )}

      {screen === 'game' && (
        <GameBoard
          game={game}
          onSelectCard={selectCard}
          onCancelCard={cancelCard}
          onStackClick={handleStackClick}
          onPieceClick={handlePieceClick}
          onReset={() => setShowReset(true)}
          onExit={() => setShowExit(true)}
          onShowTutorial={() => setShowTutorial(true)}
        />
      )}
    </>
  );
}
