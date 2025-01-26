import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import DocumentManagement from './components/DocumentManagement/DocumentManagement';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<DocumentManagement />} />
        <Route path="/viewer/:documentId" element={<DocumentViewer />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;