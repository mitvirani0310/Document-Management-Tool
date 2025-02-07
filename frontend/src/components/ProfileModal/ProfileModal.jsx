import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { useDocumentType } from "../../contexts/DocumentTypeContext";

const API_URL = import.meta.env.VITE_API_URL;

const ProfileModal = ({ isOpen, onClose, profile, theme, onProfileUpdate }) => {
  const [profileName, setProfileName] = useState("");
  const [extractionFields, setExtractionFields] = useState([]);
  const { setSelectedDocumentType } = useDocumentType();

  useEffect(() => {
    if (!isOpen) {
      setProfileName("");
      setExtractionFields([]);
      return;
    }

    if (profile) {
      setProfileName(profile.label);
      setExtractionFields(profile.value || []);
    } else {
      setProfileName("");
      setExtractionFields([]);
    }
  }, [isOpen, profile]);

  const handleAddField = () => {
    setExtractionFields([...extractionFields, { key: "", description: "" }]);
  };

  const handleRemoveField = (index) => {
    const newFields = extractionFields.filter((_, i) => i !== index);
    setExtractionFields(newFields);
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...extractionFields];
    newFields[index][field] = value;
    setExtractionFields(newFields);
  };

  const handleSave = async () => {
    try {
      if (!profileName.trim()) {
        alert("Profile name is required");
        return;
      }

      if (extractionFields.length === 0) {
        alert("At least one extraction field is required");
        return;
      }

      const hasEmptyFields = extractionFields.some(
        // field => !field.key.trim() || !field.description.trim()
        field => !field.key.trim()
      );

      if (hasEmptyFields) {
        alert("All keys must be filled out");
        return;
      }

      const profileData = {
        label: profileName,
        value: extractionFields
      };

      setSelectedDocumentType(profileData);

      if (profile?._id) {
        await axios.put(`${API_URL}/api/profiles/${profile._id}`, profileData);
      } else {
        await axios.post(`${API_URL}/api/profiles`, profileData);
      }

      onClose();
      if (typeof onProfileUpdate === 'function') {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${
      theme === "dark" ? "bg-black/70" : "bg-white/10"
    } backdrop-blur-sm`}>
      <div className={`relative p-6 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className={`text-lg font-bold mb-4 ${
          theme === "dark" ? "text-gray-300" : "text-gray-900"
        }`}>
          {profile ? "Edit Profile" : "Add Profile"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm mb-2 font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Profile Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className={`w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-900"
              } border-gray-300 shadow-sm p-2 focus:border-black ring focus:ring-blue-100 focus:ring-opacity-50`}
              placeholder="Enter profile name"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                Data Extraction Fields
              </label>
              <button
                onClick={handleAddField}
                className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>

            <div className="space-y-3">
              {extractionFields.map((field, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                      placeholder="Key"
                      className={`w-full rounded-md ${
                        theme === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-900"
                      } border-gray-300 shadow-sm p-2 text-sm`}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={field.description}
                      onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                      placeholder="Description"
                      className={`w-full rounded-md ${
                        theme === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-900"
                      } border-gray-300 shadow-sm p-2 text-sm`}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveField(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;