import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  BookOpen,
  FileText,
  BarChart2,
  Settings,
  Shield,
  Menu,
  X,
  Activity,
  Database,
  AlertTriangle,
  BookOpen as BookIcon,
  User,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import Logo1 from "../../assets/LOGO-01.png";
import { NavLink, useLocation,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Sidebar = ({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { colors } = useTheme();
  const [alerts, setAlerts] = useState(2); // Number of system alerts
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);
  useEffect(() => {
    console.log("Pathname changed:", pathname);
  },[pathname])
  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div
        className="flex lg:hidden justify-between items-center p-4 border-b"
        style={{
          backgroundColor: colors.sidebarBg,
          borderColor: colors.borderColor,
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md shadow-md hover:bg-opacity-20 transition-colors"
          style={{ backgroundColor: colors.cardBg, color: colors.text }}
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold" style={{ color: colors.primary }}>
          Admin Dashboard
        </span>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-screen shadow-lg border-r transition-transform duration-300 ease-in-out z-50 overflow-y-auto 
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static`}
        style={{
          backgroundColor: colors.sidebarBg,
          borderColor: colors.borderColor,
        }}
      >
        {/* Close button - only visible on mobile when sidebar is open */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-20 transition-colors lg:hidden"
          style={{ backgroundColor: colors.cardBg, color: colors.text }}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div
          className="p-5 flex justify-center border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <div className="h-16">
            <img src={Logo1} alt="Cravta Logo" className="h-20 w-auto" />
          </div>
        </div>

        {/* Admin Profile Section */}
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-8">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              }}
            >
              A
            </div>
            <div>
              <p className="font-medium" style={{ color: colors.primary }}>
                Admin Console
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  Super Administrator
                </p>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${colors.accent}30`,
                    color: colors.accent,
                  }}
                >
                  SUPER
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="space-y-1">
              {user?.role?.rights?.includes("overview") &&
              <li>
                <button
                  onClick={() =>  navigate("/admin/overview")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                      (pathname === "/admin/overview")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/overview")
                        ? colors.primary
                        : colors.text,
                  }}
                >
                  <Home
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Dashboard Overview
                </button>
              </li>
              }
              {user?.role?.rights?.includes("teams") &&
              <li>
                <button
                  onClick={() => navigate("/admin/teams")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/teams")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/teams") ? colors.primary : colors.text,
                  }}
                >
                  <Users
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Team Management
                </button>
              </li>
              }
              {user?.role?.rights?.includes("users") &&
              <li>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/users")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/users") ? colors.primary : colors.text,
                  }}
                >
                  <Users
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  User Management
                </button>
              </li>
              }
              {user?.role?.rights?.includes("classes") &&
              <li>
                <button
                  onClick={() => navigate("/admin/classes")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/classes")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/classes")
                        ? colors.primary
                        : colors.text,
                  }}
                >
                  <BookOpen
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Class Management
                </button>
              </li>
              }
              {user?.role?.rights?.includes("roles") &&
              <li>
                <button
                  onClick={() => navigate("/admin/roles")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/roles")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/roles")
                        ? colors.primary
                        : colors.text,
                  }}
                >
                  <User
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Role Management
                </button>
              </li>
              }
              {user?.role?.rights?.includes("content") &&
              <li>
                <button
                  onClick={() => navigate("/admin/content")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/content")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/content")
                        ? colors.primary
                        : colors.text,
                  }}
                >
                  <FileText
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Content Monitoring
                </button>
              </li>
              }
              {/* Add the blog management navigation item */}
              {user?.role?.rights?.includes("blogs") &&
              <li>
                <button
                  onClick={() => navigate("/admin/blogs")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/blogs")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/blogs") ? colors.primary : colors.text,
                  }}
                >
                  <BookIcon
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Blog Management
                </button>
              </li>
              }
              {user?.role?.rights?.includes("help") &&
              <li>
                <button
                  onClick={() => navigate("/admin/help")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/help")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/help") ? colors.primary : colors.text,
                  }}
                >
                  <BookIcon
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Help Center Section
                </button>
              </li>
              }
              {user?.role?.rights?.includes("reports") &&
              <li>
                <button
                  onClick={() => navigate("/admin/reports")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/reports")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/reports")
                        ? colors.primary
                        : colors.text,
                  }}
                >
                  <BarChart2
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Reports & Analytics
                </button>
              </li>
              }
              {user?.role?.rights?.includes("settings") &&
              <li>
                <button
                  onClick={() => navigate("/admin/settings")}
                  className="flex items-center px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/settings")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/settings")
                        ? colors.primary
                        : colors.text,
                  }}
                >
                  <Settings
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Platform Settings
                </button>
              </li>
              }
              {user?.role?.rights?.includes("audit") &&
              <li>
                <button
                  onClick={() => navigate("/admin/audit")}
                  className="flex items-center justify-between px-3 py-2.5 rounded w-full text-left"
                  style={{
                    backgroundColor:
                    (pathname === "/admin/audit")
                        ? colors.navActiveBg
                        : "transparent",
                    color:
                    (pathname === "/admin/audit") ? colors.primary : colors.text,
                  }}
                >
                  <div className="flex items-center">
                    <Shield
                      className="w-5 h-5 mr-3"
                      style={{ color: colors.primary }}
                    />
                    Audit Log
                  </div>
                  {alerts > 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: colors.accentSecondary,
                        color: "#FFFFFF",
                      }}
                    >
                      {alerts}
                    </span>
                  )}
                </button>
              </li>
              }
            </ul>
          </nav>
        </div>

        {/* Platform Status */}
        <div
          className="p-4 mx-4 mt-8 rounded-lg"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Platform Status
            </span>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.success }}
            ></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div
                className="flex items-center text-xs"
                style={{ color: colors.textMuted }}
              >
                <Activity className="w-3 h-3 mr-1" />
                System
              </div>
              <span className="text-xs" style={{ color: colors.success }}>
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div
                className="flex items-center text-xs"
                style={{ color: colors.textMuted }}
              >
                <Database className="w-3 h-3 mr-1" />
                Database
              </div>
              <span className="text-xs" style={{ color: colors.success }}>
                Healthy
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div
                className="flex items-center text-xs"
                style={{ color: colors.textMuted }}
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Alerts
              </div>
              <span
                className="text-xs"
                style={{
                  color: alerts > 0 ? colors.accentSecondary : colors.success,
                }}
              >
                {alerts > 0 ? `${alerts} Active` : "None"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
