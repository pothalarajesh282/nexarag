import { useEffect, useRef, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import PDFUpload from "../PDFUpload/PDFUpload";
import Documents from "../Documents/Documents";
import RAGChat from "../RAGChat/RAGChat";

import "./Dashboard.css";

export default function Dashboard() {
  const { user, profile, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = profile?.name || user?.email;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close the mobile menu on outside click / Escape, same behavior a
  // standard nav dropdown gets — doesn't touch any data logic.
  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <img
            src="/nexarag-logo.svg"
            alt="NexaRAG"
            className="dashboard-logo"
          />

          <div>
            <h1>NexaRAG</h1>
            <p className="dashboard-welcome">Welcome, {displayName}</p>
          </div>
        </div>

        {/* Desktop nav: inline, always visible */}
        <div className="dashboard-user dashboard-user-desktop">
          <span className="dashboard-role">
            {isAdmin ? "Admin" : "Employee"}
          </span>

          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        {/* Mobile nav: single toggle button that opens a compact menu */}
        <div className="dashboard-nav-mobile" ref={menuRef}>
          <button
            type="button"
            className="dashboard-nav-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          {menuOpen && (
            <div className="dashboard-nav-menu" role="menu">
              <div className="dashboard-nav-menu-user">
                <span className="dashboard-role">
                  {isAdmin ? "Admin" : "Employee"}
                </span>
                <p>{displayName}</p>
              </div>

              <button
                type="button"
                className="dashboard-nav-menu-logout"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
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
