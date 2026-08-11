const {
  processDocument,
  getDocuments,
  deleteDocument,
} = require("../services/documentService");

// Upload PDF
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
    }

    const result = await processDocument(req.file);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Document Upload Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get documents
const getAllDocuments = async (req, res) => {
  try {
    const result = await getDocuments();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Documents Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete document
const removeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required",
      });
    }

    const result = await deleteDocument(documentId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Document Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getAllDocuments,
  removeDocument,
};
