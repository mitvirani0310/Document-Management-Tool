const Document = require("../models/Document")
const path = require('path');
const fs = require('fs');
const documentService = require("../services/documentService")
const { executeExe } = require('../utils/execHelper');

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

exports.extractPdfData = async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // TODO: Replace this with actual EXE execution
    // For now returning mock data
    const mockData = {
        "Loan Number": "Rich Dad",
        "Loan ID": "Dad",
        "Doc Type": "Money",
        "Borrower 1 First Name": "impor",
        "Borrower 1 Last Name": "this",
        "Borrower Vesting Override": "ROBBY SMITH, AN UNMARRIED MAN",
        "Borrower Mailing Street Address": "17344 ROSEVILLE BLVD",
        sample:
          "dvdhsbvj kfbvhsfbvjfkvb sfjvbsfhvbsfj kvsf,vbsfvbsfl dvnsfvbsfjkvb sfjvsfjvbsfhvgu sfkvhsfjdv bfhvbufkd vbsvgfbsf",
      }

    // const exePath = path.join(__dirname, '../../bin/extract.exe');
    // // Convert relative path to absolute path
    // const pdfPath = path.join(__dirname, '../../', document.path);
    // const result = await executeExe(exePath, pdfPath);
    
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
