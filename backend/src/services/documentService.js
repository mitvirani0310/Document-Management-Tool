const Document = require("../models/Document")
const fs = require("fs").promises
const path = require("path")

exports.uploadDocument = async (file) => {
  const document = new Document({
    name: file.originalname,
    path: file.path,
    size: file.size,
    type: file.mimetype,
  })
  return await document.save()
}

exports.getAllDocuments = async () => {
  return await Document.find().sort({ uploadDate: -1 });
}

exports.updateDocument = async (docId, updateData) => {
  return await Document.findByIdAndUpdate(docId, updateData, { new: true });
};

exports.getDocument = async (id) => {
  return await Document.findById(id)
}

exports.deleteDocument = async (id) => {
  const document = await Document.findById(id)
  if (document) {
    await fs.unlink(document.path)
    return await Document.findByIdAndDelete(id)
  }
  return null
}

