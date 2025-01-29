import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import DocumentManagement from './components/DocumentManagement/DocumentManagement';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';
import DocumentRedact from './components/DocumentRedact/DocumentRedact';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<DocumentManagement />} />
        <Route path="/viewer/:documentId" element={<DocumentViewer />} />
        <Route path="/redact/:documentId" element={<DocumentRedact />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;