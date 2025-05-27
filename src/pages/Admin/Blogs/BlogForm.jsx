import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Globe,
  Lock,
  Users,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {createBlog, fetchBlogById, fetchBlogs, updateBlog} from "../../../store/admin/blogSlice";
import {useDispatch, useSelector} from "react-redux";

const BlogForm = ({ blog = null, onCancel, onSaved }) => {

  const dispatch = useDispatch();
  const { blogDetails, loading } = useSelector((state) => state.blogs);
  const { colors } = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    status: "draft",
    Visibility: "public",
    language: "English",
  });
  const shallowCompareSubset = (subset, fullObj) => {
    for (const key in subset) {
      if (subset[key] !== fullObj?.[key]) {
        return false; // mismatch found
      }
    }
    return true; // all matching
  };

  useEffect(() => {
    if (
        blog?.id &&
        (
            blog.id !== blogDetails?.id ||
            !shallowCompareSubset(blog, blogDetails)
        )
    ) {
      dispatch(fetchBlogById(blog.id));
    }
  }, [blog, blogDetails]);

  useEffect(() => {
    if (blogDetails && blog) {
      setFormData({
        title: blogDetails.title || "",
        summary: blogDetails.summary || "",
        content: blogDetails.content || "",
        status: blogDetails.status || "draft",
        Visibility: blogDetails.Visibility || "public",
        language: blogDetails.language || "English",
      });
    }
  }, []);




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (blog) {
        // Update existing blog
        dispatch(updateBlog({id:blog.id, blogData:formData}));
        onSaved();
      } else {
        // Create new blog
        dispatch(createBlog(formData));
        onSaved();
      }
    } catch (err) {
      console.error("Failed to save blog:", err);
      setError(
        `Failed to ${blog ? "update" : "create"} blog. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form section */}
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
              {blog ? "Edit Blog Post" : "Create New Blog Post"}
            </h3>

            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                }}
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div
              className="mx-6 mt-4 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: `${colors.error}10`,
                border: `1px solid ${colors.error}30`,
                color: colors.error,
              }}
            >
              {error}
            </div>
          )}

          <div className="p-6">
            <form id="blogForm" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Blog Title <span style={{ color: colors.error }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter blog title"
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  />
                </div>

                {/* Summary */}
                <div>
                  <label
                    htmlFor="summary"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Summary
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the blog post"
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  ></textarea>
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Blog Content <span style={{ color: colors.error }}>*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your blog content here..."
                    rows="12"
                    required
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  ></textarea>
                  <p
                    className="mt-2 text-xs italic"
                    style={{ color: colors.textMuted }}
                  >
                    Basic HTML tags are supported for formatting. You can use
                    &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, etc.
                  </p>
                </div>

                {/* File upload section */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Featured Image
                  </label>
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center"
                    style={{ borderColor: colors.borderColor }}
                  >
                    <Upload
                      className="mx-auto mb-2"
                      style={{ color: colors.textMuted }}
                    />
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      Drag and drop an image here, or{" "}
                      <span style={{ color: colors.primary }}>
                        click to browse
                      </span>
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: colors.textMuted }}
                    >
                      Recommended size: 1200x630px, max 2MB
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Settings section */}
      <div>
        {showPreview ? (
          // Preview panel
          <div
            className="rounded-lg overflow-hidden"
            style={{
              border: `1px solid ${colors.borderColor}`,
              backgroundColor: colors.cardBg,
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: colors.borderColor }}
            >
              <h3
                className="text-lg font-medium"
                style={{ color: colors.text }}
              >
                Preview
              </h3>
            </div>
            <div className="p-6">
              <div
                className="p-4 rounded-lg mb-4"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h1
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.text }}
                >
                  {formData.title || blogDetails?.title || "Blog Title"}
                </h1>
                <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                  {formData.summary ||  blogDetails?.summary ||"Blog summary will appear here."}
                </p>
                <div
                  className="prose max-w-none"
                  style={{ color: colors.text }}
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.content || blogDetails.content ||
                      "<p>Blog content will appear here.</p>",
                  }}
                ></div>
              </div>
              <button
                className="w-full px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
                onClick={() => setShowPreview(false)}
              >
                Back to Settings
              </button>
            </div>
          </div>
        ) : (
          // Settings panel
          <div
            className="rounded-lg overflow-hidden"
            style={{
              border: `1px solid ${colors.borderColor}`,
              backgroundColor: colors.cardBg,
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: colors.borderColor }}
            >
              <h3
                className="text-lg font-medium"
                style={{ color: colors.text }}
              >
                Blog Settings
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Under Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Visibility */}
                <div>
                  <label
                    htmlFor="Visibility"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Visibility
                  </label>
                  <select
                    id="Visibility"
                    name="Visibility"
                    value={formData.Visibility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="registered_users">
                      Registered Users Only
                    </option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>

                {/* Additional options */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Additional Options
                  </label>
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <input type="checkbox" id="featured" className="mr-2" />
                      <label
                        htmlFor="featured"
                        className="text-sm"
                        style={{ color: colors.text }}
                      >
                        Mark as featured post
                      </label>
                    </div>
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="comments"
                        className="mr-2"
                        defaultChecked
                      />
                      <label
                        htmlFor="comments"
                        className="text-sm"
                        style={{ color: colors.text }}
                      >
                        Allow comments
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notification"
                        className="mr-2"
                      />
                      <label
                        htmlFor="notification"
                        className="text-sm"
                        style={{ color: colors.text }}
                      >
                        Send notification to users
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-4 py-2 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
            onClick={onCancel}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </button>
          <button
            type="submit"
            form="blogForm"
            className="px-6 py-2 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: colors.primary,
              color: colors.lightText,
            }}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading
              ? blog
                ? "Updating..."
                : "Saving..."
              : blog
              ? "Update Blog"
              : "Save Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
