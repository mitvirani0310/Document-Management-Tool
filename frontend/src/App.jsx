import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import DocumentManagement from './components/DocumentManagement/DocumentManagement';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';
import DocumentRedact from './components/DocumentRedact/DocumentRedact';
import DocumentSearch from './components/DocumentSearch/DocumentSearch';
import { DocumentTypeProvider } from './contexts/DocumentTypeContext';

function App() {
  return (
    <ThemeProvider>
        <DocumentTypeProvider>
      <Routes>
        <Route path="/" element={<DocumentManagement />} />
        <Route path="/viewer/:documentId" element={<DocumentViewer />} />
        <Route path="/redact/:documentId" element={<DocumentRedact />} />
        <Route path="/search/:documentId" element={<DocumentSearch />} />
      </Routes>
      </DocumentTypeProvider>
    </ThemeProvider>
  );
}

export default App;