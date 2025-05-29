import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Mail,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {useDispatch, useSelector} from "react-redux";
import { deleteUserbyAdmin, fetchUsersAdmin } from "../../../store/admin/usersSlice";
import { toast } from "react-toastify";


// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const UserManagement = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("teachers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
        dispatch(fetchUsersAdmin({}));
    }, [dispatch]);
  const { usersList, loading } = useSelector((state) => state.adminUsers);
  // Items per page
  const itemsPerPage = 10;

  // Get data based on active tab
  const getData = () => {
    let data;

    switch (activeTab) {
      case "teachers":
        data = usersList?.filter((user) => user.user_type === "teacher");
        break;
      case "students":
        data = usersList?.filter((user) => user.user_type === "student");
        break;
      case "admins":
        data = usersList?.filter((user) => user.user_type === "administrator");
        break;
      default:
        data = [];
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(
        (item) =>
          item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      data = data.filter((item) => item.status === statusFilter);
    }

    return data;
  };

  const filteredData = getData();

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
    setShowStatusDropdown(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchUsersAdmin({}));
  };
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // setIsLoading(true);

      dispatch(deleteUserbyAdmin(userId))
        .unwrap()
        .then(() => {
          toast.success("User deleted successfully");
        })
        .catch((error) => {
          toast.error(
            `Failed to delete User: ${error || "Unknown error"}`
          );
        });
    }
  }
  return (
    <div className="p-6 overflow-auto">
      <div className="mb-6">
        <h2
          className="text-xl font-medium mb-2"
          style={{ color: colors.primary }}
        >
          User Management
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          View, edit and manage all users on the platform
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b mb-6"
        style={{ borderColor: colors.borderColor }}
      >
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "teachers" ? "" : ""
          }`}
          style={{
            color: activeTab === "teachers" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "teachers" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("teachers")}
        >
          Teachers
        </button>
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "students" ? "" : ""
          }`}
          style={{
            color: activeTab === "students" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "students" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("students")}
        >
          Students
        </button>
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "admins" ? "" : ""
          }`}
          style={{
            color: activeTab === "admins" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "admins" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("admins")}
        >
          Administrators
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Left side: Search bar */}
        <div className="relative w-full md:w-auto md:flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: colors.textMuted }}
          />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
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

        {/* Right side: Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Filter dropdown */}
          <div className="relative">
            <button
              className="flex items-center px-3 py-2 rounded-lg"
              style={{
                backgroundColor:
                  statusFilter !== "all"
                    ? `${colors.primary}20`
                    : colors.inputBg,
                color: statusFilter !== "all" ? colors.primary : colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Filter className="w-4 h-4 mr-2" />
              <span>
                {statusFilter === "all"
                  ? "All Status"
                  : statusFilter === "active"
                  ? "Active"
                  : "Inactive"}
              </span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {showStatusDropdown && (
              <div
                className="absolute right-0 mt-2 w-40 rounded-md shadow-lg z-10 overflow-hidden"
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
                        statusFilter === "all"
                          ? `${colors.primary}20`
                          : "transparent",
                      color: colors.text,
                    }}
                    onClick={() => handleStatusFilter("all")}
                  >
                    All Status
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{
                      backgroundColor:
                        statusFilter === "active"
                          ? `${colors.primary}20`
                          : "transparent",
                      color: colors.text,
                    }}
                    onClick={() => handleStatusFilter("active")}
                  >
                    Active
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{
                      backgroundColor:
                        statusFilter === "inactive"
                          ? `${colors.primary}20`
                          : "transparent",
                      color: colors.text,
                    }}
                    onClick={() => handleStatusFilter("inactive")}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Refresh button */}
          <button
            className="p-2 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
            disabled={loading}
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
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
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Add new user button */}
          <button
            className="flex items-center px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: colors.primary,
              color: colors.lightText,
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New{" "}
            {activeTab === "teachers"
              ? "Teacher"
              : activeTab === "students"
              ? "Student"
              : "Admin"}
          </button>
        </div>
      </div>

      {/* User Table */}
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
                  Name / Email
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Signup Date
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Last Active
                </th>
                {activeTab !== "admins" ? (
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Classes
                  </th>
                ) : (
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Role
                  </th>
                )}
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center"
                    style={{ color: colors.textMuted }}
                  >
                    <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                  </td>
                </tr>
              ) : paginatedData?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center"
                    style={{ color: colors.textMuted }}
                  >
                    No {activeTab} found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedData.map((user, index) => (
                  <tr
                    key={user?.id}
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
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                          style={{
                            background:
                              activeTab === "admins"
                                ? `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`
                                : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          }}
                        >
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div
                            className="font-medium"
                            style={{ color: colors.text }}
                          >
                            {user?.name || "-"}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: colors.textMuted }}
                          >
                            {user.email_address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      {formatDate(user?.createdAt)}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      {user.updatedAt?formatDate(user.updatedAt ):"-"}
                    </td>
                    {activeTab !== "admins" ? (
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        style={{ color: colors.text }}
                      >
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${colors.primary}20`,
                            color: colors.primary,
                          }}
                        >
                          {user?.classCount||"-"}
                        </span>
                      </td>
                    ) : (
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        style={{ color: colors.text }}
                      >
                        <span
                          className="px-2 py-1 text-xs rounded-full flex items-center w-min"
                          style={{
                            backgroundColor:
                              user.role === "Super Admin"
                                ? `${colors.accent}20`
                                : `${colors.primary}20`,
                            color:
                              user.role === "Super Admin"
                                ? colors.accent
                                : colors.primary,
                          }}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {user.user_type}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs rounded-full flex items-center w-min"
                        style={{
                          backgroundColor:
                            user.status === "active"
                              ? `${colors.success}20`
                              : `${colors.error}20`,
                          color:
                            user.status === "active"
                              ? colors.success
                              : colors.error,
                        }}
                      >
                        {user.status === "active" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 rounded"
                          style={{ color: colors.primary }}
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 rounded"
                          style={{ color: colors.accent }}
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 rounded"
                          style={{ color: colors.text }}
                          title="Email User"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 rounded"
                          style={{ color: colors.error }}
                          title="Delete User"
                          onClick={() => handleDeleteUser(user?.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
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
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
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
    </div>
  );
};

export default UserManagement;
