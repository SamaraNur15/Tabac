// src/components/Ui/ConfirmDialog.jsx
import './ConfirmDialog.css';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">⚠️</div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-btn confirm-btn--accept" onClick={onConfirm}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
