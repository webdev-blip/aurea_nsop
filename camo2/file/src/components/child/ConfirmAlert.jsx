import { Icon } from "@iconify/react";

const ConfirmAlert = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div
          className="alert alert-warning bg-warning-100 text-warning-700 
          border-warning-600 border-start-width-4-px 
          border-top-0 border-end-0 border-bottom-0 
          px-24 py-16 fw-semibold radius-4"
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <Icon icon="mdi:alert-circle-outline" className="text-xl" />
            {message}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
