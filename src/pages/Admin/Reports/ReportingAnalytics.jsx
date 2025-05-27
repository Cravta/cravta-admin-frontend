import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  Download,
  Calendar,
  BarChart2,
  PieChart,
  LineChart,
  Clock,
  Users,
  Award,
  Brain,
  Eye,
  ChevronDown,
  FileText,
  Filter,
  FilePlus2,
  ArrowRight,
  ArrowDown,
  Check,
  Settings,
  BarChart,
  Layers,
  UserPlus,
  BookOpen,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

// Dummy data for reports
const reportsData = [
  {
    id: "report-1",
    name: "Monthly User Growth",
    description:
      "Overview of user acquisition and retention over the past month",
    lastGenerated: "2023-10-15T14:30:00",
    type: "standard",
    category: "users",
  },
  {
    id: "report-2",
    name: "Feature Engagement Summary",
    description: "Analysis of platform feature usage and engagement metrics",
    lastGenerated: "2023-10-10T09:15:00",
    type: "standard",
    category: "engagement",
  },
  {
    id: "report-3",
    name: "Content Creation Trends",
    description: "Patterns in material and quiz creation across the platform",
    lastGenerated: "2023-10-12T16:45:00",
    type: "standard",
    category: "content",
  },
  {
    id: "report-4",
    name: "AI Usage Report",
    description: "Detailed breakdown of AI feature utilization and performance",
    lastGenerated: "2023-10-14T11:20:00",
    type: "standard",
    category: "ai",
  },
  {
    id: "custom-1",
    name: "Teacher Activity Analysis",
    description: "Custom report analyzing teacher engagement patterns",
    lastGenerated: "2023-10-08T10:30:00",
    type: "custom",
    category: "users",
  },
  {
    id: "custom-2",
    name: "Student Performance Metrics",
    description: "Custom report on quiz performance and learning outcomes",
    lastGenerated: "2023-10-13T15:15:00",
    type: "custom",
    category: "performance",
  },
  {
    id: "custom-3",
    name: "Class Size Distribution",
    description: "Analysis of class sizes and enrollment patterns",
    lastGenerated: "2023-10-11T13:45:00",
    type: "custom",
    category: "classes",
  },
];

// Helper function to format date
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ReportingAnalytics = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get filtered reports
  const getFilteredReports = () => {
    let data = [...reportsData];

    // Apply search
    if (searchTerm) {
      data = data.filter(
        (report) =>
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      data = data.filter((report) => report.category === categoryFilter);
    }

    return data;
  };

  const filteredReports = getFilteredReports();

  // Get unique categories
  const categories = [...new Set(reportsData.map((report) => report.category))];

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle report generation
  const handleGenerateReport = (report) => {
    setSelectedReport(report);
    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // In a real app, you would fetch fresh data here
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "users":
        return <Users className="w-4 h-4" style={{ color: colors.primary }} />;
      case "engagement":
        return <Zap className="w-4 h-4" style={{ color: colors.accent }} />;
      case "content":
        return (
          <FileText className="w-4 h-4" style={{ color: colors.success }} />
        );
      case "ai":
        return (
          <Brain className="w-4 h-4" style={{ color: colors.secondary }} />
        );
      case "performance":
        return <Award className="w-4 h-4" style={{ color: colors.warning }} />;
      case "classes":
        return <BookOpen className="w-4 h-4" style={{ color: colors.error }} />;
      default:
        return <BarChart className="w-4 h-4" style={{ color: colors.text }} />;
    }
  };

  return (
    <div className="p-6 overflow-auto">
      <div className="mb-6">
        <h2
          className="text-xl font-medium mb-2"
          style={{ color: colors.primary }}
        >
          Reports & Analytics
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Generate insights and create custom reports on platform usage
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b mb-6"
        style={{ borderColor: colors.borderColor }}
      >
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "overview" ? "" : ""
          }`}
          style={{
            color: activeTab === "overview" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "overview" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("overview")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "reports" ? "" : ""
          }`}
          style={{
            color: activeTab === "reports" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "reports" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "builder" ? "" : ""
          }`}
          style={{
            color: activeTab === "builder" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "builder" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("builder")}
        >
          Report Builder
        </button>
      </div>

      {/* Dashboard Overview */}
      {activeTab === "overview" && (
        <>
          {/* Time Range Selector */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium" style={{ color: colors.text }}>
              Analytics Dashboard
            </h3>
            <div
              className="inline-flex rounded-md shadow-sm"
              role="group"
              style={{ backgroundColor: colors.cardBg }}
            >
              {["7days", "30days", "90days", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className="px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor:
                      timeRange === period ? colors.primary : "transparent",
                    color:
                      timeRange === period ? colors.lightText : colors.text,
                    borderRadius: timeRange === period ? "0.375rem" : "0",
                  }}
                >
                  {period === "7days"
                    ? "Last 7 Days"
                    : period === "30days"
                    ? "Last 30 Days"
                    : period === "90days"
                    ? "Last Quarter"
                    : "This Year"}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Users Card */}
            <div
              className="p-5 rounded-lg"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4
                  className="text-sm font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Total Users
                </h4>
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <Users
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    2,543
                  </div>
                  <div
                    className="flex items-center text-xs"
                    style={{ color: colors.success }}
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    <span>+12% from previous period</span>
                  </div>
                </div>
                <div className="w-16 h-8 flex items-end">
                  {/* Placeholder for mini chart */}
                  <div
                    className="w-1 h-3 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <div
                    className="w-1 h-5 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <div
                    className="w-1 h-4 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <div
                    className="w-1 h-6 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <div
                    className="w-1 h-7 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <div
                    className="w-1 h-8 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active Users Card */}
            <div
              className="p-5 rounded-lg"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4
                  className="text-sm font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Active Users
                </h4>
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${colors.accent}20` }}
                >
                  <Zap className="w-4 h-4" style={{ color: colors.accent }} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    1,842
                  </div>
                  <div
                    className="flex items-center text-xs"
                    style={{ color: colors.success }}
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    <span>+5% from previous period</span>
                  </div>
                </div>
                <div className="w-16 h-8 flex items-end">
                  {/* Placeholder for mini chart */}
                  <div
                    className="w-1 h-4 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <div
                    className="w-1 h-5 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <div
                    className="w-1 h-6 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <div
                    className="w-1 h-5 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <div
                    className="w-1 h-7 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <div
                    className="w-1 h-8 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quizzes Card */}
            <div
              className="p-5 rounded-lg"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4
                  className="text-sm font-medium"
                  style={{ color: colors.textMuted }}
                >
                  Total Quizzes
                </h4>
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${colors.secondary}20` }}
                >
                  <Award
                    className="w-4 h-4"
                    style={{ color: colors.secondary }}
                  />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    1,247
                  </div>
                  <div
                    className="flex items-center text-xs"
                    style={{ color: colors.success }}
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    <span>+22% from previous period</span>
                  </div>
                </div>
                <div className="w-16 h-8 flex items-end">
                  {/* Placeholder for mini chart */}
                  <div
                    className="w-1 h-3 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.secondary }}
                  ></div>
                  <div
                    className="w-1 h-4 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.secondary }}
                  ></div>
                  <div
                    className="w-1 h-6 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.secondary }}
                  ></div>
                  <div
                    className="w-1 h-5 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.secondary }}
                  ></div>
                  <div
                    className="w-1 h-6 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.secondary }}
                  ></div>
                  <div
                    className="w-1 h-8 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.secondary }}
                  ></div>
                </div>
              </div>
            </div>

            {/* AI Usage Card */}
            <div
              className="p-5 rounded-lg"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4
                  className="text-sm font-medium"
                  style={{ color: colors.textMuted }}
                >
                  AI Feature Usage
                </h4>
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${colors.success}20` }}
                >
                  <Brain
                    className="w-4 h-4"
                    style={{ color: colors.success }}
                  />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    4,872
                  </div>
                  <div
                    className="flex items-center text-xs"
                    style={{ color: colors.success }}
                  >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    <span>+31% from previous period</span>
                  </div>
                </div>
                <div className="w-16 h-8 flex items-end">
                  {/* Placeholder for mini chart */}
                  <div
                    className="w-1 h-3 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.success }}
                  ></div>
                  <div
                    className="w-1 h-4 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.success }}
                  ></div>
                  <div
                    className="w-1 h-5 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.success }}
                  ></div>
                  <div
                    className="w-1 h-6 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.success }}
                  ></div>
                  <div
                    className="w-1 h-7 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.success }}
                  ></div>
                  <div
                    className="w-1 h-8 mx-0.5 rounded-t"
                    style={{ backgroundColor: colors.success }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* User Engagement Chart */}
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  User Engagement
                </h3>
                <div className="flex space-x-2">
                  <button
                    className="p-1 rounded-md"
                    style={{ color: colors.text }}
                  >
                    <BarChart2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 rounded-md"
                    style={{
                      color: colors.text,
                      backgroundColor: `${colors.primary}20`,
                    }}
                  >
                    <LineChart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chart would go here */}
              <div className="h-80 w-full">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ color: colors.textMuted }}
                >
                  <div className="text-center">
                    <LineChart className="w-10 h-10 mx-auto mb-3 opacity-60" />
                    <p>User Engagement Visualization</p>
                    <p className="text-xs mt-1">
                      Showing data for selected period
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-2">
                <div className="flex items-center mr-4">
                  <div
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    Teachers
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    Students
                  </span>
                </div>
              </div>
            </div>

            {/* Content Distribution Chart */}
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  Content Distribution
                </h3>
                <div className="flex space-x-2">
                  <button
                    className="p-1 rounded-md"
                    style={{ color: colors.text }}
                  >
                    <BarChart2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 rounded-md"
                    style={{
                      color: colors.text,
                      backgroundColor: `${colors.primary}20`,
                    }}
                  >
                    <PieChart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chart would go here */}
              <div className="h-80 w-full">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ color: colors.textMuted }}
                >
                  <div className="text-center">
                    <PieChart className="w-10 h-10 mx-auto mb-3 opacity-60" />
                    <p>Content Distribution Visualization</p>
                    <p className="text-xs mt-1">
                      Showing data for selected period
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center mt-2">
                <div className="flex items-center mr-4 mb-2">
                  <div
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    Quizzes
                  </span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <div
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    Documents
                  </span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <div
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: colors.secondary }}
                  ></div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    Images
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <div
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: colors.success }}
                  ></div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    Other
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reports */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-medium"
                style={{ color: colors.text }}
              >
                Quick Reports
              </h3>
              <button
                className="px-3 py-1 rounded text-sm font-medium"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                }}
                onClick={() => setActiveTab("reports")}
              >
                View All Reports
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportsData.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getCategoryIcon(report.category)}
                      <h4
                        className="ml-2 font-medium"
                        style={{ color: colors.text }}
                      >
                        {report.name}
                      </h4>
                    </div>
                    <button
                      className="p-1 rounded"
                      style={{ color: colors.primary }}
                      onClick={() => handleGenerateReport(report)}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <p
                    className="text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    {report.description}
                  </p>
                  <div
                    className="flex items-center text-xs"
                    style={{ color: colors.textMuted }}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Last generated: {formatDate(report.lastGenerated)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Reports List */}
      {activeTab === "reports" && (
        <>
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
                placeholder="Search reports..."
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
              {/* Category filter dropdown */}
              <div className="relative">
                <button
                  className="flex items-center px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      categoryFilter !== "all"
                        ? `${colors.primary}20`
                        : colors.inputBg,
                    color:
                      categoryFilter !== "all" ? colors.primary : colors.text,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span>
                    {categoryFilter === "all"
                      ? "All Categories"
                      : categoryFilter.charAt(0).toUpperCase() +
                        categoryFilter.slice(1)}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {showCategoryDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 overflow-hidden"
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
                            categoryFilter === "all"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setCategoryFilter("all");
                          setShowCategoryDropdown(false);
                        }}
                      >
                        All Categories
                      </button>

                      {categories.map((category) => (
                        <button
                          key={category}
                          className="w-full text-left px-4 py-2 text-sm flex items-center"
                          style={{
                            backgroundColor:
                              categoryFilter === category
                                ? `${colors.primary}20`
                                : "transparent",
                            color: colors.text,
                          }}
                          onClick={() => {
                            setCategoryFilter(category);
                            setShowCategoryDropdown(false);
                          }}
                        >
                          {getCategoryIcon(category)}
                          <span className="ml-2">
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </span>
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
                onClick={handleRefresh}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>

              {/* Create Report button */}
              <button
                className="flex items-center px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.lightText,
                }}
                onClick={() => setActiveTab("builder")}
              >
                <FilePlus2 className="w-4 h-4 mr-2" />
                Create Report
              </button>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div
                className="col-span-full flex justify-center items-center py-10"
                style={{ color: colors.textMuted }}
              >
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div
                className="col-span-full text-center py-10"
                style={{ color: colors.textMuted }}
              >
                No reports found matching your criteria
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 rounded-lg"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <div className="flex items-center mb-3">
                    <div
                      className="p-2 rounded-lg mr-3"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      {getCategoryIcon(report.category)}
                    </div>
                    <div>
                      <h4
                        className="font-medium"
                        style={{ color: colors.text }}
                      >
                        {report.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        <span
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor:
                              report.type === "standard"
                                ? `${colors.primary}20`
                                : `${colors.accent}20`,
                            color:
                              report.type === "standard"
                                ? colors.primary
                                : colors.accent,
                          }}
                        >
                          {report.type === "standard" ? "Standard" : "Custom"}
                        </span>
                        <span
                          className="ml-2 text-xs flex items-center"
                          style={{ color: colors.textMuted }}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Last: {formatDate(report.lastGenerated)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p
                    className="text-sm mb-4"
                    style={{ color: colors.textMuted }}
                  >
                    {report.description}
                  </p>

                  <div className="flex justify-between">
                    <button
                      className="flex items-center px-3 py-1.5 rounded text-sm"
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        border: `1px solid ${colors.borderColor}`,
                      }}
                      onClick={() => {}}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </button>

                    <button
                      className="flex items-center px-3 py-1.5 rounded text-sm"
                      style={{
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary,
                      }}
                      onClick={() => handleGenerateReport(report)}
                      disabled={
                        isGenerating && selectedReport?.id === report.id
                      }
                    >
                      {isGenerating && selectedReport?.id === report.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Report Builder */}
      {activeTab === "builder" && (
        <>
          <div
            className="p-6 rounded-lg mb-6"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
            }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: colors.text }}
            >
              Custom Report Builder
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Report Configuration */}
              <div>
                <div className="mb-4">
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Report Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter report name"
                    className="w-full p-2 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Enter report description"
                    className="w-full p-2 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Category
                  </label>
                  <select
                    className="w-full p-2 rounded-lg appearance-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 10px center",
                      paddingRight: "30px",
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Date Range
                  </label>
                  <div className="flex space-x-3">
                    <select
                      className="flex-1 p-2 rounded-lg appearance-none"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 10px center",
                        paddingRight: "30px",
                      }}
                    >
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last Quarter</option>
                      <option value="year">Last Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column - Metrics Selection */}
              <div>
                <div className="mb-4">
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Select Metrics
                  </label>

                  <div
                    className="p-3 rounded-lg space-y-2 max-h-60 overflow-y-auto"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    {/* User Metrics */}
                    <div
                      className="p-2 rounded"
                      style={{ backgroundColor: `${colors.primary}10` }}
                    >
                      <div className="flex items-center mb-2">
                        <Users
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.primary }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: colors.text }}
                        >
                          User Metrics
                        </span>
                      </div>

                      <div className="ml-6 space-y-1">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-total-users"
                            className="mr-2"
                            checked
                          />
                          <label
                            htmlFor="metric-total-users"
                            style={{ color: colors.text }}
                          >
                            Total Users
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-new-signups"
                            className="mr-2"
                            checked
                          />
                          <label
                            htmlFor="metric-new-signups"
                            style={{ color: colors.text }}
                          >
                            New Signups
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-active-users"
                            className="mr-2"
                            checked
                          />
                          <label
                            htmlFor="metric-active-users"
                            style={{ color: colors.text }}
                          >
                            Active Users
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-user-retention"
                            className="mr-2"
                          />
                          <label
                            htmlFor="metric-user-retention"
                            style={{ color: colors.text }}
                          >
                            User Retention
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Content Metrics */}
                    <div
                      className="p-2 rounded"
                      style={{ backgroundColor: `${colors.secondary}10` }}
                    >
                      <div className="flex items-center mb-2">
                        <FileText
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.secondary }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: colors.text }}
                        >
                          Content Metrics
                        </span>
                      </div>

                      <div className="ml-6 space-y-1">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-total-materials"
                            className="mr-2"
                            checked
                          />
                          <label
                            htmlFor="metric-total-materials"
                            style={{ color: colors.text }}
                          >
                            Total Materials
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-total-quizzes"
                            className="mr-2"
                            checked
                          />
                          <label
                            htmlFor="metric-total-quizzes"
                            style={{ color: colors.text }}
                          >
                            Total Quizzes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-quiz-participation"
                            className="mr-2"
                          />
                          <label
                            htmlFor="metric-quiz-participation"
                            style={{ color: colors.text }}
                          >
                            Quiz Participation
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-quiz-performance"
                            className="mr-2"
                          />
                          <label
                            htmlFor="metric-quiz-performance"
                            style={{ color: colors.text }}
                          >
                            Quiz Performance
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* AI Metrics */}
                    <div
                      className="p-2 rounded"
                      style={{ backgroundColor: `${colors.accent}10` }}
                    >
                      <div className="flex items-center mb-2">
                        <Brain
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.accent }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: colors.text }}
                        >
                          AI Metrics
                        </span>
                      </div>

                      <div className="ml-6 space-y-1">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-ai-quiz-gen"
                            className="mr-2"
                            checked
                          />
                          <label
                            htmlFor="metric-ai-quiz-gen"
                            style={{ color: colors.text }}
                          >
                            AI Quiz Generations
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-ai-flashcard-gen"
                            className="mr-2"
                          />
                          <label
                            htmlFor="metric-ai-flashcard-gen"
                            style={{ color: colors.text }}
                          >
                            AI Flashcard Generations
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-ai-success-rate"
                            className="mr-2"
                          />
                          <label
                            htmlFor="metric-ai-success-rate"
                            style={{ color: colors.text }}
                          >
                            AI Success Rate
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="metric-ai-usage-trends"
                            className="mr-2"
                          />
                          <label
                            htmlFor="metric-ai-usage-trends"
                            style={{ color: colors.text }}
                          >
                            AI Usage Trends
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Report Format
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      className="p-2 rounded-lg flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: `${colors.primary}20`,
                        border: `2px solid ${colors.primary}`,
                        color: colors.text,
                      }}
                    >
                      <FileText
                        className="w-5 h-5 mb-1"
                        style={{ color: colors.primary }}
                      />
                      <span className="text-xs">PDF</span>
                    </button>
                    <button
                      className="p-2 rounded-lg flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                    >
                      <BarChart
                        className="w-5 h-5 mb-1"
                        style={{ color: colors.text }}
                      />
                      <span className="text-xs">Excel</span>
                    </button>
                    <button
                      className="p-2 rounded-lg flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                    >
                      <Layers
                        className="w-5 h-5 mb-1"
                        style={{ color: colors.text }}
                      />
                      <span className="text-xs">CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="mt-6 pt-6 border-t flex justify-end"
              style={{ borderColor: colors.borderColor }}
            >
              <button
                className="px-4 py-2 rounded-lg text-sm mr-3"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
                onClick={() => setActiveTab("reports")}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.lightText,
                }}
              >
                Create Report
              </button>
            </div>
          </div>

          {/* Report Preview */}
          <div
            className="p-6 rounded-lg border border-dashed"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-lg font-medium"
                style={{ color: colors.text }}
              >
                Report Preview
              </h3>
              <div className="flex space-x-2">
                <button className="p-1 rounded" style={{ color: colors.text }}>
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded"
                  style={{ color: colors.primary }}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="flex items-center justify-center p-10 rounded"
              style={{
                backgroundColor: `${colors.inputBg}80`,
                borderRadius: "8px",
                minHeight: "200px",
              }}
            >
              <div className="text-center">
                <BarChart2
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: colors.textMuted }}
                />
                <p style={{ color: colors.textMuted }}>
                  Report preview will appear here
                </p>
                <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
                  Add metrics and configure report settings to see a preview
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportingAnalytics;
