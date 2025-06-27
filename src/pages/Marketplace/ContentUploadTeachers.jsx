import React, { useState, useEffect } from "react";
import {
  Bell,
  Book,
  Calendar,
  FileText,
  Home,
  Settings,
  Moon,
  Sun,
  Upload,
  BookOpen,
  ChevronDown,
  X,
  Info,
  HelpCircle,
  Clock,
  DollarSign,
  Sparkles,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, clearError, clearSuccess } from "../../store/admin/market/productSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ContentUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scheduleLater, setScheduleLater] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    grade: "",
    content_type: "",
    price: "",
  });

  // Get loading and error states from Redux
  const { loading, error, success } = useSelector((state) => state.product);

  // Clear errors and success messages on component mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  // Show success toast when product is created
  useEffect(() => {
    if (success==="Product created successfully!") {
      toast.success(success);
    }
  }, [success]);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Colors for dark mode
  const colors = {
    primary: "#bb86fc",
    secondary: "#3700b3",
    accent: "#03dac6",
    accentLight: "#018786",
    accentSecondary: "#cf6679",
    text: "#e0e0e0",
    lightText: "#ffffff",
    background: "#121212",
    cardBg: "#1e1e1e",
    cardBgAlt: "#2d2d2d",
    borderColor: "#333333",
    sidebarBg: "#1a1a1a",
    navActiveBg: "rgba(187, 134, 252, 0.12)",
    inputBg: "#2d2d2d",
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        toast.error('File size must be less than 50MB');
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/zip',
        'application/x-zip-compressed'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, DOCX, PPTX, or ZIP file');
        return;
      }

      setUploadedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: file.type,
        file: file, // Store the actual file
      });
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Create a synthetic event to reuse the existing file upload logic
      const syntheticEvent = {
        target: {
          files: [file]
        }
      };
      handleFileUpload(syntheticEvent);
    }
  };

  // Validate form data
  const validateForm = () => {
    const requiredFields = ['title', 'description', 'subject', 'grade', 'content_type', 'price'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!uploadedFile) {
      toast.error('Please upload a content file');
      return false;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (isDraft = false) => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      
      // Add the file
      if (uploadedFile && uploadedFile.file) {
        submitFormData.append('file', uploadedFile.file);
      }
      
      // Add other form data
      submitFormData.append('title', formData.title);
      submitFormData.append('price', parseFloat(formData.price));
      submitFormData.append('description', formData.description);
      submitFormData.append('grade', formData.grade);
      submitFormData.append('subject', formData.subject);
      submitFormData.append('content_type', formData.content_type);

      const result = await dispatch(createProduct(formData));
      
      if (createProduct.fulfilled.match(result)) {
        // Navigate to marketplace after successful creation
        navigate('/market/marketplace');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle publish now button
  const handlePublishNow = () => {
    handleSubmit(false);
  };

  // Handle save as draft button
  const handleSaveDraft = () => {
    handleSubmit(true);
  };

  return (
    <div
      className="flex"
      style={{ backgroundColor: colors.background }}
    >

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Upload Content Form */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Upload Form */}
            <div className="col-span-2">
              <div
                className="rounded-lg shadow-md p-6 mb-6"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h3
                  className="text-lg font-medium mb-6"
                  style={{ color: colors.primary }}
                >
                  Content Information
                </h3>

                {/* Title */}
                <div className="mb-5">
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: colors.text }}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter content title"
                    className="w-full p-3 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  />
                </div>

                {/* Description */}
                <div className="mb-5">
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: colors.text }}
                  >
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed description of your content"
                    rows="4"
                    className="w-full p-3 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  />
                </div>

                {/* Subject and Class Level */}
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label
                      className="block mb-2 font-medium"
                      style={{ color: colors.text }}
                    >
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg appearance-none"
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        border: `1px solid ${colors.borderColor}`,
                      }}
                    >
                      <option value="">Select Subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block mb-2 font-medium"
                      style={{ color: colors.text }}
                    >
                      Class/Grade Level *
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg appearance-none"
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        border: `1px solid ${colors.borderColor}`,
                      }}
                    >
                      <option value="">Select Grade Level</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                  </div>
                </div>

                {/* Content Type and Price */}
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label
                      className="block mb-2 font-medium"
                      style={{ color: colors.text }}
                    >
                      Content Type *
                    </label>
                    <select
                      name="content_type"
                      value={formData.content_type}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg appearance-none"
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        border: `1px solid ${colors.borderColor}`,
                      }}
                    >
                      <option value="">Select Content Type</option>
                      <option value="Textbook">Textbook</option>
                      <option value="Workbook">Workbook</option>
                      <option value="Study Guide">Study Guide</option>
                      <option value="Practice Test">Practice Test</option>
                      <option value="Lecture Notes">Lecture Notes</option>
                      <option value="Reference Material">Reference Material</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block mb-2 font-medium"
                      style={{ color: colors.text }}
                    >
                      Price (Sparks) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price in Sparks"
                        className="w-full p-3 pl-10 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                          border: `1px solid ${colors.borderColor}`,
                        }}
                      />
                      <Sparkles
                        className="absolute left-3 top-3.5 w-4 h-4"
                        style={{ color: colors.accent }}
                      />
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "rgba(224, 224, 224, 0.5)" }}
                    >
                      Platform commission: 10% of sales
                    </p>
                  </div>
                </div>

                {/* Publication Schedule */}
                <div className="mb-5">
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: colors.text }}
                  >
                    Publication
                  </label>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="publish-now"
                        name="publish-time"
                        checked={!scheduleLater}
                        onChange={() => setScheduleLater(false)}
                        className="mr-2"
                        style={{ accentColor: colors.primary }}
                      />
                      <label
                        htmlFor="publish-now"
                        style={{ color: colors.text }}
                      >
                        Publish immediately
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="publish-later"
                        name="publish-time"
                        checked={scheduleLater}
                        onChange={() => setScheduleLater(true)}
                        className="mr-2"
                        style={{ accentColor: colors.primary }}
                      />
                      <label
                        htmlFor="publish-later"
                        style={{ color: colors.text }}
                      >
                        Schedule for later
                      </label>
                    </div>
                  </div>

                  {scheduleLater && (
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <input
                          type="date"
                          className="w-full p-3 rounded-lg"
                          style={{
                            backgroundColor: colors.inputBg,
                            color: colors.text,
                            border: `1px solid ${colors.borderColor}`,
                          }}
                        />
                      </div>
                      <div>
                        <input
                          type="time"
                          className="w-full p-3 rounded-lg"
                          style={{
                            backgroundColor: colors.inputBg,
                            color: colors.text,
                            border: `1px solid ${colors.borderColor}`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Image */}
                <div className="mb-5">
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: colors.text }}
                  >
                    Preview Image (Optional)
                  </label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center"
                    style={{ borderColor: "rgba(224, 224, 224, 0.3)" }}
                  >
                    <Upload
                      className="w-10 h-10 mb-3"
                      style={{ color: "rgba(224, 224, 224, 0.5)" }}
                    />
                    <p
                      className="text-center mb-2"
                      style={{ color: colors.text }}
                    >
                      Drag and drop an image file here, or click to browse
                    </p>
                    <p
                      className="text-xs text-center"
                      style={{ color: "rgba(224, 224, 224, 0.5)" }}
                    >
                      Recommended size: 800x600px, Max size: 2MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="preview-image"
                    />
                    <button
                      onClick={() =>
                        document.getElementById("preview-image").click()
                      }
                      className="mt-4 px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: "rgba(187, 134, 252, 0.1)",
                        color: colors.primary,
                        border: `1px solid ${colors.primary}`,
                      }}
                    >
                      Select Image
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: colors.text }}
                  >
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Add tags separated by commas (e.g., algebra, equations, homework)"
                    className="w-full p-3 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSubmitting || loading}
                    className="px-6 py-2 rounded-lg disabled:opacity-50"
                    style={{
                      backgroundColor: "transparent",
                      color: colors.text,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    {isSubmitting ? "Saving..." : "Save as Draft"}
                  </button>

                  <button
                    onClick={handlePublishNow}
                    disabled={isSubmitting || loading}
                    className="px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#000",
                    }}
                  >
                    {isSubmitting ? "Publishing..." : (scheduleLater ? "Schedule Upload" : "Publish Now")}
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "rgba(207, 102, 121, 0.1)" }}>
                    <p style={{ color: colors.accentSecondary }}>{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Upload and Guidelines */}
            <div className="col-span-1">
              {/* File Upload */}
              <div
                className="rounded-lg shadow-md p-6 mb-6"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: colors.primary }}
                >
                  Upload Content File *
                </h3>

                <div
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center mb-4"
                  style={{
                    borderColor: uploadedFile
                      ? colors.primary
                      : "rgba(224, 224, 224, 0.3)",
                    backgroundColor: uploadedFile
                      ? "rgba(187, 134, 252, 0.05)"
                      : "transparent",
                  }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {!uploadedFile ? (
                    <>
                      <Upload
                        className="w-12 h-12 mb-3"
                        style={{ color: "rgba(224, 224, 224, 0.5)" }}
                      />
                      <p
                        className="text-center mb-2"
                        style={{ color: colors.text }}
                      >
                        Drag and drop your file here
                      </p>
                      <p
                        className="text-xs text-center mb-4"
                        style={{ color: "rgba(224, 224, 224, 0.5)" }}
                      >
                        Supported formats: PDF, DOCX, PPTX, ZIP
                        <br />
                        Maximum file size: 50MB
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="content-file"
                        onChange={handleFileUpload}
                      />
                      <button
                        onClick={() =>
                          document.getElementById("content-file").click()
                        }
                        className="px-4 py-2 rounded-lg"
                        style={{
                          backgroundColor: "rgba(187, 134, 252, 0.1)",
                          color: colors.primary,
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        Select File
                      </button>
                    </>
                  ) : (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <FileText
                            className="w-8 h-8 mr-3"
                            style={{ color: colors.primary }}
                          />
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: colors.lightText }}
                            >
                              {uploadedFile.name}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "rgba(224, 224, 224, 0.5)" }}
                            >
                              {uploadedFile.size} · {uploadedFile.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setUploadedFile(null)}
                          className="p-1 rounded-full"
                          style={{
                            backgroundColor: "rgba(207, 102, 121, 0.1)",
                            color: colors.accentSecondary,
                          }}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div
                        className="w-full h-2 rounded-full mb-2"
                        style={{ backgroundColor: colors.inputBg }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: "100%",
                            backgroundColor: colors.primary,
                          }}
                        />
                      </div>

                      <p
                        className="text-xs text-right"
                        style={{ color: "rgba(224, 224, 224, 0.7)" }}
                      >
                        Upload complete
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: colors.navActiveBg,
                  }}
                >
                  <div className="flex items-start">
                    <Info
                      className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                      style={{ color: colors.accent }}
                    />
                    <div>
                      <p className="text-sm" style={{ color: colors.text }}>
                        Make sure your content is properly formatted and doesn't
                        contain any copyrighted material that you don't have
                        permission to use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div
                className="rounded-lg shadow-md p-6"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: colors.primary }}
                >
                  Content Guidelines
                </h3>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <HelpCircle
                      className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                      style={{ color: colors.primary }}
                    />
                    <p className="text-sm" style={{ color: colors.text }}>
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        Quality Standards:
                      </span>{" "}
                      Content should be well-organized, error-free, and valuable
                      to students.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Clock
                      className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                      style={{ color: colors.primary }}
                    />
                    <p className="text-sm" style={{ color: colors.text }}>
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        Review Process:
                      </span>{" "}
                      Content will be reviewed within 24-48 hours before
                      appearing on the marketplace.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <DollarSign
                      className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                      style={{ color: colors.primary }}
                    />
                    <p className="text-sm" style={{ color: colors.text }}>
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        Pricing:
                      </span>{" "}
                      Set competitive prices. Platform charges 10% commission on
                      all sales.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <Sparkles
                      className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                      style={{ color: colors.primary }}
                    />
                    <p className="text-sm" style={{ color: colors.text }}>
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        Earnings:
                      </span>{" "}
                      You'll receive Sparks for each sale, which can be
                      exchanged for Riyal (300 Sparks = 100 Riyals).
                    </p>
                  </li>
                </ul>

                <a
                  href="#"
                  className="block text-center mt-6 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgba(187, 134, 252, 0.1)",
                    color: colors.primary,
                  }}
                >
                  View Full Guidelines
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentUpload;
