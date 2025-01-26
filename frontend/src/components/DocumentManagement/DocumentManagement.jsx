import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import axios from "axios";

function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          await axios.post("http://localhost:5000/api/documents/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          fetchDocuments();
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    },
    [fetchDocuments]
  );

  const handleShowDocument = useCallback(
    (documentId) => {
      navigate(`/viewer/${documentId}`);
    },
    [navigate]
  );

  const handleDeleteDocument = useCallback(
    async (documentId) => {
      try {
        await axios.delete(`http://localhost:5000/api/documents/${documentId}`);
        fetchDocuments();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    },
    [fetchDocuments]
  );

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Document Management</h1>
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded ${theme === "dark" ? "bg-gray-300 text-gray-800" : "bg-gray-800 text-white"}`}
          >
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
          <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            Upload Document
          </label>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Type</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.size} bytes</td>
                <td>{doc.type}</td>
                <td>{new Date(doc.uploadDate).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleShowDocument(doc._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Show
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
  );
}

export default DocumentManagement;