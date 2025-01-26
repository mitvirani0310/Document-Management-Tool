import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Split from "react-split";
import KeyValueList from "../KeyValueList/KeyValueList";
import { useTheme } from '../../contexts/ThemeContext';
import PDFViewer from "../PDFViewer/PDFViewer";

const DocumentViewer = () => {
  const { documentId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [keyValueData, setKeyValueData] = useState({});
  const { theme } = useTheme();
  const pdfViewerRef = useRef(null);
  const [keyValueData] = useState({
    "Loan Number": "Rich Dad",
    "Loan ID": "Dad",
    "Doc Type": "Money",
    "Borrower 1 First Name": "impor",
    "Borrower 1 Last Name": "this",
    "Borrower Vesting Override": "ROBBY SMITH, AN UNMARRIED MAN",
    "Borrower Mailing Street Address": "17344 ROSEVILLE BLVD",
    "sample":"dvdhsbvj kfbvhsfbvjfkvb sfjvbsfhvbsfj kvsf,vbsfvbsfl dvnsfvbsfjkvb sfjvsfjvbsfhvgu sfkvhsfjdv bfhvbufkd vbsvgfbsf"
  });


  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/documents/${documentId}`);
        if (!response.ok) throw new Error('Failed to fetch document');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        // Fetch metadata separately
        const metadataResponse = await fetch(`http://localhost:5000/api/documents/${documentId}/metadata`);
        if (!metadataResponse.ok) throw new Error('Failed to fetch metadata');
        const metadata = await metadataResponse.json();
        console.log('metadata: ', metadata);
        // setKeyValueData(metadata);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocument();
  }, [documentId]);

  const handleKeyValueClick = (value) => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.search(value);
    }
  };

  if (error) return (
    <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-red-500'}`}>
      {error}
    </div>
  );

  return (
    <div className="h-screen flex flex-col p-4">
      <Split 
        className="flex flex-1"
        sizes={[60, 40]}
        minSize={[400, 300]}
      >
        <PDFViewer
          ref={pdfViewerRef}
          pdfUrl={pdfUrl}
          isLoading={isLoading}
        />
        <KeyValueList
          data={keyValueData}
          handleKeyValueClick={handleKeyValueClick}
          isLoading={isLoading}
        />
      </Split>
    </div>
  );
};

export default DocumentViewer;