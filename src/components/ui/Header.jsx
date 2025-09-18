import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Settings,
  Sun,
  Moon,
  LogOut,
  AlertTriangle,
  User,
  ChevronDown,
  MessageCircle,
  Search,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/userSlice";
import { logOut, logoutAuth } from "../../store/auth/adminAuthSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = ({
  isSidebarOpen,
  setIsSidebarOpen,
  headerTitle,
  isMarketplace,
  activeSection,
  setActiveSection,
}) => {
  const { colors, darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const {user} = useSelector((state) => state.auth);
  // Notification data
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "System Alert",
      message: "Unusual login activity detected from IP 192.168.1.1",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Storage Warning",
      message: "Platform storage usage exceeds 80% of allocated capacity",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "Data Backup",
      message: "Weekly database backup completed successfully",
      time: "2 hours ago",
      read: true,
    },
  ];

  // Handle logout
  const handleLogout = async() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("classId");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("userName");
    localStorage.clear();
    navigate("/login");
    dispatch(logout())
    dispatch(logoutAuth())
    await dispatch(logOut());
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="flex items-center justify-between p-4 shadow-md"
      style={{ backgroundColor: colors.cardBgAlt }}
    >
      <div className="flex items-center">
        <h2 className="text-xl font-medium" style={{ color: colors.primary }}>
          <span>
            {activeSection === "overview" ? "Admin Dashboard" : activeSection === "help"? "help center" : activeSection ==="promo-codes"?"Promo Codes":activeSection}
          </span>
        </h2>
      </div>

      <div className="flex items-center">
        {isMarketplace &&
          <div className="relative mr-2" style={{ width: "300px" }}>
              <input
                type="text"
                placeholder="Search for content..."
                className="w-full py-2 pl-10 pr-4 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              />
              <Search
                className="absolute left-3 top-2.5 w-5 h-5"
                style={{ color: "rgba(224, 224, 224, 0.5)" }}
              />
          </div>
          }
        {/* System alerts indicator */}
        <div className="relative" ref={notificationsRef}>
          <button
            className="mr-3 relative p-2 rounded-full hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: "rgba(187, 134, 252, 0.05)",
            }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell
              className="w-5 h-5"
              style={{
                color: hasNotifications ? colors.accentSecondary : colors.text,
              }}
            />
            {hasNotifications && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: colors.accentSecondary,
                  color: "#fff",
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>
          {/* Notifications dropdown */}
          {isNotificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden z-20"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div
                className="py-3 px-4 border-b flex justify-between items-center"
                style={{ borderColor: colors.borderColor }}
              >
                <p className="font-medium" style={{ color: colors.primary }}>
                  Notifications
                </p>
                <button
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                  }}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto py-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 border-b flex hover:opacity-80 cursor-pointer transition-opacity"
                    style={{
                      borderColor: colors.borderColor,
                      backgroundColor: notification.read
                        ? "transparent"
                        : `${colors.primary}10`,
                    }}
                  >
                    <div
                      className="p-2 rounded-full mr-3 flex-shrink-0"
                      style={{
                        backgroundColor:
                          notification.type === "alert"
                            ? `${colors.error}20`
                            : notification.type === "warning"
                            ? `${colors.warning}20`
                            : `${colors.accent}20`,
                      }}
                    >
                      {notification.type === "alert" ? (
                        <AlertTriangle
                          className="w-5 h-5"
                          style={{ color: colors.error }}
                        />
                      ) : notification.type === "warning" ? (
                        <Bell
                          className="w-5 h-5"
                          style={{ color: colors.warning }}
                        />
                      ) : (
                        <MessageCircle
                          className="w-5 h-5"
                          style={{ color: colors.accent }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span
                          className="font-medium"
                          style={{ color: colors.text }}
                        >
                          {notification.title}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          {notification.time}
                        </span>
                      </div>
                      <p
                        className="text-sm mt-1"
                        style={{ color: colors.textMuted }}
                      >
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="py-2 px-4 text-center border-t"
                style={{ borderColor: colors.borderColor }}
              >
                <button className="text-sm" style={{ color: colors.primary }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle button */}
        <button
          className="mr-3 p-2 rounded-full hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: "rgba(187, 134, 252, 0.05)",
          }}
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" style={{ color: colors.accent }} />
          ) : (
            <Moon className="w-5 h-5" style={{ color: colors.primary }} />
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 p-2 rounded-lg hover:opacity-80 transition-opacity border"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              }}
            >
              A
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                {user?.role?.name||"-"}
              </p>
            </div>
            <ChevronDown
              className="w-4 h-4 hidden md:block"
              style={{ color: colors.textMuted }}
            />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg overflow-hidden z-20"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div
                className="py-3 px-4 border-b"
                style={{ borderColor: colors.borderColor }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  {user?.email_address || "-"}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setActiveSection("Settings");
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:opacity-80"
                  style={{ color: colors.text }}
                >
                  <Settings
                    className="w-4 h-4 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm hover:opacity-80"
                  style={{ color: colors.text }}
                >
                  <LogOut
                    className="w-4 h-4 mr-3"
                    style={{ color: colors.error }}
                  />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
