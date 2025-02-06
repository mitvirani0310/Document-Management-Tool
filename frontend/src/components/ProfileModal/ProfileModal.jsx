import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ProfileModal = ({ isOpen, onClose, profile, theme }) => {
  const [profileName, setProfileName] = useState("");
  const [profileFields, setProfileFields] = useState({});

  useEffect(() => {
    if (profile) {
      setProfileName(profile.label);
      // Convert comma-separated string to object
      const values = profile.value.split(',');
      const fieldsObj = values.reduce((acc, value, index) => {
        acc[index] = value;
        return acc;
      }, {});
      setProfileFields(fieldsObj);
    } else {
      setProfileName("");
      setProfileFields({ 0: "" });
    }
  }, [profile]);
  const handleSave = async () => {
    try {
      const valueString = Object.values(profileFields)
        .filter(value => value.trim() !== '')
        .join(',');
  
      const profileData = {
        label: profileName,
        value: valueString
      };
  
      if (profile?._id) {
        await axios.put(`${API_URL}/api/profiles/${profile._id}`, profileData);
      } else {
        await axios.post(`${API_URL}/api/profiles`, profileData);
      }
      
      onClose();
      // Trigger a refresh in the parent component
      if (typeof onSave === 'function') {
        onSave();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleAddField = () => {
    setProfileFields({ ...profileFields, "": "" });
  };

  const handleFieldChange = (oldKey, newValue) => {
    const updatedFields = { ...profileFields };
    delete updatedFields[oldKey];
    if (newValue.trim() !== "") {
      updatedFields[Object.keys(updatedFields).length] = newValue;
    }
    setProfileFields(updatedFields);
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
        } rounded-lg shadow-lg max-w-md w-full`}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2
          className={`text-lg font-bold mb-4 ${
            theme === "dark" ? "text-gray-300" : "text-gray-900"
          }`}
        >
          {profile ? "Edit Profile" : "Add Profile"}
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="profileName"
              className={`block text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Profile Name
            </label>
            <input
              type="text"
              id="profileName"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-900"
              } border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            />
          </div>

          {Object.entries(profileFields).map(([key, value], index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                placeholder="Enter field name"
                className={`flex-1 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-900"
                } border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              />
            </div>
          ))}

          <button
            onClick={handleAddField}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Field
          </button>
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
