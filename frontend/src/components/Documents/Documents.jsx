import { useEffect, useState } from "react";
import { FileText, Trash2, RefreshCw, AlertCircle } from "lucide-react";

import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import "./Documents.css";

export default function Documents() {
  const { isAdmin } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/documents");

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to load documents");
      }

      setDocuments(data.documents || []);
    } catch (error) {
      console.error(
        "Fetch documents error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load documents",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(documentId);
      setError("");

      const response = await api.delete(`/api/documents/${documentId}`);

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to delete document");
      }

      setDocuments((current) =>
        current.filter((document) => document.id !== documentId),
      );
    } catch (error) {
      console.error(
        "Delete document error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete document",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="documents">
      <div className="documents-header">
        <div>
          <span className="documents-label">KNOWLEDGE BASE</span>

          <h2>Company Documents</h2>

          <p>Documents connected to NexaRAG.</p>
        </div>

        <button
          className="documents-refresh"
          type="button"
          onClick={fetchDocuments}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "refresh-spinning" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="documents-error">
          <AlertCircle size={18} />

          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="documents-loading">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="documents-empty">
          <div className="documents-empty-icon">
            <FileText size={28} />
          </div>

          <h3>No documents yet</h3>

          <p>
            {isAdmin
              ? "Upload a PDF to start building your knowledge base."
              : "No company documents are available yet."}
          </p>
        </div>
      ) : (
        <div className="documents-list">
          {documents.map((document) => (
            <div className="document-card" key={document.id}>
              <div className="document-icon">
                <FileText size={23} />
              </div>

              <div className="document-info">
                <h3>{document.filename}</h3>

                {document.created_at && (
                  <p>
                    Uploaded{" "}
                    {new Date(document.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {isAdmin && (
                <button
                  className="document-delete"
                  type="button"
                  onClick={() => handleDelete(document.id)}
                  disabled={deletingId === document.id}
                  title="Delete document"
                >
                  <Trash2 size={18} />

                  {deletingId === document.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
