import { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../contexts/ThemeContext"
import axios from "axios"
import { Sun, Moon, Upload } from "lucide-react"
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal"
import CustomDropdown from "../CustomDropdown/CustomDropdown"
// const API_URL = import.meta.env.VITE_API_URL
import OutamationAI from "../../../public/outamation-llm.png"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ProfileModal from "../ProfileModal/ProfileModal"
import { useDocumentType } from "../../contexts/DocumentTypeContext"

const API_URL = import.meta.env.VITE_API_URL

function DocumentManagement() {
  const [documents, setDocuments] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const {selectedDocumentType, setSelectedDocumentType} = useDocumentType();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  // const [theme, setTheme] = useState("light")
  const [profiles, setProfiles] = useState([]);
  const [profileCounters, setProfileCounters] = useState({}); // Track counters


  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const fetchDocuments = useCallback(async () => {
    try {
      setIsFetching(true)
      const response = await axios.get(`${API_URL}/api/documents`)
      setDocuments(response.data)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Failed to fetch documents")
    } finally {
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleFileUpload = useCallback(
    async (files) => {
      if (files && files.length > 0) {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i])
        }

        try {
          setIsUploading(true);
          const response = await axios.post(`${API_URL}/api/documents/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          await fetchDocuments();

          // Check the response for messages about existing files
          if (response.data && Array.isArray(response.data)) {
            const existingFileMessages = response.data
              .filter((item) => item.existing === true)
              .map((item) => item.message);

            if (existingFileMessages.length > 0) {
              existingFileMessages.forEach((message) => {
                toast.warn(message, {
                  position: "bottom-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: theme,
                });
              });
            } else {
              toast.success("Files uploaded successfully!", {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme,
              });
            }
          } else {
            // If the response format is unexpected, show a generic success message
            toast.success("Files uploaded successfully!", {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: theme,
            });
          }
        } catch (error) {
          console.error("Error uploading files:", error)
          toast.error("Error uploading files!", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme,
          })
        } finally {
          setIsUploading(false)
        }
      }
    },
    [fetchDocuments, theme],
  )

  const handleShowDocument = useCallback(
    (documentId) => {
      navigate(`/viewer/${documentId}`)
    },
    [navigate],
  )

  const handleShowRedactDocument = useCallback(
    (documentId) => {
      navigate(`/redact/${documentId}`)
    },
    [navigate],
  )

  const handleDeleteDocument = useCallback(async () => {
    if (selectedDocument) {
      try {
        await axios.delete(`${API_URL}/api/documents/${selectedDocument._id}`)
        fetchDocuments()
        setIsModalOpen(false)
        setSelectedDocument(null)
        toast.success(`Deleted "${selectedDocument.name}" successfully`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } catch (error) {
        console.error("Error deleting document:", error)
        toast.error("Error deleting document", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
    }
  }, [fetchDocuments, selectedDocument])

  const handleOpenModal = (document) => {
    setSelectedDocument(document)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDocument(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/profiles`);
      setProfiles(response.data);
      // if (response.data.length > 0) {
      //   setSelectedDocumentType(response.data[0]);
      // }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleDuplicateProfile = async (profileData) => {
    try {
      const response = await axios.post(`${API_URL}/api/profiles`, profileData);
      if (response.ok) {
        toast.success(`Duplicated ${profileData.label} Created Successfully.`)
      }

    } catch (error) {
      toast.error('error: ', error);
    }

  }

  const handleDocumentTypeChange = (profile) => {
    if (profile.action === "edit") {
      setSelectedProfile(profile);
      setIsProfileModalOpen(true);
    } else if (profile.action === "add") {
      setSelectedProfile(null);
      setIsProfileModalOpen(true);
    } else if (profile.action === "duplicate") {
      let baseName = profile.label.trim();
      let newName = baseName;
      let counter = profileCounters[baseName] || 1; // Get existing counter or start from 1
  
      const existingNames = profiles.map(p => p.label.trim());
  
      // Keep incrementing until we find a unique name
      while (existingNames.includes(newName)) {
          newName = `${baseName} ${counter}`;
          counter++;
      }
  
      // Update the counter in state
      setProfileCounters(prev => ({
          ...prev,
          [baseName]: counter, // Store last used counter
      }));
  
      const duplicatedProfile = {
          label: newName,
          value: profile.value,
      };
  
      console.log("Duplicated Profile:", duplicatedProfile);
      handleDuplicateProfile(duplicatedProfile);
      fetchProfiles();
  }
else {  
      setSelectedDocumentType(profile);
    }
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false)
    setSelectedProfile(null)
  }


  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto p-4 flex flex-col flex-grow overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative">
          {/* <h1 className="text-xl font-bold">Document Management</h1> */}
          <img src={OutamationAI || "/placeholder.svg"} alt="Outamation AI" className="w-48 h-12" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent absolute left-1/2 transform -translate-x-1/2">
            Document AI
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full flex items-center gap-2 ${theme === "dark"
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Drag and Drop */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center max-w-full mx-auto ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300"
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
          
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}>
              Drag and drop your files here, or
            </p>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden my-4"
              id="file-upload"
              multiple
              accept=".pdf"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Select files
            </label>
          </div>
        </div>

        {isUploading || isFetching ? (
          <div
            className={`flex items-center justify-center h-[calc(100vh-250px)] ${theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className={`text-base font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {isUploading ? "Uploading files..." : "Fetching files..."}
                </p>
              </div>
            </div>
          </div>
        ) : documents.length > 0 ? (
          <div className={`shadow-md rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="h-[calc(100vh-250px)] overflow-auto">
              <table className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex flex-wrap justify-between items-center">
                        <span> Actions</span>
                        <CustomDropdown
                          options={profiles}
                          onSelect={handleDocumentTypeChange}
                          theme={theme}
                          defaultOption={selectedDocumentType?.value}
                          fetchProfiles={fetchProfiles}
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${theme === "dark" ? "bg-gray-800 divide-gray-700" : "bg-white divide-gray-200"
                    }`}
                >
                  {documents.map((doc) => (
                    <tr
                      key={doc._id}
                      className={`transition-colors duration-200 ${theme === "dark" ? "hover:bg-[#5b5858]/30" : "hover:bg-gray-100"
                        }`}
                    >
                      <td
                        className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-900"
                          } break-words max-w-xs`}
                      >
                        {doc.name}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                      >
                        {new Date(doc.uploadDate).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                          {doc.type}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                      >
                        {(doc.size / (1024 * 1024)).toFixed(2)} MB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleShowDocument(doc._id)}
                          className="px-6 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Extract Data
                        </button>
                        <button
                          onClick={() => handleShowRedactDocument(doc._id)}
                          className="px-6 py-1.5 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
                        >
                          Redact
                        </button>
                        <button
                          onClick={() => handleOpenModal(doc)}
                          className="px-6 py-1.5 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center mt-10 text-gray-500 font-semibold text-md dark:text-gray-400">
            No documents found
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteDocument}
        documentName={selectedDocument?.name}
        theme={theme}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        profile={selectedProfile}
        theme={theme}
        onProfileUpdate={fetchProfiles}
      />
      <ToastContainer position="bottom-center" theme={theme} />
    </div>
  )
}

export default DocumentManagement

