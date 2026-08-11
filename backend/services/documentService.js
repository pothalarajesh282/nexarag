const axios = require("axios");
const FormData = require("form-data");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";


// Upload/process PDF
const processDocument = async (file) => {
  try {
    const formData = new FormData();

    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(
      `${AI_SERVICE_URL}/documents/process`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000,
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Document AI Service Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      "Document processing service is unavailable"
    );
  }
};


// Get documents
const getDocuments = async () => {
  try {
    const response = await axios.get(
      `${AI_SERVICE_URL}/documents`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Get Documents Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      "Unable to fetch documents"
    );
  }
};


// Delete document
const deleteDocument = async (documentId) => {
  try {
    const response = await axios.delete(
      `${AI_SERVICE_URL}/documents/${documentId}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Delete Document Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      "Unable to delete document"
    );
  }
};


module.exports = {
  processDocument,
  getDocuments,
  deleteDocument,
};