const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.array("files", 10), documentController.uploadDocuments);
router.get("/", documentController.getAllDocuments);
router.get("/:id", documentController.getDocument);
router.get("/:id/metadata", documentController.getDocumentMetadata);
router.delete("/:id", documentController.deleteDocument);
router.post("/:id/extract", documentController.extractPdfData);

module.exports = router;