import { useAuth } from "../../context/AuthContext";

import PDFUpload from "../PDFUpload/PDFUpload";
import Documents from "../Documents/Documents";
import RAGChat from "../RAGChat/RAGChat";

import "./Dashboard.css";

export default function Dashboard() {
  const { user, profile, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>NexaRAG</h1>

          <p>Welcome, {profile?.name || user?.email}</p>
        </div>

        <div className="dashboard-user">
          <span>{isAdmin ? "Admin" : "Employee"}</span>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {isAdmin && <PDFUpload />}

        <Documents />

        <RAGChat />
      </main>
    </div>
  );
}
