import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Auto-toggle sidebar on mobile resize
  useEffect(() => {
    const onResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Derive activeSection from the URL, e.g. '/admin/users' → 'Users'
  const activeSection = location.pathname.split("/")[2] || "overview";

  return (
    <ThemeProvider>
      <div className="flex h-screen flex-col lg:flex-row overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={() => {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            activeSection={activeSection}
            setActiveSection={() => {}}
          />

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}