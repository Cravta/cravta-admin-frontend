import React from "react";
import { X } from "lucide-react";
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const HelpQueryModal = ({ showModal, setShowModal, query }) => {
  if (!showModal || !query) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => setShowModal(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Help Query Details</h2>

        <div className="space-y-3 text-sm">
          <div>
            <strong className="block text-gray-600 dark:text-gray-400">Name:</strong>
            <span className="text-gray-800 dark:text-gray-200">{query.name ?? "-"}</span>
          </div>
          <div>
            <strong className="block text-gray-600 dark:text-gray-400">Email:</strong>
            <span className="text-gray-800 dark:text-gray-200">{query.email ?? "-"}</span>
          </div>
          <div>
            <strong className="block text-gray-600 dark:text-gray-400">Subject:</strong>
            <span className="text-gray-800 dark:text-gray-200">{query.subject ?? "-"}</span>
          </div>
          <div>
            <strong className="block text-gray-600 dark:text-gray-400">Message:</strong>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{query.content ?? "-"}</p>
          </div>
          {query?.replyMessage && <div>
            <strong className="block text-gray-600 dark:text-gray-400">Reply:</strong>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{query.replyMessage ?? "-"}</p>
          </div>
          }
          <div>
            <strong className="block text-gray-600 dark:text-gray-400">Created:</strong>
            <span className="text-gray-800 dark:text-gray-200">
              {query.createdAt ? formatDate(query.createdAt??"") : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpQueryModal;