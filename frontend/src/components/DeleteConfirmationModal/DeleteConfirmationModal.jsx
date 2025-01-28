import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, documentName, theme }) => {
    if (!isOpen) return null;
    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
        return () => {
          document.body.style.overflow = "auto";
        };
      }, [isOpen]);
  
    return createPortal(
      <div
        className={`fixed inset-0 z-[999999] flex items-center justify-center ${
            theme === "dark" ? "bg-black/70" : "bg-black/50"
          } backdrop-blur-sm`}
      >
        <div
          className={`relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full`}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <FiX className="w-5 h-5" />
          </button>
          <h2
            className={`text-lg font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Confirm Deletion
          </h2>
          <p
            className={`mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Are you sure you want to delete <strong>{documentName}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

export default DeleteConfirmationModal;
