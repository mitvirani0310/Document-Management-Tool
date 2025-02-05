import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({ options, onSelect, theme, defaultOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === defaultOption) || null
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  const buttonClasses = `
    flex items-center justify-between w-full px-4 py-2 text-sm font-medium 
    ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100"}
    border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  `;

  const dropdownClasses = `
    absolute right-0 mt-2 w-full rounded-md shadow-lg 
    ${theme === "dark" ? "bg-gray-800" : "bg-white"}
    ring-1 ring-black ring-opacity-5 focus:outline-none
  `;

  const optionClasses = `
    block px-4 py-2 text-sm 
    ${theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}
  `;

  return (
    <div className="relative inline-block text-left w-40" ref={dropdownRef}>
      <div>
        <button type="button" onClick={handleToggle} className={buttonClasses}>
          {selectedOption ? selectedOption.label : "Select Profile"}
          <ChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className={dropdownClasses}>
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {options.map((option) => (
              <button key={option.value} onClick={() => handleSelect(option)} className={optionClasses} role="menuitem">
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;