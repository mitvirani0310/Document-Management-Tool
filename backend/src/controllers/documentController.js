const Document = require("../models/Document")
const path = require('path');
const fs = require('fs');
const documentService = require("../services/documentService")

exports.uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const documents = await Promise.all(
      req.files.map(file => documentService.uploadDocument(file))
    );

    res.status(201).json(documents);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await documentService.getAllDocuments()
    res.json(documents)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getDocument = async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    const filePath = path.resolve(__dirname, '../../', document.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    res.sendFile(filePath);
    console.log('filePath: ', filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


exports.getDocumentMetadata = async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document.metadata || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const result = await documentService.deleteDocument(req.params.id)
    if (!result) {
      return res.status(404).json({ message: "Document not found" })
    }
    res.json({ message: "Document deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

