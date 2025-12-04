// DeletePopup.jsx
import './DeletePopup.css';

export default function DeletePopup({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
  username
}) {
  if (!open) return null;

  return (
    <div className="delete-popup-overlay">
      <div className="delete-popup-content">
        <h2 className="delete-popup-title">{title}</h2>
        <p className="delete-popup-message">{message}</p>
        <p>User : {username}</p>
        <div className="delete-popup-actions">
          <button
            onClick={onCancel}
            className="delete-popup-cancel-btn"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="delete-popup-confirm-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
