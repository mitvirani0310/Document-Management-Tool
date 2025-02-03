import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const RedactInputModal = ({ isOpen, onClose, onNext, theme }) => {
  if (!isOpen) return null;

  const [jsonInput, setJsonInput] = useState("{}");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleJsonChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleNext = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setError("");
      onNext(parsedData); // Pass the parsed JSON to next step
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center ${
        theme === "dark" ? "bg-black/70" : "bg-white/10"
      } backdrop-blur-sm`}
    >
      <div
        className={`relative p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg max-w-md w-full`}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <FiX className="w-5 h-5" />
        </button>
        <h2
          className={`text-lg font-bold mb-4 ${
            theme === "dark" ? "text-gray-300" : "text-gray-900"
          }`}
        >
          Enter Data to Redact in JSON
        </h2>

        <textarea
          className="w-full h-40 p-3 text-sm border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder='{
          "key": "value"
}'
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RedactInputModal;
