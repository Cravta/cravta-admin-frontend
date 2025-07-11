import React, { useState } from "react";
import { X } from "lucide-react";

const defaultColors = {
  primary: "#bb86fc",
  text: "#e0e0e0",
  lightText: "#ffffff",
  background: "#121212",
  cardBg: "#1e1e1e",
  cardBgAlt: "#2d2d2d",
  borderColor: "#333333",
  error: "#f44336",
};

const RejectionReasonModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  productTitle = "",
  colors = defaultColors,
}) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="w-full max-w-md rounded-lg shadow-xl relative"
        style={{
          backgroundColor: colors.cardBgAlt || defaultColors.cardBgAlt,
          border: `1px solid ${colors.borderColor || defaultColors.borderColor}`,
        }}
      >
        {/* Modal Header */}
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: colors.borderColor || defaultColors.borderColor }}
        >
          <h3
            className="text-lg font-medium"
            style={{ color: colors.primary || defaultColors.primary }}
          >
            Reject Product{productTitle ? `: ${productTitle}` : ""}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-opacity-50 cursor-pointer"
            style={{
              backgroundColor: "rgba(187, 134, 252, 0.1)",
              color: colors.primary || defaultColors.primary,
            }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          <label
            className="block mb-2 text-sm"
            style={{ color: colors.text || defaultColors.text }}
          >
            Please provide a reason for rejection:
          </label>
          <textarea
            className="w-full p-2 rounded-lg mb-4 resize-none"
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
            disabled={loading}
            placeholder="Enter rejection reason..."
            style={{
              backgroundColor: colors.cardBg || defaultColors.cardBg,
              color: colors.text || defaultColors.text,
              border: `1px solid ${colors.borderColor || defaultColors.borderColor}`,
            }}
          />
        </div>

        {/* Modal Footer */}
        <div
          className="flex justify-end space-x-2 p-4 border-t"
          style={{ borderColor: colors.borderColor || defaultColors.borderColor }}
        >
          <button
            className="px-4 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.text,
              border: `1px solid ${colors.borderColor}`,
            }}
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: colors.error,
              color: colors.lightText,
              border: `1px solid ${colors.error}`,
              opacity: loading || !reason.trim() ? 0.6 : 1,
              cursor: loading || !reason.trim() ? "not-allowed" : "pointer",
            }}
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonModal; 