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
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center ${
        theme === "dark" ? "bg-black/70" : "bg-white/10"
      } backdrop-blur-sm`}
    >
      <div
        className={`relative p-6 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] 
    max-w-2xl w-full max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700`}
      >
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              {profile ? "Edit Profile" : "Add Profile"}
            </h2>

            <button
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm mb-4 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                Profile Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className={`w-full rounded-md ${
                  theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                } border-gray-300 shadow-sm p-2 focus:border-black ring focus:ring-blue-100 focus:ring-opacity-50`}
                placeholder="Enter profile name"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
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
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto mt-4 pr-2">
          <div className="space-y-3">
            {extractionFields.map((field, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="w-[35%]">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                    placeholder="Key"
                    className={`w-full rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                        : "bg-white text-gray-900 border-gray-200 focus:border-blue-500"
                    } border-2 shadow-sm p-2.5 text-sm transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300`}
                  />
                </div>
                <div className="w-[65%]">
                  <input
                    type="text"
                    value={field.description}
                    onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                    placeholder="Description (optional)"
                    className={`w-full rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                        : "bg-white text-gray-900 border-gray-200 focus:border-blue-500"
                    } border-2 shadow-sm p-2.5 text-sm transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300`}
                  />
                </div>
                <button
                  onClick={() => handleRemoveField(index)}
                  className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end space-x-3 mt-6">
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
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white">
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
};

export default ProfileModal;