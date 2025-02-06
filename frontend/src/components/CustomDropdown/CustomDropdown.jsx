import { useState, useRef, useEffect } from "react"
import { ChevronDown, Edit, Plus } from "lucide-react"
import axios from "axios"
import { useDocumentType } from "../../contexts/DocumentTypeContext"

const API_URL = import.meta.env.VITE_API_URL
const CustomDropdown = ({ onSelect, theme, defaultOption }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const {selectedDocumentType, setSelectedDocumentType} = useDocumentType();
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profiles`);
        setOptions(response.data);

        if (selectedDocumentType?._id) {
            const matchingOption = response.data.find(opt => opt._id === selectedDocumentType._id)
            if (matchingOption) {
              setSelectedOption(matchingOption)
            }
          }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setSelectedDocumentType(option);
    if (option.action) {
      onSelect(option);
    } else {
      onSelect({
        label: option.label,
        value: option.value
      });
    }
    setIsOpen(false);
  };

  const handleAddProfile = () => {
    onSelect({ action: "add" });
    setIsOpen(false);
  };


  const buttonClasses = `
    flex items-center justify-between w-full px-4 py-2 text-sm font-medium
    ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100"}
    border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  `

  const dropdownClasses = `
    absolute right-0 mt-2 w-full rounded-md shadow-lg z-50
    ${theme === "dark" ? "bg-gray-800" : "bg-white"}
    ring-1 ring-black ring-opacity-5 focus:outline-none
  `

  const optionClasses = `
    flex items-center justify-between w-full px-4 py-2 text-sm text-left
    ${theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}
  `

  return (
    <div className="relative inline-block text-left w-48 z-50" ref={dropdownRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className={buttonClasses}
      >
        {selectedOption ? selectedOption.label : "Profile"}
        <ChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={dropdownClasses}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button 
              onClick={handleAddProfile} 
              className={`${optionClasses} text-blue-500`} 
              role="menuitem"
            >
              <span>Add Profile</span>
              <Plus className="w-4 h-4" />
            </button>
            {options.map((option) => (
              <button 
                key={option._id} 
                onClick={() => handleSelect(option)} 
                className={optionClasses} 
                role="menuitem"
              >
                <span>{option.label}</span>
                <Edit 
                  className="w-4 h-4 text-gray-400 hover:text-gray-600" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect({ ...option, action: "edit" });
                  }} 
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown

