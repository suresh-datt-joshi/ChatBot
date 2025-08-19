import React from 'react';
import './DeleteModal.css';

function DeleteModal({ chatTitle, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Delete chat?</h3>
        </div>
        <div className="modal-body">
          <p>
            This will delete the chat titled: <br />
            <strong>"{chatTitle}"</strong>
          </p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="modal-button cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-button confirm-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;