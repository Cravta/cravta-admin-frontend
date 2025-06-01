import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  ChevronDown,
  FileText,
  Upload,
  Award,
  Brain,
  BarChart2,
  Calendar,
  Database,
  HardDrive,
  Eye,
  Flag,
  Trash,
  MoreHorizontal,
  FileQuestion,
  Clock,
  CheckCircle,
  Image,
  Video,
  File,
  PieChart,
  LineChart,
  AlertTriangle,
  DownloadCloud,
  Users,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {useDispatch, useSelector} from "react-redux";
import { deleteContentbyAdmin, fetchContentAdmin } from "../../../store/admin/contentSlice";
import { deleteQuizbyAdmin, fetchQuizzesAdmin } from "../../../store/admin/quizSlice";
import ContentModal from "../../../components/modals/ContentModal";
import { toast } from "react-toastify";
import CreateQuizModal from "../../../components/modals/CreateQuizModal";
// Dummy data for materials
const materialsData = Array(30)
  .fill()
  .map((_, i) => ({
    id: `m-${i + 1}`,
    name: `Study Material ${i + 1}${
      i % 5 === 0
        ? ".pdf"
        : i % 4 === 0
        ? ".pptx"
        : i % 3 === 0
        ? ".jpg"
        : ".docx"
    }`,
    type:
      i % 5 === 0
        ? "pdf"
        : i % 4 === 0
        ? "presentation"
        : i % 3 === 0
        ? "image"
        : "document",
    uploadedBy: `${Math.random() > 0.7 ? "Student" : "Teacher"} ${
      Math.floor(Math.random() * 20) + 1
    }`,
    uploadDate: new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toISOString(),
    size: `${Math.floor(Math.random() * 10) + 1}${
      Math.random() > 0.5 ? " MB" : " KB"
    }`,
    class: `Class ${Math.floor(Math.random() * 10) + 1}`,
    visibility: Math.random() > 0.2 ? "class" : "personal",
    downloads: Math.floor(Math.random() * 100),
  }));

// Dummy data for quizzes
const quizzesData = Array(25)
  .fill()
  .map((_, i) => ({
    id: `q-${i + 1}`,
    title: `Quiz ${i + 1}: ${
      ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"][
        i % 5
      ]
    }`,
    createdBy: `${Math.random() > 0.3 ? "Teacher" : "Student"} ${
      Math.floor(Math.random() * 10) + 1
    }`,
    creationDate: new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toISOString(),
    type:
      Math.random() > 0.7
        ? "AI Generated"
        : Math.random() > 0.5
        ? "Template"
        : "Manual",
    questions: Math.floor(Math.random() * 15) + 5,
    participants: Math.floor(Math.random() * 40),
    class: `Class ${Math.floor(Math.random() * 10) + 1}`,
    averageScore: Math.floor(Math.random() * 40) + 60,
  }));

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ContentMonitoring = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("materials");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContentAdmin({}));
    dispatch(fetchQuizzesAdmin({}));
  }, [dispatch]);
  const {contentList, loading: contentLoading} = useSelector((state) => state.adminContent); 
  const {quizList, loading: quizLoading} = useSelector((state) => state.adminQuiz);
  // Items per page
  const itemsPerPage = 10;
  // Get data based on active tab
  const getData = () => {
    let data;

    switch (activeTab) {
      case "materials":
        data = contentList;
        break;
      case "quizzes":
        data = quizList;
        break;
      case "ai":
        data = [...quizzesData.filter((q) => q.type === "AI Generated")];
        break;
      default:
        data = [];
    }

    // Apply search filter
    if (searchTerm) {
      if (activeTab === "materials") {
        data = data.filter(
          (item) =>
            item?.content_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        data = data.filter(
          (item) =>
            item?.quiz_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    // Apply type filter for materials
    if (activeTab === "materials" && typeFilter !== "all") {
      data = data.filter((item) => item.type??item.content_type === typeFilter);
    }

    // Apply visibility filter for materials
    if (activeTab === "materials" && visibilityFilter !== "all") {
      data = data.filter((item) => item.visibility === visibilityFilter);
    }

    return data;
  };

  const filteredData = getData();

  // Calculate pagination
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate storage stats
  const totalStorage = materialsData.length * 5; // Mock calculation
  const teacherStorage =
    materialsData.filter((m) => m.uploadedBy.includes("Teacher")).length * 7;
  const studentStorage =
    materialsData.filter((m) => m.uploadedBy.includes("Student")).length * 3;

  // Calculate quiz stats
  const totalQuizzes = quizList.length;
  const aiQuizzes = quizList.filter((q) => q.status === "Prompt").length;
  const templateQuizzes = quizList.filter(
    (q) => q.status === "Template"
  ).length;
  const manualQuizzes = quizList.filter((q) => q.status === "Manual" || q.status === "Initiated").length;

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchContentAdmin({}));
    dispatch(fetchQuizzesAdmin({}));
  };

  const handleDeleteContent = (contentId) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      // setIsLoading(true);

      dispatch(deleteContentbyAdmin(contentId))
        .unwrap()
        .then(() => {
          toast.success("Content deleted successfully");
        })
        .catch((error) => {
          toast.error(
            `Failed to delete content: ${error || "Unknown error"}`
          );
        });
    }
  }
  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4" style={{ color: colors.error }} />;
      case "PDF":
        return <FileText className="w-4 h-4" style={{ color: colors.error }} />;
      case "presentation":
        return (
          <FileQuestion className="w-4 h-4" style={{ color: colors.warning }} />
        );
      case "image":
        return <Image className="w-4 h-4" style={{ color: colors.accent }} />;
      case "video":
        return <Video className="w-4 h-4" style={{ color: colors.primary }} />;
      case "document":
      default:
        return <File className="w-4 h-4" style={{ color: colors.primary }} />;
    }
  };
  const handleDeleteQuiz = (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      // setIsLoading(true);

      dispatch(deleteQuizbyAdmin(quizId))
        .unwrap()
        .then(() => {
          toast.success("Quiz deleted successfully");
        })
        .catch((error) => {
          toast.error(
            `Failed to delete Quiz: ${error || "Unknown error"}`
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
          Content Monitoring
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Monitor and analyze content across the platform
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Materials Overview */}
        <div
          className="p-5 rounded-lg"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{ color: colors.text }}>
              Materials Overview
            </h3>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${colors.accent}20` }}
            >
              <FileText className="w-5 h-5" style={{ color: colors.accent }} />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm" style={{ color: colors.textMuted }}>
                Total Materials
              </span>
              <span className="font-bold" style={{ color: colors.text }}>
                {contentList.length}
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.borderColor }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: "75%",
                  backgroundColor: colors.accent,
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Database
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.textMuted }}
                />
                <span style={{ color: colors.text }}>Total Storage Used</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {totalStorage} MB
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Upload
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.primary }}
                />
                <span style={{ color: colors.text }}>Teacher Materials</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {teacherStorage} MB
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <HardDrive
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.secondary }}
                />
                <span style={{ color: colors.text }}>Student Materials</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {studentStorage} MB
              </span>
            </div>
          </div>

          <button
            className="mt-4 w-full py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: `${colors.accent}20`,
              color: colors.accent,
            }}
            onClick={() => setActiveTab("materials")}
          >
            View All Materials
          </button>
        </div>

        {/* Quiz Overview */}
        <div
          className="p-5 rounded-lg"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{ color: colors.text }}>
              Quiz Overview
            </h3>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Award className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm" style={{ color: colors.textMuted }}>
                Total Quizzes
              </span>
              <span className="font-bold" style={{ color: colors.text }}>
                {totalQuizzes}
              </span>
            </div>
            <div
              className="flex h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.borderColor }}
            >
              <div
                className="h-full"
                style={{
                  width: `${(aiQuizzes / totalQuizzes) * 100}%`,
                  backgroundColor: colors.accent,
                }}
              ></div>
              <div
                className="h-full"
                style={{
                  width: `${(templateQuizzes / totalQuizzes) * 100}%`,
                  backgroundColor: colors.primary,
                }}
              ></div>
              <div
                className="h-full"
                style={{
                  width: `${(manualQuizzes / totalQuizzes) * 100}%`,
                  backgroundColor: colors.secondary,
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Brain
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.accent }}
                />
                <span style={{ color: colors.text }}>AI Generated</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {aiQuizzes} ({Math.round((aiQuizzes / totalQuizzes) * 100)}%)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <FileQuestion
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.primary }}
                />
                <span style={{ color: colors.text }}>Template Based</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {templateQuizzes} (
                {Math.round((templateQuizzes / totalQuizzes) * 100)}%)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <CheckCircle
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.secondary }}
                />
                <span style={{ color: colors.text }}>Manually Created</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {manualQuizzes} (
                {Math.round((manualQuizzes / totalQuizzes) * 100)}%)
              </span>
            </div>
          </div>

          <button
            className="mt-4 w-full py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary,
            }}
            onClick={() => setActiveTab("quizzes")}
          >
            View All Quizzes
          </button>
        </div>

        {/* AI Usage Overview */}
        <div
          className="p-5 rounded-lg"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{ color: colors.text }}>
              AI Usage Overview
            </h3>
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${colors.secondary}20` }}
            >
              <Brain className="w-5 h-5" style={{ color: colors.secondary }} />
            </div>
          </div>

          <div className="mb-3 h-24 relative">
            {/* Placeholder for AI usage chart */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-50"
              style={{ color: colors.textMuted }}
            >
              <LineChart className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Award
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.accent }}
                />
                <span style={{ color: colors.text }}>Quiz Generations</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {aiQuizzes} requests
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <FileText
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.primary }}
                />
                <span style={{ color: colors.text }}>
                  Flashcard Generations
                </span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {aiQuizzes * 2} requests
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <AlertTriangle
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.error }}
                />
                <span style={{ color: colors.text }}>Failed Generations</span>
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {Math.floor(aiQuizzes * 0.05)} requests
              </span>
            </div>
          </div>

          <button
            className="mt-4 w-full py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: `${colors.secondary}20`,
              color: colors.secondary,
            }}
            onClick={() => setActiveTab("ai")}
          >
            View AI Usage Details
          </button>
        </div>
      </div>

      {/* Content Tabs */}
      <div
        className="flex border-b mb-6"
        style={{ borderColor: colors.borderColor }}
      >
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "materials" ? "" : ""
          }`}
          style={{
            color: activeTab === "materials" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "materials"
                ? `2px solid ${colors.primary}`
                : "none",
          }}
          onClick={() => setActiveTab("materials")}
        >
          Materials
        </button>
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "quizzes" ? "" : ""
          }`}
          style={{
            color: activeTab === "quizzes" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "quizzes" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("quizzes")}
        >
          Quizzes
        </button>
        <button
          className={`px-4 py-2 font-medium relative ${
            activeTab === "ai" ? "" : ""
          }`}
          style={{
            color: activeTab === "ai" ? colors.primary : colors.text,
            borderBottom:
              activeTab === "ai" ? `2px solid ${colors.primary}` : "none",
          }}
          onClick={() => setActiveTab("ai")}
        >
          AI Usage
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
          {activeTab === "materials" && (
            <>
              {/* Type filter dropdown */}
              <div className="relative">
                <button
                  className="flex items-center px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      typeFilter !== "all"
                        ? `${colors.primary}20`
                        : colors.inputBg,
                    color: typeFilter !== "all" ? colors.primary : colors.text,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span>
                    {typeFilter === "all"
                      ? "All Types"
                      : typeFilter === "pdf"
                      ? "PDF"
                      : typeFilter === "presentation"
                      ? "Presentations"
                      : typeFilter === "image"
                      ? "Images"
                      : "Documents"}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {showTypeDropdown && (
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
                            typeFilter === "all"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setTypeFilter("all");
                          setShowTypeDropdown(false);
                        }}
                      >
                        All Types
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm flex items-center"
                        style={{
                          backgroundColor:
                            typeFilter === "pdf"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setTypeFilter("PDF");
                          setShowTypeDropdown(false);
                        }}
                      >
                        <FileText
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.error }}
                        />
                        PDF
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm flex items-center"
                        style={{
                          backgroundColor:
                            typeFilter === "presentation"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setTypeFilter("presentation");
                          setShowTypeDropdown(false);
                        }}
                      >
                        <FileQuestion
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.warning }}
                        />
                        Presentations
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm flex items-center"
                        style={{
                          backgroundColor:
                            typeFilter === "image"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setTypeFilter("image");
                          setShowTypeDropdown(false);
                        }}
                      >
                        <Image
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.accent }}
                        />
                        Images
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm flex items-center"
                        style={{
                          backgroundColor:
                            typeFilter === "document"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setTypeFilter("document");
                          setShowTypeDropdown(false);
                        }}
                      >
                        <File
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.primary }}
                        />
                        Documents
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Visibility filter dropdown */}
              <div className="relative">
                <button
                  className="flex items-center px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      visibilityFilter !== "all"
                        ? `${colors.primary}20`
                        : colors.inputBg,
                    color:
                      visibilityFilter !== "all" ? colors.primary : colors.text,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                  onClick={() =>
                    setShowVisibilityDropdown(!showVisibilityDropdown)
                  }
                >
                  <span>
                    {visibilityFilter === "all"
                      ? "All Visibility"
                      : visibilityFilter === "class"
                      ? "Class Materials"
                      : "Personal Materials"}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {showVisibilityDropdown && (
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
                            visibilityFilter === "all"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setVisibilityFilter("all");
                          setShowVisibilityDropdown(false);
                        }}
                      >
                        All Visibility
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm"
                        style={{
                          backgroundColor:
                            visibilityFilter === "class"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setVisibilityFilter("class");
                          setShowVisibilityDropdown(false);
                        }}
                      >
                        Class Materials
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm"
                        style={{
                          backgroundColor:
                            visibilityFilter === "personal"
                              ? `${colors.primary}20`
                              : "transparent",
                          color: colors.text,
                        }}
                        onClick={() => {
                          setVisibilityFilter("personal");
                          setShowVisibilityDropdown(false);
                        }}
                      >
                        Personal Materials
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === "materials" && (
          <button
            className="flex items-center px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: colors.primary,
              color: colors.lightText,
            }}
            onClick={()=>setShowContentModal(true)}
          >
            {/* <UserPlus className="w-4 h-4 mr-2" /> */}
            Add New Content
          </button>
          )}
          {activeTab === "quizzes" && (
          <button
            className="flex items-center px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: colors.primary,
              color: colors.lightText,
            }}
            onClick={()=>setShowQuizModal(true)}
          >
            {/* <UserPlus className="w-4 h-4 mr-2" /> */}
            Add New Quiz
          </button>
          )}
          {/* Refresh button */}
          <button
            className="p-2 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
            disabled={contentLoading||quizLoading}
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`w-4 h-4 ${contentLoading||quizLoading ? "animate-spin" : ""}`}
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

      {/* Content Tables based on active tab */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: `1px solid ${colors.borderColor}`,
          backgroundColor: colors.cardBg,
        }}
      >
        <div className="overflow-x-auto">
          {activeTab === "materials" && (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: colors.cardBgAlt }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Material Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Uploaded By
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Upload Date
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Size
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Class
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Visibility
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Downloads
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
                { contentLoading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center"
                      style={{ color: colors.textMuted }}
                    >
                      <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center"
                      style={{ color: colors.textMuted }}
                    >
                      No materials found matching your criteria
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((material, index) => (
                    <tr
                      key={material.id}
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
                          <div className="mr-3">
                            {getFileIcon(material.type??material.content_type)}
                          </div>
                          <span style={{ color: colors.text }}>
                            {material.name || material.content_name}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: colors.text }}
                      >
                        {material.uploadedBy || "user "+material.user_id}
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
                          {formatDate(material.createdAt)}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: colors.text }}
                      >
                        {material.size ||'-'}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: colors.text }}
                      >
                        {material.class || "class "+material?.class_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor:
                              // material.visibility === "class"
                              material?.class_id
                                ? `${colors.primary}20`
                                : `${colors.secondary}20`,
                            color:
                              material?.class_id
                                ? colors.primary
                                : colors.secondary,
                          }}
                        >
                          {material?.class_id
                            ? "Class"
                            : "Personal"}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: colors.text }}
                      >
                        <div className="flex items-center">
                          <DownloadCloud
                            className="w-3 h-3 mr-1"
                            style={{ color: colors.textMuted }}
                          />
                          {material.downloads || material.page_count}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="p-1 rounded"
                            style={{ color: colors.primary }}
                            title="View Material"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 rounded"
                            style={{ color: colors.warning }}
                            title="Flag Material"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 rounded"
                            style={{ color: colors.error }}
                            title="Delete Material"
                            onClick={() => handleDeleteContent(material.id)}
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
          )}

          {activeTab === "quizzes" && (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: colors.cardBgAlt }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Quiz Title
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Created By
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
                    Type
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Questions
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Participants
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Avg. Score
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
                { quizLoading? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center"
                      style={{ color: colors.textMuted }}
                    >
                      <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center"
                      style={{ color: colors.textMuted }}
                    >
                      No quizzes found matching your criteria
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((quiz, index) => (
                    <tr
                      key={quiz?.id}
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
                          <Award
                            className="w-4 h-4 mr-2"
                            style={{ color: colors.primary }}
                          />
                          <span style={{ color: colors.text }}>
                            {quiz?.title || quiz?.quiz_name}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: colors.text }}
                      >
                        {quiz?.createdBy || "user " + quiz?.user_id}
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
                          {formatDate(quiz?.creationDate??quiz?.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor:
                              quiz?.status === "Prompt"
                                ? `${colors.accent}20`
                                : quiz?.status === "Template"
                                ? `${colors.primary}20`
                                : `${colors.secondary}20`,
                            color:
                              quiz?.status === "Prompt"
                                ? colors.accent
                                : quiz.status === "Template"
                                ? colors.primary
                                : colors.secondary,
                          }}
                        >
                          {quiz?.status==="Prompt"?"AI Generated":quiz?.status || "-"}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: colors.text }}
                      >
                        {quiz?.num_of_questions || "-"}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: colors.text }}
                      >
                        <div className="flex items-center">
                          <Users
                            className="w-3 h-3 mr-1"
                            style={{ color: colors.textMuted }}
                          />
                          {quiz.participants || (typeof quiz.difficulty === 'number' ? quiz.difficulty : "-")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-16 h-2 rounded-full overflow-hidden mr-2"
                            style={{ backgroundColor: colors.borderColor }}
                          >
                            <div
                              className="h-full"
                              style={{
                                width: `${quiz?.questions?.length}%`,
                                backgroundColor:
                                  quiz?.questions?.length >= 80
                                    ? colors.success
                                    : quiz?.questions?.length >= 60
                                    ? colors.primary
                                    : quiz?.questions?.length >= 40
                                    ? colors.warning
                                    : colors.error,
                              }}
                            ></div>
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: colors.text }}
                          >
                            {quiz?.questions?.length}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="p-1 rounded"
                            style={{ color: colors.primary }}
                            title="View Quiz"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 rounded"
                            style={{ color: colors.warning }}
                            title="Flag Quiz"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 rounded"
                            style={{ color: colors.error }}
                            title="Delete Quiz"
                            onClick={() => handleDeleteQuiz(quiz.id)}
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
          )}

          {activeTab === "ai" && (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: colors.cardBgAlt }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Feature
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Requested By
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Date & Time
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Tokens Used
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textMuted }}
                  >
                    Response Time
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
                {quizLoading ? (
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
                      No AI usage data found matching your criteria
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    // Generate random AI usage metrics
                    const feature =
                      Math.random() > 0.5
                        ? "Quiz Generation"
                        : "Flashcard Creation";
                    const status = Math.random() > 0.1 ? "Success" : "Failed";
                    const tokens = Math.floor(Math.random() * 1000) + 500;
                    const responseTime = (Math.random() * 5 + 1).toFixed(2);

                    return (
                      <tr
                        key={item.id}
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
                            <Brain
                              className="w-4 h-4 mr-2"
                              style={{ color: colors.secondary }}
                            />
                            <span style={{ color: colors.text }}>
                              {feature}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: colors.text }}
                        >
                          {item.createdBy}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: colors.text }}
                        >
                          <div className="flex items-center">
                            <Clock
                              className="w-3 h-3 mr-1"
                              style={{ color: colors.textMuted }}
                            />
                            {formatDate(item.creationDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor:
                                status === "Success"
                                  ? `${colors.success}20`
                                  : `${colors.error}20`,
                              color:
                                status === "Success"
                                  ? colors.success
                                  : colors.error,
                            }}
                          >
                            {status}
                          </span>
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: colors.text }}
                        >
                          {tokens}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ color: colors.text }}
                        >
                          {responseTime}s
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="p-1 rounded"
                              style={{ color: colors.primary }}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 rounded"
                              style={{ color: colors.text }}
                              title="More Actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
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
      <ContentModal
        showModal={showContentModal}
        setShowModal={setShowContentModal}
      />
      <CreateQuizModal showModal={showQuizModal} setShowModal={setShowQuizModal} />
    </div>
  );
};

export default ContentMonitoring;
