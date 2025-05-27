import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  Clock,
  ChevronDown,
  User,
  Shield,
  Settings,
  Trash,
  UserPlus,
  UserMinus,
  Edit,
  Check,
  X,
  Eye,
  Mail,
  MoreHorizontal,
  AlertTriangle,
  FileText,
  Save,
  Lock,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

// Dummy data for audit logs
const generateAuditLogs = (count) => {
  const actions = [
    { type: "login", text: "Logged in", icon: <User />, severity: "info" },
    {
      type: "settings",
      text: "Changed platform settings",
      icon: <Settings />,
      severity: "info",
    },
    {
      type: "user_create",
      text: "Created user",
      icon: <UserPlus />,
      severity: "info",
    },
    {
      type: "user_delete",
      text: "Deleted user",
      icon: <UserMinus />,
      severity: "warning",
    },
    {
      type: "user_update",
      text: "Updated user",
      icon: <Edit />,
      severity: "info",
    },
    {
      type: "class_create",
      text: "Created class",
      icon: <FileText />,
      severity: "info",
    },
    {
      type: "class_delete",
      text: "Deleted class",
      icon: <Trash />,
      severity: "warning",
    },
    {
      type: "failed_login",
      text: "Failed login attempt",
      icon: <X />,
      severity: "alert",
    },
    {
      type: "permission",
      text: "Changed permissions",
      icon: <Lock />,
      severity: "warning",
    },
    {
      type: "config",
      text: "Updated AI configuration",
      icon: <Settings />,
      severity: "info",
    },
    {
      type: "email",
      text: "Sent bulk email",
      icon: <Mail />,
      severity: "info",
    },
    {
      type: "backup",
      text: "Started database backup",
      icon: <Save />,
      severity: "info",
    },
    {
      type: "security",
      text: "Modified security settings",
      icon: <Shield />,
      severity: "warning",
    },
  ];

  const admins = [
    "Admin User",
    "System Administrator",
    "John Smith",
    "Jane Doe",
    "System",
  ];

  const logs = [];

  // Generate logs with decreasing timestamps
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const admin = admins[Math.floor(Math.random() * admins.length)];
    const timestamp = new Date(now.getTime() - i * (Math.random() * 3600000)); // Random time within the last hour * i

    logs.push({
      id: `log-${i}`,
      timestamp,
      admin,
      adminId: `admin-${Math.floor(Math.random() * 5) + 1}`,
      action: action.text,
      actionType: action.type,
      actionIcon: action.icon,
      severity: action.severity,
      details: `${action.text} ${
        action.type.includes("user")
          ? "user123@example.com"
          : action.type.includes("class")
          ? "Mathematics 101"
          : "with additional details"
      }`,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
        Math.random() * 255
      )}`,
    });
  }

  return logs;
};

const auditLogsData = generateAuditLogs(50);

// Helper function to format date
const formatDateTime = (date) => {
  if (!date) return "Unknown";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return new Date(date).toLocaleString(undefined, options);
};

const AuditLog = () => {
  const { colors } = useTheme();
  const [logs, setLogs] = useState(auditLogsData);
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showActionTypeDropdown, setShowActionTypeDropdown] = useState(false);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogDetail, setShowLogDetail] = useState(false);

  // Items per page
  const itemsPerPage = 10;

  // Extract unique action types, admins from data
  const actionTypes = [...new Set(logs.map((log) => log.actionType))];
  const admins = [...new Set(logs.map((log) => log.admin))];
  const severities = [...new Set(logs.map((log) => log.severity))];

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...logs];

      // Apply search
      if (searchTerm) {
        filtered = filtered.filter(
          (log) =>
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.admin.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply action type filter
      if (actionTypeFilter !== "all") {
        filtered = filtered.filter(
          (log) => log.actionType === actionTypeFilter
        );
      }

      // Apply severity filter
      if (severityFilter !== "all") {
        filtered = filtered.filter((log) => log.severity === severityFilter);
      }

      // Apply admin filter
      if (adminFilter !== "all") {
        filtered = filtered.filter((log) => log.admin === adminFilter);
      }

      // Apply date range filter
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        filtered = filtered.filter(
          (log) => new Date(log.timestamp) >= fromDate
        );
      }

      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        // Set time to end of day
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter((log) => new Date(log.timestamp) <= toDate);
      }

      setFilteredLogs(filtered);
      // Reset to first page when filters change
      setCurrentPage(1);
    };

    applyFilters();
  }, [
    logs,
    searchTerm,
    actionTypeFilter,
    adminFilter,
    dateRange,
    severityFilter,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);

    // Simulate refreshing logs
    setTimeout(() => {
      setLogs(generateAuditLogs(50));
      setIsLoading(false);
    }, 1000);
  };

  // Handle export
  const handleExport = () => {
    alert("Exporting logs as CSV...");
    // In a real app, implement CSV export functionality
  };

  // Handle log selection for details view
  const handleLogClick = (log) => {
    setSelectedLog(log);
    setShowLogDetail(true);
  };

  // Get appropriate color for severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "alert":
        return colors.error;
      case "warning":
        return colors.warning;
      case "info":
      default:
        return colors.primary;
    }
  };

  // Get appropriate background color for severity
  const getSeverityBgColor = (severity) => {
    switch (severity) {
      case "alert":
        return `${colors.error}20`;
      case "warning":
        return `${colors.warning}20`;
      case "info":
      default:
        return `${colors.primary}20`;
    }
  };

  return (
    <div className="p-6 overflow-auto">
      <div className="mb-6">
        <h2
          className="text-xl font-medium mb-2"
          style={{ color: colors.primary }}
        >
          Audit Log
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Track and monitor administrator actions across the platform
        </p>
      </div>

      {/* Action Bar */}
      <div className="space-y-4 mb-6">
        {/* Search and Quick Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
              style={{ color: colors.textMuted }}
            />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            {/* Refresh button */}
            <button
              className="p-2 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
              onClick={handleRefresh}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>

            {/* Export button */}
            <button
              className="p-2 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Date range selector button */}
            <button
              className="flex items-center px-3 py-2 rounded-lg"
              style={{
                backgroundColor:
                  dateRange.from || dateRange.to
                    ? `${colors.primary}20`
                    : colors.inputBg,
                color:
                  dateRange.from || dateRange.to ? colors.primary : colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => document.getElementById("date-from").showPicker()}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {dateRange.from || dateRange.to
                  ? `${dateRange.from || "Any"} to ${dateRange.to || "Now"}`
                  : "All Dates"}
              </span>
            </button>
          </div>
        </div>

        {/* Detailed Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Hidden date inputs for the date picker */}
          <input
            type="date"
            id="date-from"
            className="hidden"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
          />
          <input
            type="date"
            id="date-to"
            className="hidden"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />

          {/* Action Type filter dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              className="flex items-center px-3 py-2 rounded-lg w-full md:w-auto justify-between"
              style={{
                backgroundColor:
                  actionTypeFilter !== "all"
                    ? `${colors.primary}20`
                    : colors.inputBg,
                color:
                  actionTypeFilter !== "all" ? colors.primary : colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => setShowActionTypeDropdown(!showActionTypeDropdown)}
            >
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <span>
                  {actionTypeFilter === "all"
                    ? "All Actions"
                    : actionTypeFilter
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {showActionTypeDropdown && (
              <div
                className="absolute left-0 right-0 md:right-auto md:w-64 mt-2 rounded-lg shadow-lg z-10 overflow-hidden max-h-64 overflow-y-auto"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{
                      backgroundColor:
                        actionTypeFilter === "all"
                          ? `${colors.primary}20`
                          : "transparent",
                      color: colors.text,
                    }}
                    onClick={() => {
                      setActionTypeFilter("all");
                      setShowActionTypeDropdown(false);
                    }}
                  >
                    All Actions
                  </button>

                  {actionTypes.map((type) => (
                    <button
                      key={type}
                      className="w-full text-left px-4 py-2 text-sm"
                      style={{
                        backgroundColor:
                          actionTypeFilter === type
                            ? `${colors.primary}20`
                            : "transparent",
                        color: colors.text,
                      }}
                      onClick={() => {
                        setActionTypeFilter(type);
                        setShowActionTypeDropdown(false);
                      }}
                    >
                      {type
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Severity filter dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              className="flex items-center px-3 py-2 rounded-lg w-full md:w-auto justify-between"
              style={{
                backgroundColor:
                  severityFilter !== "all"
                    ? `${getSeverityColor(severityFilter)}20`
                    : colors.inputBg,
                color:
                  severityFilter !== "all"
                    ? getSeverityColor(severityFilter)
                    : colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => setShowSeverityDropdown(!showSeverityDropdown)}
            >
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>
                  {severityFilter === "all"
                    ? "All Severities"
                    : severityFilter.charAt(0).toUpperCase() +
                      severityFilter.slice(1)}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {showSeverityDropdown && (
              <div
                className="absolute left-0 right-0 md:right-auto md:w-64 mt-2 rounded-lg shadow-lg z-10 overflow-hidden"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{
                      backgroundColor:
                        severityFilter === "all"
                          ? `${colors.primary}20`
                          : "transparent",
                      color: colors.text,
                    }}
                    onClick={() => {
                      setSeverityFilter("all");
                      setShowSeverityDropdown(false);
                    }}
                  >
                    All Severities
                  </button>

                  {severities.map((severity) => (
                    <button
                      key={severity}
                      className="w-full text-left px-4 py-2 text-sm flex items-center"
                      style={{
                        backgroundColor:
                          severityFilter === severity
                            ? `${getSeverityColor(severity)}20`
                            : "transparent",
                        color: colors.text,
                      }}
                      onClick={() => {
                        setSeverityFilter(severity);
                        setShowSeverityDropdown(false);
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: getSeverityColor(severity) }}
                      ></span>
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin filter dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              className="flex items-center px-3 py-2 rounded-lg w-full md:w-auto justify-between"
              style={{
                backgroundColor:
                  adminFilter !== "all"
                    ? `${colors.primary}20`
                    : colors.inputBg,
                color: adminFilter !== "all" ? colors.primary : colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => setShowAdminDropdown(!showAdminDropdown)}
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>
                  {adminFilter === "all" ? "All Admins" : adminFilter}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {showAdminDropdown && (
              <div
                className="absolute left-0 right-0 md:right-auto md:w-64 mt-2 rounded-lg shadow-lg z-10 overflow-hidden max-h-64 overflow-y-auto"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{
                      backgroundColor:
                        adminFilter === "all"
                          ? `${colors.primary}20`
                          : "transparent",
                      color: colors.text,
                    }}
                    onClick={() => {
                      setAdminFilter("all");
                      setShowAdminDropdown(false);
                    }}
                  >
                    All Admins
                  </button>

                  {admins.map((admin) => (
                    <button
                      key={admin}
                      className="w-full text-left px-4 py-2 text-sm"
                      style={{
                        backgroundColor:
                          adminFilter === admin
                            ? `${colors.primary}20`
                            : "transparent",
                        color: colors.text,
                      }}
                      onClick={() => {
                        setAdminFilter(admin);
                        setShowAdminDropdown(false);
                      }}
                    >
                      {admin}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Range Inputs - Displayed but could be behind a dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="flex-1">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="w-full p-2 rounded-lg focus:outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
              />
            </div>
            <span style={{ color: colors.text }}>to</span>
            <div className="flex-1">
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="w-full p-2 rounded-lg focus:outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
              />
            </div>
            {(dateRange.from || dateRange.to) && (
              <button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.error,
                }}
                onClick={() => setDateRange({ from: "", to: "" })}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: `1px solid ${colors.borderColor}`,
          backgroundColor: colors.cardBg,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: colors.cardBgAlt }}>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Timestamp
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Admin
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Action
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  IP Address
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center"
                    style={{ color: colors.textMuted }}
                  >
                    <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center"
                    style={{ color: colors.textMuted }}
                  >
                    No audit logs found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleLogClick(log)}
                    style={{
                      borderTop:
                        index !== 0
                          ? `1px solid ${colors.borderColor}`
                          : "none",
                      backgroundColor:
                        index % 2 === 0 ? colors.cardBg : colors.cardBgAlt,
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.textMuted }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: colors.text }}
                        >
                          {formatDateTime(log.timestamp)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          }}
                        >
                          {log.admin.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ color: colors.text }}>{log.admin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className="p-1 rounded-full mr-2"
                          style={{
                            backgroundColor: getSeverityBgColor(log.severity),
                            color: getSeverityColor(log.severity),
                          }}
                        >
                          {React.cloneElement(log.actionIcon, {
                            className: "w-4 h-4",
                          })}
                        </div>
                        <span style={{ color: colors.text }}>{log.action}</span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="inline-flex items-center px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogClick(log);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="px-6 py-3 flex items-center justify-between border-t"
            style={{ borderColor: colors.borderColor }}
          >
            <div className="text-sm" style={{ color: colors.textMuted }}>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of{" "}
              {filteredLogs.length} logs
            </div>
            <div className="flex space-x-1">
              <button
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor:
                    currentPage === 1 ? "transparent" : colors.inputBg,
                  color: currentPage === 1 ? colors.textMuted : colors.text,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  border: `1px solid ${colors.borderColor}`,
                }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className="w-8 h-8 flex items-center justify-center rounded text-sm"
                    style={{
                      backgroundColor:
                        currentPage === pageNum
                          ? colors.primary
                          : colors.inputBg,
                      color:
                        currentPage === pageNum
                          ? colors.lightText
                          : colors.text,
                      border: `1px solid ${
                        currentPage === pageNum
                          ? colors.primary
                          : colors.borderColor
                      }`,
                    }}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor:
                    currentPage === totalPages ? "transparent" : colors.inputBg,
                  color:
                    currentPage === totalPages ? colors.textMuted : colors.text,
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  border: `1px solid ${colors.borderColor}`,
                }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {showLogDetail && selectedLog && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowLogDetail(false)}
        >
          <div
            className="mx-4 max-w-2xl w-full rounded-lg shadow-lg"
            style={{ backgroundColor: colors.cardBg }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-between items-center p-4 border-b"
              style={{ borderColor: colors.borderColor }}
            >
              <h3
                className="text-lg font-medium"
                style={{ color: colors.primary }}
              >
                Audit Log Details
              </h3>
              <button
                className="p-1 rounded-full hover:opacity-80"
                style={{ color: colors.text }}
                onClick={() => setShowLogDetail(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Log header with action and severity */}
              <div className="flex items-center mb-6">
                <div
                  className="p-3 rounded-full mr-4"
                  style={{
                    backgroundColor: getSeverityBgColor(selectedLog.severity),
                    color: getSeverityColor(selectedLog.severity),
                  }}
                >
                  {React.cloneElement(selectedLog.actionIcon, {
                    className: "w-6 h-6",
                  })}
                </div>
                <div>
                  <h4
                    className="text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    {selectedLog.action}
                  </h4>
                  <div
                    className="px-2 py-0.5 text-xs rounded-full inline-flex items-center mt-1"
                    style={{
                      backgroundColor: getSeverityBgColor(selectedLog.severity),
                      color: getSeverityColor(selectedLog.severity),
                    }}
                  >
                    <span className="capitalize">{selectedLog.severity}</span>
                  </div>
                </div>
              </div>

              {/* Log details */}
              <div className="space-y-4">
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <div>
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.textMuted }}
                    >
                      Admin
                    </p>
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                        }}
                      >
                        {selectedLog.admin.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ color: colors.text }}>
                        {selectedLog.admin}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.textMuted }}
                    >
                      Admin ID
                    </p>
                    <p style={{ color: colors.text }}>{selectedLog.adminId}</p>
                  </div>

                  <div>
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.textMuted }}
                    >
                      Timestamp
                    </p>
                    <div className="flex items-center">
                      <Clock
                        className="w-4 h-4 mr-2"
                        style={{ color: colors.textMuted }}
                      />
                      <span style={{ color: colors.text }}>
                        {formatDateTime(selectedLog.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.textMuted }}
                    >
                      IP Address
                    </p>
                    <p style={{ color: colors.text }}>{selectedLog.ip}</p>
                  </div>
                </div>

                <div>
                  <p
                    className="text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Action Details
                  </p>
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <p style={{ color: colors.text }}>{selectedLog.details}</p>
                  </div>
                </div>

                <div>
                  <p
                    className="text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Additional Context
                  </p>
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span style={{ color: colors.textMuted }}>Browser</span>
                        <span style={{ color: colors.text }}>
                          Chrome 98.0.4758.102
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.textMuted }}>OS</span>
                        <span style={{ color: colors.text }}>Windows 11</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.textMuted }}>
                          Location
                        </span>
                        <span style={{ color: colors.text }}>
                          United States (approx.)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.textMuted }}>
                          Session ID
                        </span>
                        <span style={{ color: colors.text }}>
                          sess_8e2f4c1a9b3d7e6f
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex justify-end p-4 border-t"
              style={{ borderColor: colors.borderColor }}
            >
              <button
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
                onClick={() => setShowLogDetail(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
