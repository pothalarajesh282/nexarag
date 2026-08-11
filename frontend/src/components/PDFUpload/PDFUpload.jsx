import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import "./PDFUpload.css";

export default function PDFUpload() {
  const { isAdmin } = useAuth();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Employees cannot upload documents
  if (!isAdmin) {
    return null;
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    setMessage("");
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Only PDF files are allowed.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const response = await api.post("/api/documents/upload", formData);

      console.log("Upload response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Document upload failed.");
      }

      setMessage(response.data.message || "Document uploaded successfully.");

      setFile(null);

      // Reset the file input
      event.target.reset();
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Document upload failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pdf-upload">
      <div className="pdf-upload-header">
        <div className="pdf-upload-icon">
          <Upload size={22} />
        </div>

        <div>
          <span className="pdf-upload-label">ADMIN</span>

          <h2>Upload Company Document</h2>

          <p>Add a PDF to the NexaRAG company knowledge base.</p>
        </div>
      </div>

      <form className="pdf-upload-form" onSubmit={handleUpload}>
        <label className="pdf-file-input">
          <FileText size={22} />

          <span>{file ? file.name : "Choose a PDF file"}</span>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>

        {file && (
          <div className="pdf-selected">
            <FileText size={17} />

            <span>{file.name}</span>

            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}

        <button
          type="submit"
          className="pdf-upload-button"
          disabled={!file || loading}
        >
          <Upload size={18} />

          {loading ? "Processing PDF..." : "Upload PDF"}
        </button>
      </form>

      {message && (
        <div className="pdf-success">
          <CheckCircle size={18} />

          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="pdf-error">
          <AlertCircle size={18} />

          <span>{error}</span>
        </div>
      )}
    </section>
  );
}
