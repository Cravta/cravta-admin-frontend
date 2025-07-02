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
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {useDispatch, useSelector} from "react-redux";
import { toast } from "react-toastify";
import { fetchPackageTransactions } from "../../../store/admin/packageSlice";

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const PackagePurchases = () => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
          dispatch(fetchPackageTransactions({}));
      }, [dispatch]);
  const { transactionList, transactionLoading } = useSelector((state) => state.package);
  console.log(transactionList);
  // Items per page
  const itemsPerPage = 10;

  // Get unique fields for filter
  const uniqueFields = Array.from(new Set(transactionList?.map((val) => val?.package?.name))).filter(Boolean);
  // Apply filters
  const getFilteredData = () => {
    let data = transactionList || [];

    // Apply search
    if (searchTerm) {
      data = data.filter(
        (rl) =>
          rl?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) 
            ||
          rl?.package?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      data = data.filter((rl) => rl.status === statusFilter);
    }

    // Apply field filter
    if (fieldFilter !== "all") {
      data = data.filter((cls) => cls?.package?.name === fieldFilter);
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
    dispatch(fetchPackageTransactions({}));
  };
  return (
    <div className="p-6 overflow-auto">
      <div className="mb-6">
        <h2
          className="text-xl font-medium mb-2"
          style={{ color: colors.primary }}
        >
          Package Purchases
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          View and manage all package purchases
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
            placeholder="Search purchases..."
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
              <span>{fieldFilter === "all" ? "All Packages" : fieldFilter}</span>
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
                    All Packages
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
            disabled={transactionLoading}
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`w-4 h-4 ${transactionLoading ? "animate-spin" : ""}`}
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
                  Name / Email
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  User Type
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Package Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Package Type
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Purchased At
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Sparks
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  Amount (SAR)
                </th>
              </tr>
            </thead>
            <tbody>
              {transactionLoading ? (
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
                    No packages found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedData?.map((trnsct, index) => (
                  <tr
                    key={trnsct.id}
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
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                          style={{
                            background:`linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                          }}
                        >
                          {trnsct?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div
                            className="font-medium"
                            style={{ color: colors.text }}
                          >
                            {trnsct?.user?.name || "-"}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: colors.textMuted }}
                          >
                            {trnsct?.user?.email_address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      {trnsct?.user?.user_type}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      {trnsct?.package?.name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text }}
                    >
                      {trnsct?.package?.package_type}
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
                        {formatDate(trnsct?.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                      {trnsct?.spark_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                      {trnsct?.amount}
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
              {filteredData.length} purchases
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

export default PackagePurchases;
