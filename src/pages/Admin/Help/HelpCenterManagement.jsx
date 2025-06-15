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
  Edit,
  MessageSquareReply,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {useDispatch, useSelector} from "react-redux";
import { toast } from "react-toastify";
import { fetchHelpQueries, deleteHelpQuery } from "../../../store/admin/helpSlice";
import HelpQueryModal from "../../../components/modals/HelpQueryModal";
import ReplyHelpModal from "../../../components/modals/HelpMessageModal";

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const HelpCenterManagement = () => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpMessageModal, setHelpMessageModal] = useState(false);
  const [helpInfo, setHelpInfo] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
          dispatch(fetchHelpQueries({}));
      }, [dispatch]);
  const { helpQueries, loading } = useSelector((state) => state.help);
  // Items per page
  const itemsPerPage = 10;

  // Get unique fields for filter
//   const uniqueFields = helpQueries?.find(val=>val.name=="Super Admin")?.rights;
  // Apply filters
  const getFilteredData = () => {
    let data = helpQueries || [];

    // Apply search
    if (searchTerm) {
      data = data.filter(
        (rl) =>
          rl?.name.toLowerCase().includes(searchTerm.toLowerCase()) 
            ||
          rl?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      data = data.filter((rl) => rl.status === statusFilter);
    }

    // Apply field filter
    if (fieldFilter !== "all") {
      data = data.filter((cls) => cls?.rights?.includes(fieldFilter));
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
    dispatch(fetchHelpQueries({}));
  };
  const handleDeleteQuery = (id) => {
    if (window.confirm("Are you sure you want to delete this help query?")) {
      // setIsLoading(true);

      dispatch(deleteHelpQuery(id))
        .unwrap()
        .then(() => {
          toast.success("help query deleted successfully");
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
          Help Center Management
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          View and manage all help queries across the platform
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
            placeholder="Search help queries..."
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
          {/* <div className="relative">
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
          </div> */}

          {/* Field filter dropdown */}
          {/* <div className="relative">
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
          </div> */}
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
          {/* <button
            className="p-2 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
          >
            <Download className="w-4 h-4" />
          </button> */}
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
                  Sender's Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Subject
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Sender's Email
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Created
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
                    No Help Queries found matching your criteria
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
                          className="font-medium"
                          style={{ color: colors.text }}
                        >
                          {cls?.name??"-"}
                        </div>
                      </div>
                    </td>
                    <td
                       className="px-6 py-4 whitespace-nowrap text-sm"
                       style={{ color: colors.text }}
                     >
                        {cls?.subject??"-"}
                    </td>
                    <td
                       className="px-6 py-4 whitespace-nowrap text-sm"
                       style={{ color: colors.text }}
                     >
                        {cls?.email??"-"}
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
                        {formatDate(cls.createdAt??"")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex justify-start items-center space-x-2">
                        {cls.status === "replied" ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span style={{ color: colors.success }}>Replied</span>
                          </>
                        ) : (
                          <>
                            {/* <XCircle className="w-4 h-4 text-red-500" /> */}
                              <button
                                className="flex items-center px-2 py-1.5 rounded-lg text-sm cursor-pointer"
                                style={{
                                  backgroundColor: colors.primary,
                                  color: colors.lightText,
                                }}
                                onClick={() => {
                                  setHelpInfo(cls);
                                  setHelpMessageModal(true);
                                }}
                              >
                                <MessageSquareReply className="w-4 h-4 mr-2" />
                                Reply now
                              </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 rounded"
                          style={{ color: colors.primary }}
                          title="View Query"
                          onClick={() => {
                            setHelpInfo(cls);
                            setShowHelpModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* <button
                          className="p-1 rounded"
                          style={{
                            color:
                              cls.status === "active"
                                ? colors.textMuted
                                : colors.success,
                          }}
                          title={
                            cls.status === "active"
                              ? "Archive Role"
                              : "Restore Role"
                          }
                        >
                          <Archive className="w-4 h-4" />
                        </button> */}
                        {/* <button
                          className="p-1 rounded"
                          style={{ color: colors.accent }}
                          title="Edit Query"
                          onClick={() => {
                            setHelpInfo(cls);
                            setShowHelpModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button> */}
                        <button
                          className="p-1 rounded"
                          style={{ color: colors.error }}
                          title="Delete Query"
                          onClick={() => handleDeleteQuery(cls.id)}
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
              {filteredData.length} help queries
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
      <HelpQueryModal 
      showModal={showHelpModal} 
      setShowModal={setShowHelpModal} 
      query={helpInfo}/>
      <ReplyHelpModal
        showModal={helpMessageModal}
        setShowModal={setHelpMessageModal}
        query={helpInfo}
      />
    </div>
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

export default HelpCenterManagement;
