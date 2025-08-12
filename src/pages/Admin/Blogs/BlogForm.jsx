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
  Link, // Add this import
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  createBlog,
  fetchBlogById,
  fetchBlogs,
  updateBlog,
} from "../../../store/admin/blogSlice";
import { useDispatch, useSelector } from "react-redux";

export async function detectImageMimeTypeWithFallback(image, filename) {
  // First try magic byte detection
  const mimeType = await detectImageMimeType(image);
  if (mimeType) {
    return mimeType;
  }

  // Fallback to file extension if filename is provided
  if (filename) {
    const extension = filename.toLowerCase().split(".").pop();
    const extensionMap = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      svg: "image/svg+xml",
      tiff: "image/tiff",
      tif: "image/tiff",
      ico: "image/x-icon",
      avif: "image/avif",
      heic: "image/heic",
      heif: "image/heif",
    };
    return extensionMap[extension] || null;
  }

  return null;
}

export async function detectImageMimeType(image) {
  try {
    let bytes;

    // Convert different input types to Uint8Array
    if (image instanceof File || image instanceof Blob) {
      const arrayBuffer = await image.arrayBuffer();
      bytes = new Uint8Array(arrayBuffer);
    } else if (image instanceof ArrayBuffer) {
      bytes = new Uint8Array(image);
    } else if (image instanceof Uint8Array) {
      bytes = image;
    } else if (Buffer && Buffer.isBuffer(image)) {
      bytes = new Uint8Array(image);
    } else {
      throw new Error("Unsupported image input type");
    }

    // Ensure we have enough bytes to check signatures
    if (bytes.length < 12) {
      return null;
    }

    // Helper function to check if bytes match a signature
    const checkSignature = (signature, offset = 0) => {
      for (let i = 0; i < signature.length; i++) {
        if (bytes[offset + i] !== signature[i]) {
          return false;
        }
      }
      return true;
    };

    // JPEG: FF D8 FF
    if (checkSignature([0xff, 0xd8, 0xff])) {
      return "image/jpeg";
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (checkSignature([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
      return "image/png";
    }

    // GIF87a or GIF89a: 47 49 46 38 [37|39] 61
    if (
      checkSignature([0x47, 0x49, 0x46, 0x38]) &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) &&
      bytes[5] === 0x61
    ) {
      return "image/gif";
    }

    // WebP: 52 49 46 46 [4 bytes] 57 45 42 50
    if (
      checkSignature([0x52, 0x49, 0x46, 0x46]) &&
      checkSignature([0x57, 0x45, 0x42, 0x50], 8)
    ) {
      return "image/webp";
    }

    // BMP: 42 4D
    if (checkSignature([0x42, 0x4d])) {
      return "image/bmp";
    }

    // TIFF (Little Endian): 49 49 2A 00
    if (checkSignature([0x49, 0x49, 0x2a, 0x00])) {
      return "image/tiff";
    }

    // TIFF (Big Endian): 4D 4D 00 2A
    if (checkSignature([0x4d, 0x4d, 0x00, 0x2a])) {
      return "image/tiff";
    }

    // ICO: 00 00 01 00
    if (checkSignature([0x00, 0x00, 0x01, 0x00])) {
      return "image/x-icon";
    }

    // AVIF: Check for 'ftyp' box with AVIF brand
    if (
      bytes.length >= 12 &&
      checkSignature([0x66, 0x74, 0x79, 0x70], 4) && // 'ftyp'
      (checkSignature([0x61, 0x76, 0x69, 0x66], 8) || // 'avif'
        checkSignature([0x61, 0x76, 0x69, 0x73], 8))
    ) {
      // 'avis'
      return "image/avif";
    }

    // SVG: Check for XML declaration or <svg tag
    const textDecoder = new TextDecoder("utf-8");
    const firstChars = textDecoder.decode(
      bytes.slice(0, Math.min(100, bytes.length))
    );
    if (
      firstChars.includes("<svg") ||
      (firstChars.includes("<?xml") && firstChars.includes("svg"))
    ) {
      return "image/svg+xml";
    }

    // HEIC/HEIF: Check for 'ftyp' box with HEIC/HEIF brand
    if (bytes.length >= 12 && checkSignature([0x66, 0x74, 0x79, 0x70], 4)) {
      // 'ftyp'
      const brand = textDecoder.decode(bytes.slice(8, 12));
      if (
        brand === "heic" ||
        brand === "heix" ||
        brand === "hevc" ||
        brand === "hevx" ||
        brand === "heim" ||
        brand === "heis" ||
        brand === "hevm" ||
        brand === "hevs" ||
        brand === "mif1"
      ) {
        return "image/heic";
      }
      if (brand === "heif" || brand === "heif") {
        return "image/heif";
      }
    }

    return null; // Unknown image format
  } catch (error) {
    console.error("Error detecting image MIME type:", error);
    return null;
  }
}
const insertHyperlink = (text, startPos, endPos, url, linkText = null) => {
  const selectedText = linkText || text.substring(startPos, endPos);
  const linkMarkdown = `[${selectedText}](${url})`;
  return text?.substring(0, startPos) + linkMarkdown + text?.substring(endPos);
};
const parseTextWithLinks = (text, colors) => {
  if (!text) return text;

  // Use theme's primary color instead of hardcoded blue
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" style="color: ${colors.primary}; text-decoration: underline; font-weight: 500;">$1</a>`);
};

const HyperlinkModal = ({ isOpen, onClose, onInsert, selectedText, colors }) => {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState(selectedText || '');

  useEffect(() => {
    if (isOpen) {
      setLinkText(selectedText || '');
      setUrl('');
    }
  }, [isOpen, selectedText]);

  const handleInsert = () => {
    if (url && linkText) {
      onInsert(url, linkText);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
            className="bg-white rounded-lg p-6 w-96 max-w-full mx-4"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
            }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium" style={{ color: colors.text }}>
              Insert Hyperlink
            </h3>
            <button
                onClick={onClose}
                className="p-1 rounded"
                style={{ color: colors.textMuted }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
              >
                Link Text
              </label>
              <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none"
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
                URL
              </label>
              <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.borderColor}`,
                    color: colors.text,
                  }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
            >
              Cancel
            </button>
            <button
                onClick={handleInsert}
                disabled={!url || !linkText}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.lightText,
                  opacity: (!url || !linkText) ? 0.5 : 1,
                }}
            >
              Insert Link
            </button>
          </div>
        </div>
      </div>
  );
};
const BlogForm = ({ blog = null, onCancel, onSaved }) => {
  const dispatch = useDispatch();
  const { blogDetails, loading } = useSelector((state) => state.blogs);
  const { colors } = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const featuredImageInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [hyperlinkModal, setHyperlinkModal] = useState({
    isOpen: false,
    sectionIndex: null,
    selectedText: '',
    selectionStart: 0,
    selectionEnd: 0,
  });

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

  // New function to get signed URL from API
  const getSignedImageUploadUrl = async (file) => {
    try {
      // Detect MIME type from the file
      const mimeType = await detectImageMimeTypeWithFallback(file, file.name);

      if (!mimeType) {
        throw new Error("Could not determine image MIME type");
      }

      // Get auth token from localStorage or your auth mechanism
      const token = localStorage.getItem("token");

      // Make API call to get signed URL
      const response = await fetch(
        "https://cravta.com/api/v1/admin-blogs/images",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mimeType }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get upload URL: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw error;
    }
  };

  // New function to upload to S3
  const uploadImageToS3 = async (file, uploadUrl) => {
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload to S3: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
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
    if (blog?.id && blog.id !== blogDetails?.id) {
      dispatch(fetchBlogById(blog.id));
    }
  }, [blog?.id, blogDetails?.id, dispatch]);

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
  const handleOpenHyperlinkModal = (sectionIndex, textareaRef) => {
    const textarea = textareaRef.current;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);

    setHyperlinkModal({
      isOpen: true,
      sectionIndex,
      selectedText,
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd,
    });
  };
  const handleInsertHyperlink = (url, linkText) => {
    const { sectionIndex, selectionStart, selectionEnd } = hyperlinkModal;

    // Parse the sectionIndex to understand what we're updating
    if (typeof sectionIndex === 'string') {
      // Handle complex section types (FAQs, bullet points)
      const parts = sectionIndex.split('-');
      const mainIndex = parseInt(parts[0]);
      const section = formData.content[mainIndex];

      if (sectionIndex.includes('faq-question')) {
        // FAQ Question
        const faqIndex = parseInt(parts[parts.length - 1]);
        const currentText = section.content[faqIndex].question;
        const newText = insertHyperlink(currentText, selectionStart, selectionEnd, url, linkText);

        const newContent = [...section.content];
        newContent[faqIndex] = {
          ...newContent[faqIndex],
          question: newText,
        };
        updateContentSection(mainIndex, newContent);

      } else if (sectionIndex.includes('faq-answer')) {
        // FAQ Answer
        const faqIndex = parseInt(parts[parts.length - 1]);
        const currentText = section.content[faqIndex].answer;
        const newText = insertHyperlink(currentText, selectionStart, selectionEnd, url, linkText);

        const newContent = [...section.content];
        newContent[faqIndex] = {
          ...newContent[faqIndex],
          answer: newText,
        };
        updateContentSection(mainIndex, newContent);

      } else if (sectionIndex.includes('heading')) {
        // Bullet Points with Heading
        const itemIndex = parseInt(parts[parts.length - 1]);
        const currentText = section.content.items[itemIndex];
        const newText = insertHyperlink(currentText, selectionStart, selectionEnd, url, linkText);

        const newItems = [...(section.content.items || [])];
        newItems[itemIndex] = newText;
        updateContentSection(mainIndex, {
          ...section.content,
          items: newItems,
        });

      } else {
        // Regular bullet points or numbered lists
        const itemIndex = parseInt(parts[parts.length - 1]);
        const currentText = section.content[itemIndex];
        const newText = insertHyperlink(currentText, selectionStart, selectionEnd, url, linkText);

        const newContent = [...section.content];
        newContent[itemIndex] = newText;
        updateContentSection(mainIndex, newContent);
      }
    } else {
      // Handle simple section types (introduction, closing, subtitle, quote)
      const section = formData.content[sectionIndex];
      const currentText = section?.content;
      const newText = insertHyperlink(currentText, selectionStart, selectionEnd, url, linkText);
      updateContentSection(sectionIndex, newText);
    }

    setHyperlinkModal({ isOpen: false, sectionIndex: null, selectedText: '', selectionStart: 0, selectionEnd: 0 });
  };
  const handleImageUpload = async (index, file) => {
    try {
      // Update UI to show loading state
      const uploadId = `content-${index}`;
      setUploadProgress({
        ...uploadProgress,
        [uploadId]: { status: "loading", progress: 0 },
      });

      // Get signed URL
      const imageData = await getSignedImageUploadUrl(file);

      setUploadProgress({
        ...uploadProgress,
        [uploadId]: { status: "loading", progress: 50 },
      });

      // Upload to S3
      await uploadImageToS3(file, imageData.uploadImageURL);

      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Update content with ID and URL
      const newContent = {
        ...formData.content[index].content,
        url: imageUrl,
        file: file,
        imageId: imageData.id.id,
      };

      updateContentSection(index, newContent);

      setUploadProgress({
        ...uploadProgress,
        [uploadId]: { status: "success", progress: 100 },
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
      setUploadProgress({
        ...uploadProgress,
        [uploadId]: { status: "error", error: error.message },
      });
    }
  };

  const handleFeaturedImageUpload = async (file) => {
    try {
      // Update UI to show loading state
      setUploadProgress({
        ...uploadProgress,
        featured: { status: "loading", progress: 0 },
      });

      // Get signed URL
      const imageData = await getSignedImageUploadUrl(file);

      setUploadProgress({
        ...uploadProgress,
        featured: { status: "loading", progress: 50 },
      });

      // Upload to S3
      await uploadImageToS3(file, imageData.uploadImageURL);

      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Update with ID and URL
      setFormData({
        ...formData,
        featuredImage: {
          url: imageUrl,
          file: file,
          imageId: imageData.id.id,
        },
      });

      setUploadProgress({
        ...uploadProgress,
        featured: { status: "success", progress: 100 },
      });
    } catch (error) {
      console.error("Failed to upload featured image:", error);
      setUploadProgress({
        ...uploadProgress,
        featured: { status: "error", error: error.message },
      });
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const allTags = [
    'AI Learning',
    'Gamification',
    'Student Engagement',
    'EdTech',
    'Teaching Methods',
    'Assessment',
    'Personalization',
    'Online Learning'
  ];

  const selectedTags = formData.tags || [];

  const filteredTags = allTags.filter(tag =>
      tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const handleTagSelect = (tag) => {
    const newTags = [...selectedTags, tag];
    handleInputChange({
      target: {
        name: 'tags',
        value: newTags
      }
    });
    setSearchTerm('');
  };

  const handleTagRemove = (tagToRemove) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    handleInputChange({
      target: {
        name: 'tags',
        value: newTags
      }
    });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const renderContentEditor = (section, index) => {
    const { type, content } = section;

    switch (type) {
      case "introduction":
      case "closing":
      case "subtitle":
      case "quote":
        return (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <button
                    type="button"
                    onClick={() => {
                      // Find the textarea directly instead of using a ref
                      const textarea = document.querySelector(`[data-textarea-index="${index}"]`);
                      if (textarea) {
                        handleOpenHyperlinkModal(index, { current: textarea });
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.textMuted,
                    }}
                    title="Add hyperlink to selected text"
                >
                  <Link className="w-3 h-3" />
                  Link
                </button>
                <span className="text-xs" style={{ color: colors.textMuted }}>
              Select text and click Link to add hyperlink
            </span>
              </div>
              <textarea
                  data-textarea-index={index} // Add this data attribute
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
              {/* Preview with links */}
              {content && (
                  <div
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: `${colors.primary}10`,
                        border: `1px solid ${colors.primary}30`,
                        color: colors.text,
                      }}
                      dangerouslySetInnerHTML={{ __html: parseTextWithLinks(content, colors) }}
                  />
              )}
            </div>
        );

      case "bulletPoints":
      case "numberedList":
        return (
            <div className="space-y-2">
              {content.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                          type="button"
                          onClick={() => {
                            const input = document.querySelector(`[data-bullet-index="${index}-${itemIndex}"]`);
                            if (input) {
                              handleOpenHyperlinkModal(`${index}-${itemIndex}`, { current: input });
                            }
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.textMuted,
                          }}
                          title="Add hyperlink to selected text"
                      >
                        <Link className="w-3 h-3" />
                        Link
                      </button>
                      <span className="text-xs" style={{ color: colors.textMuted }}>
                  Select text and click Link to add hyperlink
                </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                          data-bullet-index={`${index}-${itemIndex}`}
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
                    {/* Preview with links for bullet points */}
                    {item && (
                        <div
                            className="px-4 py-2 rounded-lg text-sm ml-4"
                            style={{
                              backgroundColor: `${colors.primary}10`,
                              border: `1px solid ${colors.primary}30`,
                              color: colors.text,
                            }}
                            dangerouslySetInnerHTML={{ __html: parseTextWithLinks(item, colors) }}
                        />
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
                    <div key={itemIndex} className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                            type="button"
                            onClick={() => {
                              const input = document.querySelector(`[data-bullet-heading-index="${index}-${itemIndex}"]`);
                              if (input) {
                                handleOpenHyperlinkModal(`${index}-heading-${itemIndex}`, { current: input });
                              }
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: colors.inputBg,
                              border: `1px solid ${colors.borderColor}`,
                              color: colors.textMuted,
                            }}
                            title="Add hyperlink to selected text"
                        >
                          <Link className="w-3 h-3" />
                          Link
                        </button>
                        <span className="text-xs" style={{ color: colors.textMuted }}>
                    Select text and click Link to add hyperlink
                  </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                            data-bullet-heading-index={`${index}-${itemIndex}`}
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
                      {/* Preview with links for bullet points with heading */}
                      {item && (
                          <div
                              className="px-4 py-2 rounded-lg text-sm ml-4"
                              style={{
                                backgroundColor: `${colors.primary}10`,
                                border: `1px solid ${colors.primary}30`,
                                color: colors.text,
                              }}
                              dangerouslySetInnerHTML={{ __html: parseTextWithLinks(item, colors) }}
                          />
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
                      {/* Question section with hyperlink */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                              type="button"
                              onClick={() => {
                                const input = document.querySelector(`[data-faq-question-index="${index}-${faqIndex}"]`);
                                if (input) {
                                  handleOpenHyperlinkModal(`${index}-faq-question-${faqIndex}`, { current: input });
                                }
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.textMuted,
                              }}
                              title="Add hyperlink to selected text in question"
                          >
                            <Link className="w-3 h-3" />
                            Link
                          </button>
                          <span className="text-xs" style={{ color: colors.textMuted }}>
                      Select text in question and click Link to add hyperlink
                    </span>
                        </div>
                        <input
                            data-faq-question-index={`${index}-${faqIndex}`}
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
                        {/* Preview with links for question */}
                        {faqItem.question && (
                            <div
                                className="px-4 py-2 rounded-lg text-sm"
                                style={{
                                  backgroundColor: `${colors.primary}10`,
                                  border: `1px solid ${colors.primary}30`,
                                  color: colors.text,
                                }}
                                dangerouslySetInnerHTML={{ __html: parseTextWithLinks(faqItem.question, colors) }}
                            />
                        )}
                      </div>

                      {/* Answer section with hyperlink */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                              type="button"
                              onClick={() => {
                                const textarea = document.querySelector(`[data-faq-answer-index="${index}-${faqIndex}"]`);
                                if (textarea) {
                                  handleOpenHyperlinkModal(`${index}-faq-answer-${faqIndex}`, { current: textarea });
                                }
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.textMuted,
                              }}
                              title="Add hyperlink to selected text in answer"
                          >
                            <Link className="w-3 h-3" />
                            Link
                          </button>
                          <span className="text-xs" style={{ color: colors.textMuted }}>
                      Select text in answer and click Link to add hyperlink
                    </span>
                        </div>
                        <textarea
                            data-faq-answer-index={`${index}-${faqIndex}`}
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
                        {/* Preview with links for answer */}
                        {faqItem.answer && (
                            <div
                                className="px-4 py-2 rounded-lg text-sm"
                                style={{
                                  backgroundColor: `${colors.primary}10`,
                                  border: `1px solid ${colors.primary}30`,
                                  color: colors.text,
                                }}
                                dangerouslySetInnerHTML={{ __html: parseTextWithLinks(faqItem.answer, colors) }}
                            />
                        )}
                      </div>

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
                              imageId: null,
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

                {/* Upload progress indicator */}
                {uploadProgress[`content-${index}`]?.status === "loading" && (
                    <div className="text-center mt-2">
                      <p style={{ color: colors.textMuted }}>
                        Uploading image...{" "}
                        {uploadProgress[`content-${index}`].progress}%
                      </p>
                    </div>
                )}

                {uploadProgress[`content-${index}`]?.status === "error" && (
                    <div className="text-center mt-2">
                      <p style={{ color: colors.error }}>
                        {uploadProgress[`content-${index}`].error ||
                            "Upload failed"}
                      </p>
                    </div>
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
                            file: null,
                            imageId: null,
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

                {content.imageId && (
                    <div>
                      <label
                          className="block text-xs mb-1"
                          style={{ color: colors.textMuted }}
                      >
                        Image ID
                      </label>
                      <input
                          type="text"
                          value={content.imageId || ""}
                          readOnly
                          className="w-full px-4 py-2 rounded-lg focus:outline-none bg-gray-100"
                          style={{
                            backgroundColor: `${colors.inputBg}80`,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.textMuted,
                          }}
                      />
                    </div>
                )}
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
      // Prepare the data with image IDs
      const preparedData = {
        ...formData,
        featuredImageId: formData.featuredImage?.imageId,
        // Map through content to extract imageIds from image sections
        content: formData.content.map((section) => {
          if (section.type === "image" && section.content.imageId) {
            // Keep the imageId for the API
            return {
              ...section,
              content: {
                ...section.content,
                imageId: section.content.imageId,
              },
            };
          }
          return section;
        }),
      };

      if (blog) {
        dispatch(updateBlog({ id: blog.id, blogData: preparedData }));
        onSaved();
      } else {
        dispatch(createBlog(preparedData));
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
                        style={{color: colors.text}}
                    >
                      Blog Title <span style={{color: colors.error}}>*</span>
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
                        style={{color: colors.text}}
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
                      style={{color: colors.text}}
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
                      style={{color: colors.text}}
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
                <div>
                  <label
                      className="block text-sm font-medium mb-2"
                      style={{color: colors.text}}
                  >
                    Tags
                  </label>

                  <div className="relative" ref={dropdownRef}>
                    {/* Selected tags display */}
                    <div
                        className="w-full min-h-[42px] px-4 py-2 rounded-lg focus-within:outline-none cursor-text flex flex-wrap gap-2 items-center"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                        }}
                        onClick={() => setIsOpen(true)}
                    >
                      {selectedTags.map((tag, index) => (
                          <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                              style={{
                                backgroundColor: colors.borderColor,
                                color: colors.text,
                              }}
                          >
              {tag}
                            <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagRemove(tag);
                                }}
                                className="hover:opacity-70 ml-1"
                            >
                ×
              </button>
            </span>
                      ))}

                      {/* Search input */}
                      <input
                          ref={searchInputRef}
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() => setIsOpen(true)}
                          placeholder={selectedTags.length === 0 ? "Search and select tags..." : "Add more tags..."}
                          className="flex-1 min-w-[120px] bg-transparent outline-none"
                          style={{color: colors.text}}
                      />
                    </div>

                    {/* Dropdown */}
                    {isOpen && (
                        <div
                            className="absolute z-50 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                            style={{
                              backgroundColor: colors.inputBg,
                              border: `1px solid ${colors.borderColor}`,
                            }}
                        >
                          {filteredTags.length > 0 ? (
                              filteredTags.map((tag, index) => (
                                  <div
                                      key={index}
                                      className="px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity"
                                      style={{color: colors.text}}
                                      onClick={() => handleTagSelect(tag)}
                                  >
                                    {tag}
                                  </div>
                              ))
                          ) : (
                              <div
                                  className="px-4 py-2 opacity-50"
                                  style={{color: colors.text}}
                              >
                                {searchTerm ? 'No matching tags found' : 'No more tags available'}
                              </div>
                          )}
                        </div>
                    )}
                  </div>

                  <p className="text-xs mt-1 opacity-70" style={{color: colors.text}}>
                    Search and click to add tags. Click × to remove.
                  </p>
                </div>
                {/* Meta Description */}
                <div>
                  <label
                      className="block text-sm font-medium mb-2"
                      style={{color: colors.text}}
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
                                  style={{color: colors.error}}
                              >
                                <Trash2 className="w-4 h-4"/>
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
                      style={{color: colors.text}}
                  >
                    Featured Image
                  </label>
                  <div
                      className="border-2 border-dashed rounded-lg p-4 text-center"
                      style={{borderColor: colors.borderColor}}
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
                              style={{transform: "translate(50%, -50%)"}}
                          >
                            <X className="w-3 h-3"/>
                          </button>
                        </div>
                    ) : (
                        <>
                          <Upload
                              className="mx-auto mb-2"
                              style={{color: colors.textMuted}}
                          />
                          <p
                              className="text-sm"
                              style={{color: colors.textMuted}}
                          >
                            Drag and drop an image here, or{" "}
                            <button
                                type="button"
                                className="font-medium"
                                style={{color: colors.primary}}
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
                                    e.target.value = "";
                                  }
                                }}
                            />
                          </p>
                        </>
                    )}
                    <p
                        className="text-xs mt-1"
                        style={{color: colors.textMuted}}
                    >
                      Recommended size: 1200x630px, max 2MB
                    </p>

                    {/* Upload progress indicator */}
                    {uploadProgress["featured"]?.status === "loading" && (
                        <div className="text-center mt-2">
                          <p style={{color: colors.textMuted}}>
                            Uploading image...{" "}
                            {uploadProgress["featured"].progress}%
                          </p>
                        </div>
                    )}

                    {uploadProgress["featured"]?.status === "error" && (
                        <div className="text-center mt-2">
                          <p style={{color: colors.error}}>
                            {uploadProgress["featured"].error || "Upload failed"}
                          </p>
                        </div>
                    )}

                    {formData.featuredImage?.imageId && (
                        <div className="text-center mt-2">
                          <p
                              className="text-xs"
                              style={{color: colors.textMuted}}
                          >
                            Image ID: {formData.featuredImage.imageId}
                          </p>
                        </div>
                    )}
                  </div>
                </div>

                {/* Blog Content Sections */}
                <div>
                  <label
                      className="block text-sm font-medium mb-4"
                      style={{color: colors.text}}
                  >
                    Blog Content <span style={{color: colors.error}}>*</span>
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
                                    style={{color: colors.primary}}
                                />
                                <h4
                                    className="font-medium"
                                    style={{color: colors.text}}
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
                                        style={{color: colors.textMuted}}
                                    >
                                      <ArrowUp className="w-4 h-4"/>
                                    </button>
                                )}
                                {index < formData.content.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => moveSection(index, "down")}
                                        className="p-1 rounded"
                                        style={{color: colors.textMuted}}
                                    >
                                      <ArrowDown className="w-4 h-4"/>
                                    </button>
                                )}
                                {!isIntroduction && (
                                    <button
                                        type="button"
                                        onClick={() => removeContentSection(index)}
                                        className="p-1 rounded"
                                        style={{color: colors.error}}
                                    >
                                      <Trash2 className="w-4 h-4"/>
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
                        style={{color: colors.textMuted}}
                    >
                      Add new section:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(SECTION_TYPES).map(
                          ([type, {icon: Icon, label, mandatory}]) => {
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
                                  <Icon className="w-4 h-4"/>
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
                  style={{borderColor: colors.borderColor}}
              >
                <h3
                    className="text-lg font-medium"
                    style={{color: colors.text}}
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
                                <div
                                    className="px-2 py-1 rounded text-sm font-medium mb-1"
                                    style={{
                                      backgroundColor: `${colors.primary}05`,
                                      color: colors.text,
                                    }}
                                    dangerouslySetInnerHTML={{__html: parseTextWithLinks(faq.question, colors) }}
                                />
                                <div
                                    className="px-2 py-1 rounded text-sm"
                                    style={{
                                      backgroundColor: `${colors.primary}05`,
                                      color: colors.text,
                                    }}
                                    dangerouslySetInnerHTML={{__html: parseTextWithLinks(faq.answer, colors) }}
                                />
                              </div>
                          ))}
                      {(section.type === "bulletPoints" ||
                          section.type === "numberedList") && (
                          <ul className={section.type === "numberedList" ? "list-decimal" : "list-disc"}
                              style={{paddingLeft: "20px"}}>
                            {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} style={{marginBottom: "4px"}}>
                                  <span dangerouslySetInnerHTML={{__html: parseTextWithLinks(item, colors) }}></span>
                                </li>
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
                                      <li
                                          key={itemIndex}
                                          dangerouslySetInnerHTML={{ __html: parseTextWithLinks(item, colors) }}
                                      />
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
                          <div
                              className={section.type === "quote" ? "italic" : ""}
                              dangerouslySetInnerHTML={{ __html: parseTextWithLinks(section.content, colors) }}
                          />
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

      <HyperlinkModal
          isOpen={hyperlinkModal.isOpen}
          onClose={() => setHyperlinkModal({ isOpen: false, sectionIndex: null, selectedText: '', selectionStart: 0, selectionEnd: 0 })}
          onInsert={handleInsertHyperlink}
          selectedText={hyperlinkModal.selectedText}
          colors={colors}
      />
    </div>
  );
};

export default BlogForm;
