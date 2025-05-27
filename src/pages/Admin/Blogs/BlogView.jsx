import React, {useEffect} from "react";
import {
  ArrowLeft,
  Edit,
  Trash,
  Eye,
  MessageSquare,
  Calendar,
  Clock,
  User,
  Globe,
  Lock,
  Users,
  Share2,
  Heart,
  Download,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {deleteBlog, fetchBlogById} from "../../../store/admin/blogSlice";
import {useDispatch, useSelector} from "react-redux";

const BlogView = ({ blog, onBack, onEdit }) => {
  const dispatch=useDispatch();
  const {blogDetails} = useSelector((state) => state.blogs);
  const { colors } = useTheme();


  useEffect(() => {
    if (blog?.id && blog.id !== blogDetails?.id) {
      dispatch(fetchBlogById(blog.id));
    }
  }, [blog?.id]);


  console.log(blogDetails)

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        dispatch(deleteBlog(blog.id));
        onBack(); // Go back to list after deletion
      } catch (error) {
        console.error("Failed to delete blog:", error);
        alert("Failed to delete blog. Please try again.");
      }
    }
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Blog content section */}
      <div className="lg:col-span-2">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border: `1px solid ${colors.borderColor}`,
            backgroundColor: colors.cardBg,
          }}
        >
          <div
            className="px-6 py-4 border-b flex justify-between items-center"
            style={{ borderColor: colors.borderColor }}
          >
            <h3 className="text-lg font-medium" style={{ color: colors.text }}>
              Blog Details
            </h3>

            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                }}
                onClick={() => onEdit(blogDetails)}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: `${colors.error}20`,
                  color: colors.error,
                }}
                onClick={handleDelete}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Featured image placeholder */}
            <div
              className="h-48 w-full mb-6 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: colors.cardBgAlt,
                color: colors.textMuted,
              }}
            >
              <p className="text-sm">Featured Image</p>
            </div>

            {/* Blog title */}
            <h1
              className="text-2xl font-bold mb-3"
              style={{ color: colors.text }}
            >
              {blogDetails?.title}
            </h1>

            {/* Blog meta */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span
                className="flex items-center text-sm"
                style={{ color: colors.textMuted }}
              >
                <User className="w-3 h-3 mr-1" /> {blogDetails?.author}
              </span>
              <span
                className="flex items-center text-sm"
                style={{ color: colors.textMuted }}
              >
                <Calendar className="w-3 h-3 mr-1" />{" "}
                {formatDate(blogDetails?.createdAt)}
              </span>
              <span
                className="px-2 py-0.5 text-xs rounded-full flex items-center"
                style={{
                  backgroundColor: getStatusColor(blogDetails?.status).bg,
                  color: getStatusColor(blogDetails?.status).text,
                }}
              >
                {blogDetails?.status === "published"
                  ? "Published"
                  : blogDetails?.status === "draft"
                  ? "Draft"
                  : "Review"}
              </span>
              <span
                className="px-2 py-0.5 text-xs rounded-full flex items-center"
                style={{
                  backgroundColor: getVisibilityColor(blogDetails?.Visibility).bg,
                  color: getVisibilityColor(blogDetails?.Visibility).text,
                }}
              >
                {blogDetails?.Visibility === "public" ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" /> Public
                  </>
                ) : blogDetails?.Visibility === "private" ? (
                  <>
                    <Lock className="w-3 h-3 mr-1" /> Private
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3 mr-1" /> Members
                  </>
                )}
              </span>
            </div>

            {/* Blog summary */}
            <div
              className="mb-4 p-4 rounded-lg"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <p style={{ color: colors.text }}>{blogDetails?.summary}</p>
            </div>

            {/* Blog content */}
            <div
              className="prose max-w-none"
              style={{ color: colors.text }}
              dangerouslySetInnerHTML={{ __html: blogDetails?.content }}
            ></div>

            {/* Tags (if applicable) */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                }}
              >
                Education
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: `${colors.secondary}20`,
                  color: colors.secondary,
                }}
              >
                Technology
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: `${colors.accent}20`,
                  color: colors.accent,
                }}
              >
                E-Learning
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar section */}
      <div>
        {/* Blog stats */}
        <div
          className="rounded-lg overflow-hidden mb-6"
          style={{
            border: `1px solid ${colors.borderColor}`,
            backgroundColor: colors.cardBg,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: colors.borderColor }}
          >
            <h3 className="text-lg font-medium" style={{ color: colors.text }}>
              Blog Statistics
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: colors.textMuted }}>
                  <Eye className="w-4 h-4 inline mr-2" />
                  Total Views
                </span>
                <span className="font-medium" style={{ color: colors.primary }}>
                  {blog.views}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: colors.textMuted }}>
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Comments
                </span>
                <span className="font-medium" style={{ color: colors.primary }}>
                  {blog.comments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: colors.textMuted }}>
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Shares
                </span>
                <span className="font-medium" style={{ color: colors.primary }}>
                  {Math.floor(blog.views / 10)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: colors.textMuted }}>
                  <Heart className="w-4 h-4 inline mr-2" />
                  Likes
                </span>
                <span className="font-medium" style={{ color: colors.primary }}>
                  {Math.floor(blog.views / 5)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: colors.textMuted }}>
                  <Clock className="w-4 h-4 inline mr-2" />
                  Last Updated
                </span>
                <span className="font-medium" style={{ color: colors.primary }}>
                  {formatDate(blog.updatedAt)}
                </span>
              </div>
            </div>

            {/* View public link button */}
            <button
              className="w-full px-4 py-2 rounded-lg flex items-center justify-center mt-6"
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Public Link
            </button>
          </div>
        </div>

        {/* Meta information */}
        <div
          className="rounded-lg overflow-hidden mb-6"
          style={{
            border: `1px solid ${colors.borderColor}`,
            backgroundColor: colors.cardBg,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: colors.borderColor }}
          >
            <h3 className="text-lg font-medium" style={{ color: colors.text }}>
              Meta Information
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full">
              <tbody>
                <tr>
                  <td
                    className="py-2 text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    Status
                  </td>
                  <td className="py-2 text-sm text-right">
                    <span
                      className="px-2 py-0.5 text-xs rounded-full"
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
                </tr>
                <tr>
                  <td
                    className="py-2 text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    Visibility
                  </td>
                  <td className="py-2 text-sm text-right">
                    <span
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: getVisibilityColor(blog.Visibility).bg,
                        color: getVisibilityColor(blog.Visibility).text,
                      }}
                    >
                      {blog.Visibility === "public"
                        ? "Public"
                        : blog.Visibility === "private"
                        ? "Private"
                        : "Registered Users"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    className="py-2 text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    Language
                  </td>
                  <td
                    className="py-2 text-sm text-right"
                    style={{ color: colors.text }}
                  >
                    {blog.language}
                  </td>
                </tr>
                <tr>
                  <td
                    className="py-2 text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    Author
                  </td>
                  <td
                    className="py-2 text-sm text-right"
                    style={{ color: colors.text }}
                  >
                    {blog.author}
                  </td>
                </tr>
                <tr>
                  <td
                    className="py-2 text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    Created Date
                  </td>
                  <td
                    className="py-2 text-sm text-right"
                    style={{ color: colors.text }}
                  >
                    {formatDate(blog.createdAt)}
                  </td>
                </tr>
                <tr>
                  <td
                    className="py-2 text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    Last Updated
                  </td>
                  <td
                    className="py-2 text-sm text-right"
                    style={{ color: colors.text }}
                  >
                    {formatDate(blog.updatedAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between">
          <button
            className="px-4 py-2 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </button>
          <button
            className="px-4 py-2 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: colors.primary,
              color: colors.lightText,
            }}
            onClick={() => onEdit(blogDetails)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
