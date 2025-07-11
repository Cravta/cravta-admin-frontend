import React from "react";
import { X, BookOpen } from "lucide-react";

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  documentUrl,
  title = "Document Preview",
  loading = false,
  colors = {
    primary: "#bb86fc",
    text: "#e0e0e0",
    cardBg: "#1e1e1e",
    cardBgAlt: "#2d2d2d",
    borderColor: "#333333",
  },
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="w-11/12 h-5/6 rounded-lg shadow-xl relative"
        style={{
          backgroundColor: colors.cardBgAlt,
          border: `1px solid ${colors.borderColor}`,
        }}
      >
        {/* Modal Header */}
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <h3
            className="text-lg font-medium"
            style={{ color: colors.primary }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-50 cursor-pointer"
            style={{
              backgroundColor: "rgba(187, 134, 252, 0.1)",
              color: colors.primary,
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 h-full">
          {documentUrl ? (
            <iframe
              src={documentUrl}
              className="w-full h-full rounded-lg"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
              title="Document Preview"
            />
          ) : (
            <div
              className="w-full h-full rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="text-center">
                <BookOpen
                  className={`w-16 h-16 mx-auto mb-4 ${loading ? 'animate-spin' : ''}`}
                  style={{ color: colors.primary }}
                />
                <p style={{ color: colors.text }}>
                  {loading ? 'Loading document...' : 'No document available'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal; 