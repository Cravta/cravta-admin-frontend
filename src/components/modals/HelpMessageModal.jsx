import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAppSettings } from "../../contexts/AppSettingsProvider";
import { replyHelpQuery } from "../../store/admin/helpSlice";

const ReplyHelpModal = ({ showModal, setShowModal, query }) => {
  const { colors } = useAppSettings();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showModal) {
      setMessage("");
    }
  }, [showModal]);

  const handleClose = () => {
    setMessage("");
    setShowModal(false);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(replyHelpQuery({ id: query?.id, replyMessage:message })).unwrap();
      toast.success("Reply sent successfully.");
      handleClose();
    } catch (error) {
      toast.error(error?.message || "Failed to send reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !query) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.cardBgAlt }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-5 border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
            Reply to Help Query
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-opacity-20"
            style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <p className="text-sm mb-1" style={{ color: colors.terColor }}>
              <strong>Name:</strong> {query.name}
            </p>
            <p className="text-sm mb-4" style={{ color: colors.terColor }}>
              <strong>Email:</strong> {query.email}
            </p>
            <p className="text-sm mb-4" style={{ color: colors.terColor }}>
              <strong>Query:</strong> {query.content}
            </p>
          </div>

          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: colors.terColor }}
            >
              Your Message *
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full p-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end p-5 border-t"
          style={{ borderColor: colors.borderColor }}
        >
          <button
            onClick={handleClose}
            className="px-4 py-2 mr-3 rounded-lg text-sm"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: colors.primary,
              color: colors.cardBg,
              opacity: !message.trim() || isSubmitting ? 0.6 : 1,
              cursor: !message.trim() || isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyHelpModal;
