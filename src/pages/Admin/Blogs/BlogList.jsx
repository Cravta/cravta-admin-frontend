import React, {useState} from "react";
import {
    BookOpen,
    Calendar,
    CheckCircle,
    ChevronDown,
    Clock,
    Download,
    Edit,
    Eye,
    FileText,
    Filter,
    Globe,
    Lock,
    MessageSquare,
    Plus,
    RefreshCw,
    Search,
    Trash,
    User,
    Users,
} from "lucide-react";
import {useTheme} from "../../../contexts/ThemeContext";
import {deleteBlog} from "../../../store/admin/blogSlice";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";

// // Dummy data for blogs
// const blogsData = Array(20)
//   .fill()
//   .map((_, i) => ({
//     id: i + 1,
//     title: `Blog Post ${i + 1}: ${
//       [
//         "Introduction to E-Learning",
//         "The Future of Education",
//         "Remote Learning Tips",
//         "Student Engagement Strategies",
//         "Teaching in the Digital Age",
//       ][i % 5]
//     }`,
//     summary: `This is a summary for blog post ${
//       i + 1
//     }. It gives readers a brief overview of what the article is about.`,
//     content: `<p>This is the full content of blog post ${
//       i + 1
//     }. It would contain paragraphs, images, and other rich text elements.</p>`,
//     user_id: (i % 5) + 1,
//     author: `Admin ${(i % 3) + 1}`,
//     status: ["draft", "published", "review"][i % 3],
//     Visibility: ["public", "private", "registered_users"][i % 3],
//     language: ["English", "Spanish", "French", "German", "Chinese"][i % 5],
//     createdAt: new Date(
//       2023,
//       Math.floor(Math.random() * 12),
//       Math.floor(Math.random() * 28) + 1
//     ).toISOString(),
//     updatedAt: new Date(
//       2023,
//       Math.floor(Math.random() * 12),
//       Math.floor(Math.random() * 28) + 1
//     ).toISOString(),
//     views: Math.floor(Math.random() * 1000),
//     comments: Math.floor(Math.random() * 50),
//   }));

const BlogList = ({
                      blogs,
                      isLoading,
                      error,
                      onAddNew,
                      onViewBlog,
                      onEditBlog,
                      onRefresh,
                  }) => {
    const dispatch = useDispatch();
    const {colors} = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [visibilityFilter, setVisibilityFilter] = useState("all");
    const [languageFilter, setLanguageFilter] = useState("all");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);

    // Items per page
    const itemsPerPage = 10;
    // Calculate blog stats
    const totalBlogs = blogs.body?.length || 0;
    const publishedBlogs = blogs.body?.filter(
        (blog) => blog.status === "published"
    ).length || [];

    const draftBlogs = blogs.body?.filter((blog) => blog.status === "draft").length || [];
    const reviewBlogs = blogs.body?.filter((blog) => blog.status === "review").length || [];

    // Get filtered data
    const getFilteredData = () => {
        let data = [...blogs.body || []];

        // Apply search filter
        if (searchTerm) {
            data = data.filter(
                (blog) =>
                    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    blog.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            data = data.filter((blog) => blog.status === statusFilter);
        }

        // Apply visibility filter
        if (visibilityFilter !== "all") {
            data = data.filter((blog) => blog.Visibility === visibilityFilter);
        }

        // Apply language filter
        if (languageFilter !== "all") {
            data = data.filter((blog) => blog.language === languageFilter);
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

    // Handle delete
    const handleDelete = async (blog) => {
        if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
            setIsDeleting(true);
            try {
                dispatch(deleteBlog(blog.id));
                toast.success("Blog deleted successfully...")
            } catch (error) {
                console.error("Failed to delete blog:", error);
                alert("Failed to delete blog. Please try again.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = {year: "numeric", month: "short", day: "numeric"};
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "published":
                return {
                    bg: `${colors.success}20`,
                    text: colors.success,
                };
            case "draft":
                return {
                    bg: `${colors.warning}20`,
                    text: colors.warning,
                };
            case "review":
                return {
                    bg: `${colors.accent}20`,
                    text: colors.accent,
                };
            default:
                return {
                    bg: `${colors.textMuted}20`,
                    text: colors.textMuted,
                };
        }
    };

    // Get visibility badge color
    const getVisibilityColor = (visibility) => {
        switch (visibility) {
            case "public":
                return {
                    bg: `${colors.primary}20`,
                    text: colors.primary,
                };
            case "private":
                return {
                    bg: `${colors.secondary}20`,
                    text: colors.secondary,
                };
            case "registered_users":
                return {
                    bg: `${colors.accent}20`,
                    text: colors.accent,
                };
            default:
                return {
                    bg: `${colors.textMuted}20`,
                    text: colors.textMuted,
                };
        }
    };

    return (
        <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Total Blogs Card */}
                <div
                    className="p-5 rounded-lg shadow-sm"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium" style={{color: colors.text}}>
                            Total Blogs
                        </h3>
                        <div
                            className="p-2 rounded-lg"
                            style={{backgroundColor: `${colors.primary}20`}}
                        >
                            <FileText className="w-5 h-5" style={{color: colors.primary}}/>
                        </div>
                    </div>
                    <div
                        className="text-2xl font-bold mb-1"
                        style={{color: colors.text}}
                    >
                        {totalBlogs}
                    </div>
                    <p className="text-sm" style={{color: colors.textMuted}}>
                        Total blog posts in the system
                    </p>
                </div>

                {/* Published Blogs Card */}
                <div
                    className="p-5 rounded-lg shadow-sm"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium" style={{color: colors.text}}>
                            Published
                        </h3>
                        <div
                            className="p-2 rounded-lg"
                            style={{backgroundColor: `${colors.success}20`}}
                        >
                            <Globe className="w-5 h-5" style={{color: colors.success}}/>
                        </div>
                    </div>
                    <div
                        className="text-2xl font-bold mb-1"
                        style={{color: colors.text}}
                    >
                        {publishedBlogs}
                    </div>
                    <p className="text-sm" style={{color: colors.textMuted}}>
                        Publicly visible blog posts
                    </p>
                </div>

                {/* Draft Blogs Card */}
                <div
                    className="p-5 rounded-lg shadow-sm"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium" style={{color: colors.text}}>
                            In Draft
                        </h3>
                        <div
                            className="p-2 rounded-lg"
                            style={{backgroundColor: `${colors.warning}20`}}
                        >
                            <Edit className="w-5 h-5" style={{color: colors.warning}}/>
                        </div>
                    </div>
                    <div
                        className="text-2xl font-bold mb-1"
                        style={{color: colors.text}}
                    >
                        {draftBlogs}
                    </div>
                    <p className="text-sm" style={{color: colors.textMuted}}>
                        Blogs in draft status
                    </p>
                </div>

                {/* Under Review Blogs Card */}
                <div
                    className="p-5 rounded-lg shadow-sm"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium" style={{color: colors.text}}>
                            Under Review
                        </h3>
                        <div
                            className="p-2 rounded-lg"
                            style={{backgroundColor: `${colors.accent}20`}}
                        >
                            <Eye className="w-5 h-5" style={{color: colors.accent}}/>
                        </div>
                    </div>
                    <div
                        className="text-2xl font-bold mb-1"
                        style={{color: colors.text}}
                    >
                        {reviewBlogs}
                    </div>
                    <p className="text-sm" style={{color: colors.textMuted}}>
                        Blogs pending review
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                {/* Left side: Search bar */}
                <div className="relative w-full md:w-auto md:flex-1 max-w-md">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{color: colors.textMuted}}
                    />
                    <input
                        type="text"
                        placeholder="Search blogs..."
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
                    {/* Status filter dropdown */}
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
                            <Filter className="w-4 h-4 mr-2"/>
                            <span>
                {statusFilter === "all"
                    ? "All Status"
                    : statusFilter === "published"
                        ? "Published"
                        : statusFilter === "draft"
                            ? "Draft"
                            : "Under Review"}
              </span>
                            <ChevronDown className="w-4 h-4 ml-2"/>
                        </button>

                        {showStatusDropdown && (
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
                                        className="w-full text-left px-4 py-2 text-sm flex items-center"
                                        style={{
                                            backgroundColor:
                                                statusFilter === "published"
                                                    ? `${colors.primary}20`
                                                    : "transparent",
                                            color: colors.text,
                                        }}
                                        onClick={() => {
                                            setStatusFilter("published");
                                            setShowStatusDropdown(false);
                                        }}
                                    >
                                        <CheckCircle
                                            className="w-4 h-4 mr-2"
                                            style={{color: colors.success}}
                                        />
                                        Published
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm flex items-center"
                                        style={{
                                            backgroundColor:
                                                statusFilter === "draft"
                                                    ? `${colors.primary}20`
                                                    : "transparent",
                                            color: colors.text,
                                        }}
                                        onClick={() => {
                                            setStatusFilter("draft");
                                            setShowStatusDropdown(false);
                                        }}
                                    >
                                        <Edit
                                            className="w-4 h-4 mr-2"
                                            style={{color: colors.warning}}
                                        />
                                        Draft
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm flex items-center"
                                        style={{
                                            backgroundColor:
                                                statusFilter === "review"
                                                    ? `${colors.primary}20`
                                                    : "transparent",
                                            color: colors.text,
                                        }}
                                        onClick={() => {
                                            setStatusFilter("review");
                                            setShowStatusDropdown(false);
                                        }}
                                    >
                                        <Eye
                                            className="w-4 h-4 mr-2"
                                            style={{color: colors.accent}}
                                        />
                                        Under Review
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
                        onClick={onRefresh}
                        disabled={isLoading}
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
                    >
                        <Download className="w-4 h-4"/>
                    </button>

                    {/* Add Blog button */}
                    <button
                        className="px-4 py-2 rounded-lg flex items-center justify-center"
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.lightText,
                        }}
                        onClick={onAddNew}
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Blog
                    </button>
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div
                    className="p-4 mb-6 rounded-lg"
                    style={{
                        backgroundColor: `${colors.error}10`,
                        border: `1px solid ${colors.error}30`,
                        color: colors.error,
                    }}
                >
                    {error}
                </div>
            )}

            {/* Blogs Table */}
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
                        <tr style={{backgroundColor: colors.cardBgAlt}}>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Title
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Author
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Status
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Visibility
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Language
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Date
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Stats
                            </th>
                            <th
                                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="px-6 py-4 text-center"
                                    style={{color: colors.textMuted}}
                                >
                                    <RefreshCw className="w-5 h-5 mx-auto animate-spin"/>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="px-6 py-4 text-center"
                                    style={{color: colors.textMuted}}
                                >
                                    No blogs found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((blog, index) => (
                                <tr
                                    key={blog.id}
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
                                                className="p-1 rounded mr-3"
                                                style={{
                                                    backgroundColor: `${colors.primary}20`,
                                                }}
                                            >
                                                <BookOpen
                                                    className="w-4 h-4"
                                                    style={{color: colors.primary}}
                                                />
                                            </div>
                                            <div>
                          <span
                              className="font-medium block"
                              style={{color: colors.text}}
                          >
                            {blog?.title?.length > 40
                                ? blog.title.substring(0, 40) + "..."
                                : blog.title}
                          </span>
                                                <span
                                                    className="text-xs"
                                                    style={{color: colors.textMuted}}
                                                >
                            {blog.summary?.length > 60
                                ? blog.summary.substring(0, 60) + "..."
                                : blog.summary}
                          </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{color: colors.text}}
                                    >
                                        <div className="flex items-center">
                                            <User
                                                className="w-3 h-3 mr-1"
                                                style={{color: colors.textMuted}}
                                            />
                                            {blog.author}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                              backgroundColor: getStatusColor(blog.status).bg,
                              color: getStatusColor(blog.status).text,
                          }}
                      >
                        {blog.status === "published"
                            ? "Published"
                            : blog.status === "draft"
                                ? "Draft"
                                : "Review"}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                          className="px-2 py-1 text-xs rounded-full flex items-center w-fit"
                          style={{
                              backgroundColor: getVisibilityColor(blog.Visibility)
                                  .bg,
                              color: getVisibilityColor(blog.Visibility).text,
                          }}
                      >
                        {blog.Visibility === "public" ? (
                            <>
                                <Globe className="w-3 h-3 mr-1"/> Public
                            </>
                        ) : blog.Visibility === "private" ? (
                            <>
                                <Lock className="w-3 h-3 mr-1"/> Private
                            </>
                        ) : (
                            <>
                                <Users className="w-3 h-3 mr-1"/> Members
                            </>
                        )}
                      </span>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{color: colors.text}}
                                    >
                                        {blog.language}
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{color: colors.text}}
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex items-center">
                                                <Calendar
                                                    className="w-3 h-3 mr-1"
                                                    style={{color: colors.textMuted}}
                                                />
                                                {formatDate(blog.createdAt)}
                                            </div>
                                            <div
                                                className="flex items-center text-xs mt-1"
                                                style={{color: colors.textMuted}}
                                            >
                                                <Clock className="w-2 h-2 mr-1"/> Updated:{" "}
                                                {formatDate(blog.updatedAt)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex space-x-4">
                                            <div className="flex items-center">
                                                <Eye
                                                    className="w-3 h-3 mr-1"
                                                    style={{color: colors.primary}}
                                                />
                                                <span style={{color: colors.text}}>
                            {blog.views}
                          </span>
                                            </div>
                                            <div className="flex items-center">
                                                <MessageSquare
                                                    className="w-3 h-3 mr-1"
                                                    style={{color: colors.accent}}
                                                />
                                                <span style={{color: colors.text}}>
                            {blog.comments}
                          </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 rounded"
                                                style={{color: colors.primary}}
                                                title="View Blog"
                                                onClick={() => onViewBlog(blog)}
                                            >
                                                <Eye className="w-4 h-4"/>
                                            </button>
                                            <button
                                                className="p-1 rounded"
                                                style={{color: colors.secondary}}
                                                title="Edit Blog"
                                                onClick={() => onEditBlog(blog)}
                                            >
                                                <Edit className="w-4 h-4"/>
                                            </button>
                                            <button
                                                className="p-1 rounded"
                                                style={{color: colors.error}}
                                                title="Delete Blog"
                                                onClick={() => handleDelete(blog)}
                                                disabled={isDeleting}
                                            >
                                                <Trash className="w-4 h-4"/>
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
                        style={{borderColor: colors.borderColor}}
                    >
                        <div className="text-sm" style={{color: colors.textMuted}}>
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

                            {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
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
        </>
    );
};

export default BlogList;
