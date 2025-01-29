import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Split from "react-split";
import KeyValueList from "../KeyValueList/KeyValueList";
import { useTheme } from "../../contexts/ThemeContext";
import PDFViewer from "../PDFViewer/PDFViewer";
import React from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import { FiArrowLeft, FiMoon, FiSun } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;


const DocumentViewer = () => {
  const { documentId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExtractingData, setIsExtractingData] = useState(false);
  const [error, setError] = useState(null);
  const [keyValueData, setKeyValueData] = useState({});
  const { theme, toggleTheme } = useTheme();
  const pdfViewerRef = useRef(null);
  const navigate = useNavigate();
  const hasExtractedData = useRef(false); // Ref to prevent multiple API calls

  // const [keyValueData] = useState({
    //   "Loan Number": "Rich Dad",
    //   "Loan ID": "Dad",
    //   "Doc Type": "Money",
    //   "Borrower 1 First Name": "impor",
    //   "Borrower 1 Last Name": "this",
    //   "Borrower Vesting Override": "ROBBY SMITH, AN UNMARRIED MAN",
    //   "Borrower Mailing Street Address": "17344 ROSEVILLE BLVD",
    //   sample:
    //     "dvdhsbvj kfbvhsfbvjfkvb sfjvbsfhvbsfj kvsf,vbsfvbsfl dvnsfvbsfjkvb sfjvsfjvbsfhvgu sfkvhsfjdv bfhvbufkd vbsvgfbsf",
    // });
    
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/documents/${documentId}`);
        if (!response.ok) throw new Error("Failed to fetch document");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const extractPdfData = async (documentId) => {
      if (hasExtractedData.current) return; // Prevent duplicate API calls
  
      try {
        hasExtractedData.current = true; // Mark API call as initiated
        setIsExtractingData(true);
  
        const response = await fetch(
          `${API_URL}/api/documents/${documentId}/extract`,
          {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ documentId }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to extract PDF data");
        }
  
        const data = await response.json();
        setKeyValueData(data);
      } catch (error) {
        console.error("Error extracting PDF data:", error);
      } finally {
        setIsExtractingData(false);
      }
    };
  


  useEffect(() => {
    if (documentId) {
      fetchDocument();
      extractPdfData(documentId); 
    }
  }, [documentId]);


  const handleKeyValueClick = (value) => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.search(value);
    }
  };

  if (error)
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-red-500"
        }`}
      >
        {error}
      </div>
    );

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } overflow-hidden`}
    >
      <div
        className={`text-center py-3 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-md flex justify-between items-center px-6`}
      >
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Document Extraction
        </h1>
        <p
          className={`${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          } text-sm mt-1`}
        >
          Extract and analyze document information
        </p>
        <div className="flex items-center gap-2">
  <button
    onClick={() => navigate('/')}
    className={`p-2 rounded-full flex items-center gap-2 ${
      theme === "dark"
        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
    title="Back to Home"
  >
    <FiArrowLeft className="w-5 h-5" />
  </button>
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
      </div>
      <div className="flex gap-6 p-6 flex-1 overflow-hidden">
        <Split
          className="flex flex-1"
          sizes={[60, 40]}
          minSize={[window.innerWidth * 0.5, 200]}
          gutterSize={8}
          direction="horizontal"
        >
          <PDFViewer ref={pdfViewerRef} pdfUrl={pdfUrl} isLoading={isLoading} />
          <KeyValueList
            data={keyValueData}
            handleKeyValueClick={handleKeyValueClick}
            isLoading={isExtractingData}
          />
        </Split>
      </div>
    </div>
  );
};

export default DocumentViewer;
