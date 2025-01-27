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
    async (file) => {
      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        try {
          await axios.post("http://localhost:5000/api/documents/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          fetchDocuments()
        } catch (error) {
          console.error("Error uploading file:", error)
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
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto p-4 flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-between items-center mb-4">
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
            <p className="text-sm text-gray-600 dark:text-gray-50 mb-2">Drag and drop your file here, or</p>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Select a file
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="h-[calc(100vh-240px)] overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
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
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white break-words max-w-xs">
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {(doc.size / 1024).toFixed(2)} KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(doc.uploadDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
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

