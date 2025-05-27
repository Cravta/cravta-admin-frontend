import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Users,
  Eye,
  Archive,
  Trash,
  Download,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {useDispatch, useSelector} from "react-redux";
import { deleteClassbyAdmin, fetchClassesAdmin } from "../../../store/admin/classesSlice";
import { toast } from "react-toastify";
// Dummy data for classes
const classesData = Array(30)
  .fill()
  .map((_, i) => ({
    id: `c-${i + 1}`,
    name: `Class ${i + 1}: ${
      [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
        "History",
        "Geography",
        "Literature",
        "Art",
      ][i % 9]
    }`,
    teacherName: `Teacher ${Math.floor(Math.random() * 10) + 1}`,
    teacherId: `t-${Math.floor(Math.random() * 10) + 1}`,
    creationDate: new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toISOString(),
    lastActivity: new Date(
      2023,
      Math.floor(Math.random() * 3) + 9,
      Math.floor(Math.random() * 28) + 1
    ).toISOString(),
    studentCount: Math.floor(Math.random() * 40) + 5,
    status: Math.random() > 0.1 ? "active" : "archived",
    field: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science",
      "History",
      "Geography",
      "Literature",
      "Art",
    ][i % 9],
  }));

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ClassManagement = () => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
          dispatch(fetchClassesAdmin({}));
      }, [dispatch]);
  const { classList, loading } = useSelector((state) => state.adminClasses);
  // Items per page
  const itemsPerPage = 10;

  // Get unique fields for filter
  const uniqueFields = [...new Set(classList?.map((c) => c.course_field))];

  // Apply filters
  const getFilteredData = () => {
    let data = classList || [];

    // Apply search
    if (searchTerm) {
      data = data.filter(
        (cls) =>
          cls?.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls?.course_field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      data = data.filter((cls) => cls.status === statusFilter);
    }

    // Apply field filter
    if (fieldFilter !== "all") {
      data = data.filter((cls) => cls?.course_field == fieldFilter);
    }

    return data;
  };

  const filteredData = getFilteredData();

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
    setCurrentPage(1);
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchClassesAdmin({}));
  };
  const handleDeleteClass = (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      // setIsLoading(true);

      dispatch(deleteClassbyAdmin(classId))
        .unwrap()
        .then(() => {
          toast.success("Class deleted successfully");
        })
        .catch((error) => {
          toast.error(
            `Failed to delete Class: ${error || "Unknown error"}`
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
          Class Management
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          View and manage all classes across the platform
        </p>
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
            placeholder="Search classes or teachers..."
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
          {/* Status filter */}
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
                  : "Archived"}
              </span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {showStatusDropdown && (
              <div
                className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-10 overflow-hidden"
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
                    onClick={() => {
                      setStatusFilter("all");
                      setShowStatusDropdown(false);
                    }}
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
                    onClick={() => {
                      setStatusFilter("active");
                      setShowStatusDropdown(false);
                    }}
                  >
                    Active
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{
                      backgroundColor:
                        statusFilter === "archived"
                          ? `${colors.primary}20`
                          : "transparent",
                      color: colors.text,
                    }}
                    onClick={() => {
                      setStatusFilter("archived");
                      setShowStatusDropdown(false);
                    }}
                  >
                    Archived
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Field filter dropdown */}
          <div className="relative">
            <button
              className="flex items-center px-3 py-2 rounded-lg"
              style={{
                backgroundColor:
                  fieldFilter !== "all"
                    ? `${colors.primary}20`
                    : colors.inputBg,
                color: fieldFilter !== "all" ? colors.primary : colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => setShowFieldDropdown(!showFieldDropdown)}
            >
              <span>{fieldFilter === "all" ? "All Fields" : fieldFilter}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {showFieldDropdown && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto"
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
                        fieldFilter === "all"
                          ? `${colors.primary}20`
                          : "transparent",
                      color: colors.text,
                    }}
                    onClick={() => {
                      setFieldFilter("all");
                      setShowFieldDropdown(false);
                    }}
                  >
                    All Fields
                  </button>

                  {uniqueFields.map((field) => (
                    <button
                      key={field}
                      className="w-full text-left px-4 py-2 text-sm"
                      style={{
                        backgroundColor:
                          fieldFilter === field
                            ? `${colors.primary}20`
                            : "transparent",
                        color: colors.text,
                      }}
                      onClick={() => {
                        setFieldFilter(field);
                        setShowFieldDropdown(false);
                      }}
                    >
                      {field}
                    </button>
                  ))}
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
        </div>
      </div>

      {/* Class Table */}
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
                  Class Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Teacher
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Creation Date
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Last Activity
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Students
                </th>
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
                    colSpan="7"
                    className="px-6 py-4 text-center"
                    style={{ color: colors.textMuted }}
                  >
                    <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center"
                    style={{ color: colors.textMuted }}
                  >
                    No classes found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedData?.map((cls, index) => (
                  <tr
                    key={cls.id}
                    style={{
                      borderTop:
                        index !== 0
                          ? `1px solid ${colors.borderColor}`
                          : "none",
                      backgroundColor:
                        index % 2 === 0 ? colors.cardBg : colors.cardBgAlt,
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 px-2 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3"
                          style={{
                            background: cls?.theme?.colour || getSubjectGradient(cls?.course_field),
                          }}
                        >
                          {cls.icon? cls.icon :getSubjectIcon(cls.course_field)}
                        </div>
                        <div
                          className="font-medium"
                          style={{ color: colors.text }}
                        >
                          {cls.name || cls.course_name}
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      {cls.teacherName || cls.course_field}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      <div className="flex items-center">
                        <Calendar
                          className="w-3 h-3 mr-1"
                          style={{ color: colors.textMuted }}
                        />
                        {formatDate(cls.creationDate??cls.createdAt)}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      <div className="flex items-center">
                        <Calendar
                          className="w-3 h-3 mr-1"
                          style={{ color: colors.textMuted }}
                        />
                        {formatDate(cls.lastActivity??cls.updatedAt)}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: colors.text }}
                    >
                      <div className="flex items-center">
                        <Users
                          className="w-3 h-3 mr-1"
                          style={{ color: colors.textMuted }}
                        />
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${colors.primary}20`,
                            color: colors.primary,
                          }}
                        >
                          {cls.studentCount||0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs rounded-full flex items-center w-min"
                        style={{
                          backgroundColor:
                            cls.status === "active"
                              ? `${colors.success}20`
                              : `${colors.textMuted}40`,
                          color:
                            cls.status === "active"
                              ? colors.success
                              : colors.textMuted,
                        }}
                      >
                        {cls.status === "active" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Archive className="w-3 h-3 mr-1" />
                        )}
                        {cls.status === "active" ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 rounded"
                          style={{ color: colors.primary }}
                          title="View Class"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 rounded"
                          style={{
                            color:
                              cls.status === "active"
                                ? colors.textMuted
                                : colors.success,
                          }}
                          title={
                            cls.status === "active"
                              ? "Archive Class"
                              : "Restore Class"
                          }
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 rounded"
                          style={{ color: colors.error }}
                          title="Delete Class"
                          onClick={() => handleDeleteClass(cls.id)}
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
              {filteredData.length} classes
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

// Helper function to get subject gradients
const getSubjectGradient = (subject) => {
  const gradients = {
    Mathematics: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    Physics: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    Chemistry: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)",
    Biology: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
    "Computer Science": "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
    History: "linear-gradient(135deg, #ff8a00 0%, #e52e71 100%)",
    Geography: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    Literature: "linear-gradient(135deg, #603813 0%, #b29f94 100%)",
    Art: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
  };

  return (
    gradients[subject] || "linear-gradient(135deg, #434343 0%, #000000 100%)"
  );
};

// Helper function to get subject icons
const getSubjectIcon = (subject) => {
  const icons = {
    Mathematics: "🧮",
    Physics: "🔬",
    Chemistry: "⚗️",
    Biology: "🧪",
    "Computer Science": "💻",
    History: "🏛️",
    Geography: "🌍",
    Literature: "📚",
    Art: "🎨",
  };

  return icons[subject] || "📚";
};

export default ClassManagement;
