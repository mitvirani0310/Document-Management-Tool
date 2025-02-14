import { useState, useRef, useEffect } from "react"
import { ChevronDown, Copy, Edit, Plus, Trash } from "lucide-react"
import axios from "axios"
import { useDocumentType } from "../../contexts/DocumentTypeContext"
import { FiX } from "react-icons/fi"
import { toast } from "react-toastify"

const API_URL = import.meta.env.VITE_API_URL
const normalCase = "normal-case"
const CustomDropdown = ({ onSelect, theme, defaultOption, fetchProfiles }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const { selectedDocumentType, setSelectedDocumentType } = useDocumentType()
  const dropdownRef = useRef(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    profile: null,
  })

  useEffect(() => {
    const fetchProfilesInternal = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profiles`)
        setOptions(response.data)

        console.log('selectedDocumentType: ', selectedDocumentType);
        if (selectedDocumentType?._id) {
          console.log('selectedDocumentType: ', selectedDocumentType);
          const matchingOption = response.data.find((opt) => opt._id === selectedDocumentType._id)
          console.log('matchingOption: ', matchingOption);
          if (matchingOption) {
            setSelectedOption(matchingOption)
          }
        }
        // if(defaultOption){
        //   setSelectedOption(defaultOption)
        // }
      } catch (error) {
        console.error("Error fetching profiles:", error)
      }
    }

    fetchProfilesInternal()

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedDocumentType, fetchProfiles])

  const handleSelect = (option) => {
    setSelectedOption(option);
    if (option.action) {
      onSelect(option)
    } else {
      setSelectedDocumentType(option);
      onSelect({
        label: option.label,
        value: option.value,
      })
    }
    setIsOpen(false)
  }

  const handleAddProfile = () => {
    onSelect({ action: "add" })
    setIsOpen(false)
  }

  const handleDeleteProfile = (e, option) => {
    e.stopPropagation()
    setDeleteConfirmation({
      isOpen: true,
      profile: option,
    })
  }

  const confirmDelete = () => {
    const option = deleteConfirmation.profile
    axios
      .delete(`${API_URL}/api/profiles/${option._id}`)
      .then(() => {
        fetchProfiles()
        if (selectedOption?._id === option._id) {
          setSelectedOption(null)
          setSelectedDocumentType(null)
        }
        toast.success("Profile deleted successfully", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme,
        })
      })
      .catch((error) => {
        console.error("Error deleting profile:", error)
        toast.error("Error deleting profile", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme,
        })
      })
      .finally(() => {
        setDeleteConfirmation({ isOpen: false, profile: null })
      })
  }

  const buttonClasses = `
    flex items-center justify-between w-full px-4 py-2 text-sm font-medium ${normalCase}
    ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100"}
    border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  `

  const dropdownClasses = `
    absolute right-0 mt-2 w-full rounded-md shadow-lg z-50
    ${theme === "dark" ? "bg-gray-800" : "bg-white"}
    ring-1 ring-black ring-opacity-5 focus:outline-none
  `

  const optionClasses = `
    flex items-center whitespace-nowrap justify-between w-full px-4 py-2 text-sm text-left ${normalCase}
    ${theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}
  `
  const defaultProfileOption = {
    _id: "default",
    label: "Default",
    value: null,
  }

  return (
    <div className="relative inline-block text-left w-[184px] z-50" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={buttonClasses}>
      {selectedDocumentType === "default" ? " Select Profile" : selectedDocumentType?.label || "Select Profile"}

        {/* {selectedDocumentType === "default" ? " Select Profile" : selectedDocumentType.label } */}
        <ChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={dropdownClasses}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button onClick={handleAddProfile} className={`${optionClasses} text-blue-500`} role="menuitem">
              <span>Add Profile</span>
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => handleSelect(defaultProfileOption)} className={optionClasses} role="menuitem">
              <span>Default</span>
            </button>
            {options.map((option) => (
              <button key={option._id} onClick={() => handleSelect(option)} className={optionClasses} role="menuitem">
                <span className="w-3/5 whitespace-normal text-left">{option.label}</span>
                <div className="flex gap-1">
                  <Edit
                    className="w-4 h-4 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect({ ...option, action: "edit" })
                    }}
                  />  
                    <Copy onClick={(e ) => {
                       e.stopPropagation();
                      handleSelect({ ...option, action: "duplicate" });
                      }} className="w-4 h-4 text-blue-400 hover:text-blue-600" />                
                  <Trash
                    className="w-4 h-4 text-red-400 hover:text-red-600"
                    onClick={(e) => handleDeleteProfile(e, option)}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

{deleteConfirmation.isOpen && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center ${
            theme === "dark" ? "bg-black/70" : "bg-white/10"
          } backdrop-blur-sm`}
        >
          <div
            className={`relative p-6 ${theme === "dark" ? "bg-white" : "bg-white"} rounded-lg shadow-lg max-w-sm w-full`}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-base font-bold ${normalCase} ${theme === "dark" ? "text-gray-600" : "text-gray-800"}`}>
                Delete Confirmation
              </h2>
              <button
                className="p-1 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-200/10"
                onClick={() => setDeleteConfirmation({ isOpen: false, profile: null })}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <p className={`mb-6 text-base ${normalCase} ${theme === "dark" ? "text-gray-600" : "text-gray-800"}`}>
              Are you sure you want to delete <strong>{deleteConfirmation.profile?.label}</strong>? This action cannot
              be undone.
            </p>
            <div className="flex justify-between space-x-2">
              <button
                onClick={() => setDeleteConfirmation({ isOpen: false, profile: null })}
                className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-base text-gray-700 dark:text-gray-200 ${normalCase}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-base text-white ${normalCase}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDropdown

