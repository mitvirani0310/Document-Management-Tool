import React, { createContext, useContext, useState } from 'react';

export const DocumentTypeContext = createContext();

export function DocumentTypeProvider({ children }) {
  const [selectedDocumentType, setSelectedDocumentType] = useState('default');

  return (
    <DocumentTypeContext.Provider value={{ selectedDocumentType, setSelectedDocumentType }}>
      {children}
    </DocumentTypeContext.Provider>
  );
}

export function useDocumentType() {
  const context = useContext(DocumentTypeContext);
  if (!context) {
    throw new Error('useDocumentType must be used within a DocumentTypeProvider');
  }
  return context;
}