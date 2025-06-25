import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Globe,
  Lock,
  Users,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  List,
  Hash,
  Quote,
  HelpCircle,
  Image,
  FileText,
  Edit3,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  createBlog,
  fetchBlogById,
  fetchBlogs,
  updateBlog,
} from "../../../store/admin/blogSlice";
import { useDispatch, useSelector } from "react-redux";

const BlogForm = ({ blog = null, onCancel, onSaved }) => {
  const dispatch = useDispatch();
  const { blogDetails, loading } = useSelector((state) => state.blogs);
  const { colors } = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const featuredImageInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    documentTitle: "",
    summary: "",
    metaDescription: [],
    urlSlug: "",
    featuredImage: null,
    content: [
      {
        position: 0,
        type: "introduction",
        content: "",
      },
    ],
    status: "draft",
    Visibility: "public",
    language: "English",
  });

  const SECTION_TYPES = {
    introduction: { icon: FileText, label: "Introduction", mandatory: true },
    subtitle: { icon: Type, label: "Sub Title" },
    bulletPoints: { icon: List, label: "Bullet Points" },
    bulletPointsWithHeading: {
      icon: Edit3,
      label: "Bullet Points with Heading",
    },
    numberedList: { icon: Hash, label: "Numbered List" },
    faq: { icon: HelpCircle, label: "FAQ List" },
    quote: { icon: Quote, label: "Quote" },
    image: { icon: Image, label: "Image" },
    closing: { icon: FileText, label: "Closing" },
  };

  const shallowCompareSubset = (subset, fullObj) => {
    for (const key in subset) {
      if (subset[key] !== fullObj?.[key]) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (
      blog?.id &&
      (blog.id !== blogDetails?.id || !shallowCompareSubset(blog, blogDetails))
    ) {
      dispatch(fetchBlogById(blog.id));
    }
  }, [blog, blogDetails]);

  useEffect(() => {
    if (blogDetails && blog) {
      setFormData({
        title: blogDetails.title || "",
        documentTitle: blogDetails.documentTitle || "",
        summary: blogDetails.summary || "",
        metaDescription: blogDetails.metaDescription || [],
        urlSlug: blogDetails.urlSlug || "",
        featuredImage: blogDetails.featuredImage || null,
        content: blogDetails.content || [
          {
            position: 0,
            type: "introduction",
            content: "",
          },
        ],
        status: blogDetails.status || "draft",
        Visibility: blogDetails.Visibility || "public",
        language: blogDetails.language || "English",
      });
    }
  }, [blogDetails, blog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMetaDescriptionChange = (index, value) => {
    const newMetaDescription = [...formData.metaDescription];
    newMetaDescription[index] = value;
    setFormData({
      ...formData,
      metaDescription: newMetaDescription,
    });
  };

  const addMetaDescription = () => {
    setFormData({
      ...formData,
      metaDescription: [...formData.metaDescription, ""],
    });
  };

  const removeMetaDescription = (index) => {
    const newMetaDescription = formData.metaDescription.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      metaDescription: newMetaDescription,
    });
  };

  const addContentSection = (type) => {
    const newSection = {
      position: formData.content.length,
      type,
      content: getDefaultContentForType(type),
    };

    setFormData({
      ...formData,
      content: [...formData.content, newSection],
    });
  };

  const getDefaultContentForType = (type) => {
    switch (type) {
      case "faq":
        return [{ question: "", answer: "" }];
      case "bulletPoints":
      case "numberedList":
        return [""];
      case "bulletPointsWithHeading":
        return { heading: "", items: [""] };
      case "image":
        return { url: "", alt: "", caption: "" };
      default:
        return "";
    }
  };

  const updateContentSection = (index, newContent) => {
    const newContentArray = [...formData.content];
    newContentArray[index] = {
      ...newContentArray[index],
      content: newContent,
    };
    setFormData({
      ...formData,
      content: newContentArray,
    });
  };

  const removeContentSection = (index) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    // Reorder positions
    const reorderedContent = newContent.map((section, i) => ({
      ...section,
      position: i,
    }));

    setFormData({
      ...formData,
      content: reorderedContent,
    });
  };

  const moveSection = (index, direction) => {
    const newContent = [...formData.content];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newContent.length) {
      [newContent[index], newContent[targetIndex]] = [
        newContent[targetIndex],
        newContent[index],
      ];

      // Update positions
      newContent[index].position = index;
      newContent[targetIndex].position = targetIndex;

      setFormData({
        ...formData,
        content: newContent,
      });
    }
  };

  const handleImageUpload = (index, file) => {
    // In a real implementation, you would upload to a server
    // For now, we'll create a local object URL
    const imageUrl = URL.createObjectURL(file);

    const newContent = {
      ...formData.content[index].content,
      url: imageUrl,
      file: file, // Store the file for future reference
    };

    updateContentSection(index, newContent);
  };

  const handleFeaturedImageUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);

    setFormData({
      ...formData,
      featuredImage: {
        url: imageUrl,
        file: file,
      },
    });
  };

  const renderContentEditor = (section, index) => {
    const { type, content } = section;

    switch (type) {
      case "introduction":
      case "closing":
      case "subtitle":
      case "quote":
        return (
          <textarea
            value={content}
            onChange={(e) => updateContentSection(index, e.target.value)}
            placeholder={`Enter ${type} content...`}
            rows={type === "subtitle" ? 2 : 4}
            className="w-full px-4 py-2 rounded-lg focus:outline-none"
            style={{
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
          />
        );

      case "bulletPoints":
      case "numberedList":
        return (
          <div className="space-y-2">
            {content.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newContent = [...content];
                    newContent[itemIndex] = e.target.value;
                    updateContentSection(index, newContent);
                  }}
                  placeholder={`${
                    type === "numberedList" ? "Numbered" : "Bullet"
                  } point ${itemIndex + 1}`}
                  className="flex-1 px-4 py-2 rounded-lg focus:outline-none"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.borderColor}`,
                    color: colors.text,
                  }}
                />
                {content.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newContent = content.filter(
                        (_, i) => i !== itemIndex
                      );
                      updateContentSection(index, newContent);
                    }}
                    className="p-2 rounded"
                    style={{ color: colors.error }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newContent = [...content, ""];
                updateContentSection(index, newContent);
              }}
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
            >
              Add Item
            </button>
          </div>
        );

      case "bulletPointsWithHeading":
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={content.heading || ""}
              onChange={(e) => {
                updateContentSection(index, {
                  ...content,
                  heading: e.target.value,
                });
              }}
              placeholder="Enter heading..."
              className="w-full px-4 py-2 rounded-lg focus:outline-none font-medium"
              style={{
                backgroundColor: colors.inputBg,
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
            />
            <div className="space-y-2">
              {(content.items || [""]).map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(content.items || [""])];
                      newItems[itemIndex] = e.target.value;
                      updateContentSection(index, {
                        ...content,
                        items: newItems,
                      });
                    }}
                    placeholder={`Bullet point ${itemIndex + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  />
                  {(content.items || [""]).length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = (content.items || [""]).filter(
                          (_, i) => i !== itemIndex
                        );
                        updateContentSection(index, {
                          ...content,
                          items: newItems,
                        });
                      }}
                      className="p-2 rounded"
                      style={{ color: colors.error }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(content.items || [""]), ""];
                  updateContentSection(index, {
                    ...content,
                    items: newItems,
                  });
                }}
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.lightText,
                }}
              >
                Add Item
              </button>
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4">
            {content.map((faqItem, faqIndex) => (
              <div
                key={faqIndex}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <div className="space-y-3">
                  <input
                    type="text"
                    value={faqItem.question}
                    onChange={(e) => {
                      const newContent = [...content];
                      newContent[faqIndex] = {
                        ...newContent[faqIndex],
                        question: e.target.value,
                      };
                      updateContentSection(index, newContent);
                    }}
                    placeholder="Enter question..."
                    className="w-full px-4 py-2 rounded-lg focus:outline-none font-medium"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  />
                  <textarea
                    value={faqItem.answer}
                    onChange={(e) => {
                      const newContent = [...content];
                      newContent[faqIndex] = {
                        ...newContent[faqIndex],
                        answer: e.target.value,
                      };
                      updateContentSection(index, newContent);
                    }}
                    placeholder="Enter answer..."
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  />
                  {content.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newContent = content.filter(
                          (_, i) => i !== faqIndex
                        );
                        updateContentSection(index, newContent);
                      }}
                      className="px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: colors.error,
                        color: colors.lightText,
                      }}
                    >
                      Remove FAQ
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newContent = [...content, { question: "", answer: "" }];
                updateContentSection(index, newContent);
              }}
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
            >
              Add FAQ
            </button>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            {/* Image Upload Area */}
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center"
              style={{ borderColor: colors.borderColor }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.add("bg-opacity-10");
                e.currentTarget.style.backgroundColor = `${colors.primary}20`;
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove("bg-opacity-10");
                e.currentTarget.style.backgroundColor = "";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove("bg-opacity-10");
                e.currentTarget.style.backgroundColor = "";

                const files = e.dataTransfer.files;
                if (
                  files &&
                  files.length > 0 &&
                  files[0].type.startsWith("image/")
                ) {
                  handleImageUpload(index, files[0]);
                }
              }}
            >
              {content.url ? (
                <div className="relative">
                  <img
                    src={content.url}
                    alt={content.alt || "Preview"}
                    className="max-w-full max-h-48 object-contain rounded mx-auto"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateContentSection(index, {
                        ...content,
                        url: "",
                        file: null,
                      });
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    style={{ transform: "translate(50%, -50%)" }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload
                    className="mx-auto mb-2"
                    style={{ color: colors.textMuted }}
                  />
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    Drag and drop an image here, or{" "}
                    <button
                      type="button"
                      className="font-medium"
                      style={{ color: colors.primary }}
                      onClick={() => {
                        // Create a unique ref for this specific image section
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                    >
                      click to browse
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(index, e.target.files[0]);
                          // Reset the input
                          e.target.value = "";
                        }
                      }}
                    />
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: colors.textMuted }}
                  >
                    Recommended size: 1200x800px, max 2MB
                  </p>
                </>
              )}
            </div>

            {/* Image Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label
                    className="block text-xs mb-1"
                    style={{ color: colors.textMuted }}
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={content.url || ""}
                    onChange={(e) => {
                      updateContentSection(index, {
                        ...content,
                        url: e.target.value,
                        file: null, // Clear file reference if URL is manually changed
                      });
                    }}
                    placeholder="Image URL..."
                    className="w-full px-4 py-2 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Alt Text (for accessibility and SEO)
                </label>
                <input
                  type="text"
                  value={content.alt || ""}
                  onChange={(e) => {
                    updateContentSection(index, {
                      ...content,
                      alt: e.target.value,
                    });
                  }}
                  placeholder="Describe the image..."
                  className="w-full px-4 py-2 rounded-lg focus:outline-none"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.borderColor}`,
                    color: colors.text,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={content.caption || ""}
                  onChange={(e) => {
                    updateContentSection(index, {
                      ...content,
                      caption: e.target.value,
                    });
                  }}
                  placeholder="Image caption..."
                  className="w-full px-4 py-2 rounded-lg focus:outline-none"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.borderColor}`,
                    color: colors.text,
                  }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would upload all images here
      // before sending the form data to the server

      if (blog) {
        dispatch(updateBlog({ id: blog.id, blogData: formData }));
        onSaved();
      } else {
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

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");

    setFormData({
      ...formData,
      urlSlug: slug,
    });
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
                {/* Basic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Blog Title <span style={{ color: colors.error }}>*</span>
                    </label>
                    <input
                      type="text"
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

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Document Title
                    </label>
                    <input
                      type="text"
                      name="documentTitle"
                      value={formData.documentTitle}
                      onChange={handleInputChange}
                      placeholder="Document title for SEO"
                      className="w-full px-4 py-2 rounded-lg focus:outline-none"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                    />
                  </div>
                </div>

                {/* URL Slug */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    URL Slug
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="urlSlug"
                      value={formData.urlSlug}
                      onChange={handleInputChange}
                      placeholder="url-slug"
                      className="flex-1 px-4 py-2 rounded-lg focus:outline-none"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.lightText,
                      }}
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Summary
                  </label>
                  <textarea
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
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Meta Description
                  </label>
                  <div className="space-y-2">
                    {formData.metaDescription.map((desc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={desc}
                          onChange={(e) =>
                            handleMetaDescriptionChange(index, e.target.value)
                          }
                          placeholder="Meta description..."
                          className="flex-1 px-4 py-2 rounded-lg focus:outline-none"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                        />
                        {formData.metaDescription.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMetaDescription(index)}
                            className="p-2 rounded"
                            style={{ color: colors.error }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addMetaDescription}
                      className="px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.lightText,
                      }}
                    >
                      Add Meta Description
                    </button>
                  </div>
                </div>

                {/* Featured Image Upload */}
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
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = "";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = "";

                      const files = e.dataTransfer.files;
                      if (
                        files &&
                        files.length > 0 &&
                        files[0].type.startsWith("image/")
                      ) {
                        handleFeaturedImageUpload(files[0]);
                      }
                    }}
                  >
                    {formData.featuredImage?.url ? (
                      <div className="relative">
                        <img
                          src={formData.featuredImage.url}
                          alt="Featured"
                          className="max-w-full h-32 object-cover rounded mx-auto mb-2"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              featuredImage: null,
                            });
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                          style={{ transform: "translate(50%, -50%)" }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload
                          className="mx-auto mb-2"
                          style={{ color: colors.textMuted }}
                        />
                        <p
                          className="text-sm"
                          style={{ color: colors.textMuted }}
                        >
                          Drag and drop an image here, or{" "}
                          <button
                            type="button"
                            className="font-medium"
                            style={{ color: colors.primary }}
                            onClick={() => {
                              if (featuredImageInputRef.current) {
                                featuredImageInputRef.current.click();
                              }
                            }}
                          >
                            click to browse
                          </button>
                          <input
                            ref={featuredImageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFeaturedImageUpload(e.target.files[0]);
                                // Reset the input
                                e.target.value = "";
                              }
                            }}
                          />
                        </p>
                      </>
                    )}
                    <p
                      className="text-xs mt-1"
                      style={{ color: colors.textMuted }}
                    >
                      Recommended size: 1200x630px, max 2MB
                    </p>
                  </div>
                </div>

                {/* Blog Content Sections */}
                <div>
                  <label
                    className="block text-sm font-medium mb-4"
                    style={{ color: colors.text }}
                  >
                    Blog Content <span style={{ color: colors.error }}>*</span>
                  </label>

                  <div className="space-y-4">
                    {formData.content.map((section, index) => {
                      const SectionIcon =
                        SECTION_TYPES[section.type]?.icon || FileText;
                      const isIntroduction = section.type === "introduction";

                      return (
                        <div
                          key={index}
                          className="p-4 rounded-lg"
                          style={{
                            backgroundColor: colors.cardBgAlt,
                            border: `1px solid ${colors.borderColor}`,
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <SectionIcon
                                className="w-5 h-5"
                                style={{ color: colors.primary }}
                              />
                              <h4
                                className="font-medium"
                                style={{ color: colors.text }}
                              >
                                {SECTION_TYPES[section.type]?.label ||
                                  section.type}
                              </h4>
                              {isIntroduction && (
                                <span
                                  className="px-2 py-1 text-xs rounded"
                                  style={{
                                    backgroundColor: colors.primary,
                                    color: colors.lightText,
                                  }}
                                >
                                  Required
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => moveSection(index, "up")}
                                  className="p-1 rounded"
                                  style={{ color: colors.textMuted }}
                                >
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                              )}
                              {index < formData.content.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveSection(index, "down")}
                                  className="p-1 rounded"
                                  style={{ color: colors.textMuted }}
                                >
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                              )}
                              {!isIntroduction && (
                                <button
                                  type="button"
                                  onClick={() => removeContentSection(index)}
                                  className="p-1 rounded"
                                  style={{ color: colors.error }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {renderContentEditor(section, index)}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Section Buttons */}
                  <div className="mt-4">
                    <p
                      className="text-sm mb-3"
                      style={{ color: colors.textMuted }}
                    >
                      Add new section:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(SECTION_TYPES).map(
                        ([type, { icon: Icon, label, mandatory }]) => {
                          if (mandatory) return null; // Don't show mandatory sections in add buttons

                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => addContentSection(type)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                              style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                              }}
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </button>
                          );
                        }
                      )}
                    </div>
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
            <div className="p-6 max-h-96 overflow-y-auto">
              <div
                className="p-4 rounded-lg mb-4"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                {formData.featuredImage?.url && (
                  <div className="mb-4">
                    <img
                      src={formData.featuredImage.url}
                      alt="Featured"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}

                <h1
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.text }}
                >
                  {formData.title || "Blog Title"}
                </h1>
                <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                  {formData.summary || "Blog summary will appear here."}
                </p>

                {formData.content.map((section, index) => (
                  <div key={index} className="mb-4">
                    {section.type !== "introduction" && (
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: colors.primary }}
                      >
                        {SECTION_TYPES[section.type]?.label}
                      </h4>
                    )}
                    <div style={{ color: colors.text }}>
                      {section.type === "faq" &&
                        section.content.map((faq, faqIndex) => (
                          <div key={faqIndex} className="mb-2">
                            <p className="font-medium">{faq.question}</p>
                            <p className="text-sm">{faq.answer}</p>
                          </div>
                        ))}
                      {(section.type === "bulletPoints" ||
                        section.type === "numberedList") && (
                        <ul
                          className={
                            section.type === "numberedList"
                              ? "list-decimal"
                              : "list-disc"
                          }
                          style={{ paddingLeft: "20px" }}
                        >
                          {section.content.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {section.type === "bulletPointsWithHeading" && (
                        <div>
                          <h5 className="font-medium mb-2">
                            {section.content.heading}
                          </h5>
                          <ul
                            className="list-disc"
                            style={{ paddingLeft: "20px" }}
                          >
                            {(section.content.items || []).map(
                              (item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                      {section.type === "image" && section.content.url && (
                        <div>
                          <img
                            src={section.content.url}
                            alt={section.content.alt}
                            className="max-w-full h-32 object-cover rounded mb-2"
                          />
                          {section.content.caption && (
                            <p className="text-sm italic">
                              {section.content.caption}
                            </p>
                          )}
                        </div>
                      )}
                      {(section.type === "introduction" ||
                        section.type === "closing" ||
                        section.type === "subtitle" ||
                        section.type === "quote") && (
                        <p className={section.type === "quote" ? "italic" : ""}>
                          {section.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Status
                  </label>
                  <select
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Visibility
                  </label>
                  <select
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Language
                  </label>
                  <select
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
