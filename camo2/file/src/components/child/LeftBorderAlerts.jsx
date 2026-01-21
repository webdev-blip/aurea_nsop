import { Icon } from "@iconify/react";

const iconMap = {
  success: "akar-icons:double-check",
  danger: "mingcute:delete-2-line",
  warning: "mdi:alert-circle-outline",
  info: "ci:link",
};

const LeftBorderAlerts = ({ type = "success", message, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} bg-${type}-100 text-${type}-600 
      border-${type}-600 border-start-width-4-px 
      border-top-0 border-end-0 border-bottom-0 
      px-24 py-13 fw-semibold text-lg radius-4 
      d-flex align-items-center justify-content-between mb-3`}
      role="alert"
    >
      <div className="d-flex align-items-center gap-2">
        <Icon icon={iconMap[type]} className="icon text-xl" />
        {message}
      </div>

      <button
        className={`remove-button text-${type}-600 text-xxl`}
        onClick={onClose}
      >
        <Icon icon="iconamoon:sign-times-light" />
      </button>
    </div>
  );
};

export default LeftBorderAlerts;
