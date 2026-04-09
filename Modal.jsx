export default function Modal({ icon, title, text, onYes, onNo, yesDanger }) {
  return (
    <div className="modal-bg" onClick={onNo}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">{icon}</div>
        <div className="modal-title">{title}</div>
        <div className="modal-text">{text}</div>
        <div className="modal-row">
          <button
            className={`btn btn-md ${yesDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onYes}
          >
            Yes
          </button>
          <button className="btn btn-md btn-ghost" onClick={onNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
