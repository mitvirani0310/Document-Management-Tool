import React, { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../contexts/ThemeContext"
import axios from "axios"
import { FiSun, FiMoon, FiUploadCloud } from "react-icons/fi"

function DocumentManagement() {
  const [documents, setDocuments] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/documents")
      setDocuments(response.data)
    } catch (error) {
      console.error("Error fetching documents:", error)
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
          await axios.post("http://localhost:5000/api/documents/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          fetchDocuments()
        } catch (error) {
          console.error("Error uploading files:", error)
        }
      }
    },
    [fetchDocuments],
  )

  const handleShowDocument = useCallback(
    (documentId) => {
      navigate(`/viewer/${documentId}`)
    },
    [navigate],
  )

  const handleDeleteDocument = useCallback(
    async (documentId) => {
      try {
        await axios.delete(`http://localhost:5000/api/documents/${documentId}`)
        fetchDocuments()
      } catch (error) {
        console.error("Error deleting document:", error)
      }
    },
    [fetchDocuments],
  )

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

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto p-4 flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
            Document AI
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full flex items-center gap-2 ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>

        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center max-w-full mx-auto ${
              isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FiUploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}>
              Drag and drop your files here, or
            </p>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
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

        <div className={`shadow-md rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="h-[calc(100vh-250px)] overflow-auto">
            <table className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${theme === "dark" ? "bg-gray-800 divide-gray-700" : "bg-white divide-gray-200"}`}
              >
                {documents.map((doc) => (
                  <tr
                    key={doc._id}
                    className={`transition-colors duration-200 ${
                      theme === "dark" ? "hover:bg-[#5b5858]/30" : "hover:bg-gray-100"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-200" : "text-gray-900"} break-words max-w-xs`}
                    >
                      {doc.name}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}
                    >
                      {(doc.size / 1024).toFixed(2)} KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                        {doc.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}
                    >
                      {new Date(doc.uploadDate).toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3`}>
                      <button
                        onClick={() => handleShowDocument(doc._id)}
                        className={`px-6 py-1.5 rounded-md text-sm font-medium ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
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
      </div>
    </div>
  )
}

export default DocumentManagement

