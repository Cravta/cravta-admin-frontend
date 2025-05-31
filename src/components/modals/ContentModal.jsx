import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  AlertCircle,
  Info,
  Check,
  XCircle,
  FileText as FileTextIcon,
  Loader,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { createContent } from "../../store/admin/contentSlice.js";
import { toast } from "react-toastify";
import axios from "axios";
import {useAppSettings} from "../../contexts/AppSettingsProvider.jsx";

const UploadModal = ({ showModal, setShowModal, onSuccess }) => {
  const dispatch = useDispatch();
  const { isDarkMode, colors } = useAppSettings();

  // State variables for form and file
  const [fileName, setFileName] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [contentLanguage, setContentLanguage] = useState("");
  const [contentType, setContentType] = useState("");
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState("idle"); // idle, uploading, success, error
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get userId and classId from localStorage
  const [userId, setUserId] = useState(null);

  // Get loading state from Redux
  const { loading } = useSelector(
    (state) => state.content || { loading: false }
  );
  const {user} =useSelector((state) => state.auth);
  
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);
  useEffect(() => {
    if (!userId && user?.id) {
        localStorage.setItem("userId", user.id);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset error states
      setFileTypeError(false);
      setFileSizeError(false);

      // Check if PDF
      if (file.type === "application/pdf") {
        // Check file size (5MB = 5 * 1024 * 1024 bytes)
        if (file.size <= 5 * 1024 * 1024) {
          setSelectedFile(file);
          if (!fileName) {
            setFileName(file.name.split(".")[0]); // Set filename without extension
          }
          setContentType("document");
        } else {
          setFileSizeError(true);
          setSelectedFile(null);
        }
      } else {
        setFileTypeError(true);
        setSelectedFile(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];

      // Reset error states
      setFileTypeError(false);
      setFileSizeError(false);

      // Check if PDF
      if (file.type === "application/pdf") {
        // Check file size (5MB = 5 * 1024 * 1024 bytes)
        if (file.size <= 5 * 1024 * 1024) {
          setSelectedFile(file);
          if (!fileName) {
            setFileName(file.name.split(".")[0]); // Set filename without extension
          }
          setContentType("document");
        } else {
          setFileSizeError(true);
          setSelectedFile(null);
        }
      } else {
        setFileTypeError(true);
        setSelectedFile(null);
      }
    }
  };

  const resetUploadForm = () => {
    setFileName("");
    setMaterialDescription("");
    setContentLanguage("");
    setContentType("");
    setSelectedFile(null);
    setFileTypeError(false);
    setFileSizeError(false);
    setUploadProgress(0);
    setUploadState("idle");
    setErrorMessage("");
    setShowAdvanced(false);
  };

  const handleUploadSubmit = async () => {
    // Validation
    if (!fileName || !contentLanguage || !contentType || !selectedFile) {
      setErrorMessage("Please fill in all required fields before submitting!");
      return;
    }

    if (!userId) {
      setErrorMessage("User ID is required!");
      return;
    }

    try {
      setUploadState("uploading");
      setUploadProgress(0);
      setErrorMessage("");

      // Directly create content using axios instead of redux to have more control
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Format the data according to API requirements
      const contentData = {
        userId,
        // classId,
        contentName: fileName,
        contentLanguage,
        contentType,
        description: materialDescription || "No description provided",
      };

      // Create progress interval
      const uploadProgressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 40) {
            clearInterval(uploadProgressInterval);
            return 40; // Hold at 40% until API response
          }
          return prev + 5;
        });
      }, 150);

      try {
        const response = await dispatch(
          createContent({ userId, contentData })
        ).unwrap();
        if (!response.data || !response.URL) {
          clearInterval(uploadProgressInterval);
          throw new Error("Invalid response from server: Missing data or URL");
        }

        const { data, URL } = response;

        setUploadProgress(50);

        // Step 2: Upload file to S3
        // Create a new progress interval for file upload
        const fileUploadInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(fileUploadInterval);
              return 90; // Hold at 90% until actual upload completes
            }
            return prev + 5;
          });
        }, 150);

        try {
          // Actual file upload
          const uploadResponse = await fetch(URL, {
            method: "PUT",
            body: selectedFile,
            headers: {
              "Content-Type": selectedFile.type,
              "x-amz-acl": "private",
            },
          });

          clearInterval(fileUploadInterval);

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`File upload failed: ${errorText}`);
          }

          // Complete progress and show success
          setUploadProgress(100);
          setUploadState("success");

          // Refresh content list if onSuccess callback exists
          if (onSuccess && typeof onSuccess === "function") {
            onSuccess();
          }

          toast.success("Material uploaded successfully!");
        } catch (error) {
          clearInterval(fileUploadInterval);
          console.error("File Upload Error:", error);
          setErrorMessage(
            `File upload failed: ${error.message || "Unknown error"}`
          );
          setUploadState("error");
          toast.error("Failed to upload file");
        }
      } catch (error) {
        clearInterval(uploadProgressInterval);
        console.error("Content Creation Error:", error.response?.data || error);
        let errorMsg = "Failed to create content entry";

        if (error.response) {
          // Get detailed error from response if available
          errorMsg =
            error.response.data.message || error.response.data || errorMsg;
        }

        setErrorMessage(errorMsg);
        setUploadState("error");
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("General Error:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
      setUploadState("error");
      toast.error("Upload process failed");
    }
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <div
        className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.cardBgAlt, maxHeight: "90vh" }}
      >
        {/* Modal Header */}
        <div
          className="flex justify-between items-center p-5 border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
            Upload Learning Material
          </h3>
          <button
            onClick={() => {
              setShowModal(false);
              resetUploadForm();
            }}
            className="p-1 rounded-full hover:bg-opacity-20"
            style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Modal Content */}
        <div
          className="p-5 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 130px)" }}
        >
          {uploadState === "idle" ? (
            <>
              <p
                className="text-sm mb-5"
                style={{
                  color: isDarkMode ? colors.terColor : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Upload PDF documents for your class.
              </p>

              {/* File Upload Area */}
              <div
                className="mb-5 p-6 rounded-lg text-center"
                style={{
                  backgroundColor: colors.cardBg,
                  border:
                    fileTypeError || fileSizeError
                      ? `1px dashed ${colors.error}`
                      : `1px dashed ${colors.borderColor}`,
                  borderWidth: "2px",
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div>
                    <div className="flex items-center justify-center mb-3">
                      <FileTextIcon
                        className="w-10 h-10"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <p className="mb-2" style={{ color: colors.text }}>
                      {selectedFile.name}
                    </p>
                    <p
                      className="text-sm mb-4"
                      style={{
                        color: isDarkMode
                          ? colors.terColor
                          : "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: "transparent",
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                      onClick={() => {
                        setSelectedFile(null);
                        setFileTypeError(false);
                        setFileSizeError(false);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload
                      className="w-12 h-12 mx-auto mb-3"
                      style={{
                        color: isDarkMode
                          ? colors.terColor5
                          : "rgba(0, 0, 0, 0.2)",
                      }}
                    />
                    <p className="mb-2" style={{ color: colors.text }}>
                      Drag and drop your file here
                    </p>
                    <p
                      className="text-sm mb-4"
                      style={{
                        color: isDarkMode
                          ? colors.terColor
                          : "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      Supported format: PDF files only (max 5MB)
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                    />
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.cardBg,
                      }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      Browse Files
                    </button>
                  </>
                )}
              </div>

              {fileTypeError && (
                <div
                  className="p-3 mb-5 rounded-lg flex items-start"
                  style={{
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    border: `1px solid ${colors.error}`,
                  }}
                >
                  <AlertCircle
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    style={{ color: colors.error }}
                  />
                  <p className="text-sm" style={{ color: colors.error }}>
                    Unsupported file format. Please upload a PDF file only.
                  </p>
                </div>
              )}

              {fileSizeError && (
                <div
                  className="p-3 mb-5 rounded-lg flex items-start"
                  style={{
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    border: `1px solid ${colors.error}`,
                  }}
                >
                  <AlertCircle
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    style={{ color: colors.error }}
                  />
                  <p className="text-sm" style={{ color: colors.error }}>
                    File size exceeds the 5MB limit. Please upload a smaller
                    file.
                  </p>
                </div>
              )}

              {errorMessage && (
                <div
                  className="p-3 mb-5 rounded-lg flex items-start"
                  style={{
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    border: `1px solid ${colors.error}`,
                  }}
                >
                  <AlertCircle
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    style={{ color: colors.error }}
                  />
                  <p className="text-sm" style={{ color: colors.error }}>
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Material Details Form */}
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{
                      color: isDarkMode ? colors.terColor : "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Material Name *
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter a name for this material"
                    className="w-full p-3 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{
                      color: isDarkMode ? colors.terColor : "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    value={materialDescription}
                    onChange={(e) => setMaterialDescription(e.target.value)}
                    placeholder="Add a description of this material"
                    className="w-full p-3 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{
                      color: isDarkMode ? colors.terColor : "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Language *
                  </label>
                  <select
                    value={contentLanguage}
                    onChange={(e) => setContentLanguage(e.target.value)}
                    className="w-full p-3 rounded-lg appearance-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                      backgroundImage: isDarkMode
                        ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")"
                        : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23424242' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 10px center",
                      paddingRight: "30px",
                    }}
                  >
                    <option value="">Select Language</option>
                    <option value="english">English</option>
                    <option value="arabic">Arabic</option>
                    {/* <option value="french">French</option>
                    <option value="spanish">Spanish</option>
                    <option value="german">German</option>
                    <option value="chinese">Chinese</option>
                    <option value="japanese">Japanese</option>
                    <option value="other">Other</option> */}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      className="block text-sm"
                      style={{
                        color: isDarkMode
                          ? colors.terColor
                          : "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      Advanced Options
                    </label>
                    <button
                      className="text-sm font-medium"
                      style={{ color: colors.primary }}
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      {showAdvanced ? "Hide" : "Show"}
                    </button>
                  </div>

                  {showAdvanced ? (
                    <div
                      className="space-y-4 p-4 rounded-lg"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                      }}
                    >
                      <div>
                        <label
                          className="block text-sm mb-2"
                          style={{
                            color: isDarkMode
                              ? colors.terColor
                              : "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          Visibility
                        </label>
                        <select
                          className="w-full p-3 rounded-lg appearance-none"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                            backgroundImage: isDarkMode
                              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")"
                              : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23424242' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 10px center",
                            paddingRight: "30px",
                          }}
                        >
                          <option value="public">Public (All students)</option>
                          <option value="private">
                            Private (Selected students)
                          </option>
                          <option value="hidden">Hidden (Only me)</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="allowDownload"
                          className="mr-2"
                        />
                        <label
                          htmlFor="allowDownload"
                          className="text-sm"
                          style={{ color: colors.text }}
                        >
                          Allow students to download this material
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: "rgba(3, 218, 198, 0.1)",
                        border: `1px solid ${colors.accent}`,
                      }}
                    >
                      <div className="flex items-start">
                        <Info
                          className="w-4 h-4 mr-2 mt-0.5"
                          style={{ color: colors.accent }}
                        />
                        <p
                          className="text-xs"
                          style={{
                            color: isDarkMode
                              ? colors.terColor
                              : "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          You can set additional options like visibility,
                          release date, and student permissions after uploading.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="py-10">
              {uploadState === "uploading" && (
                <div className="text-center">
                  <div className="mb-6">
                    <div
                      className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                      style={{
                        background: `conic-gradient(${colors.primary} ${uploadProgress}%, transparent 0)`,
                        position: "relative",
                      }}
                    >
                      <div
                        className="absolute inset-2 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.cardBgAlt }}
                      >
                        <span
                          style={{
                            color: colors.primary,
                            fontWeight: "bold",
                          }}
                        >
                          {uploadProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <h4
                    className="text-lg font-medium mb-2"
                    style={{ color: colors.primary }}
                  >
                    Uploading Material...
                  </h4>
                  <p
                    className="text-sm"
                    style={{
                      color: isDarkMode ? colors.terColor : "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Please wait while your file is being uploaded
                  </p>
                </div>
              )}

              {uploadState === "success" && (
                <div className="text-center">
                  <div
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
                    style={{ backgroundColor: "rgba(76, 175, 80, 0.1)" }}
                  >
                    <Check
                      className="w-12 h-12"
                      style={{ color: colors.success }}
                    />
                  </div>
                  <h4
                    className="text-lg font-medium mb-2"
                    style={{ color: colors.success }}
                  >
                    Upload Complete!
                  </h4>
                  <p
                    className="text-sm mb-6"
                    style={{
                      color: isDarkMode ? colors.terColor : "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Your material has been successfully uploaded to the class
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: "transparent",
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                      onClick={() => resetUploadForm()}
                    >
                      Upload Another
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.cardBg,
                      }}
                      onClick={() => setShowModal(false)}
                    >
                      View Materials
                    </button>
                  </div>
                </div>
              )}

              {uploadState === "error" && (
                <div className="text-center">
                  <div
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
                    style={{ backgroundColor: "rgba(244, 67, 54, 0.1)" }}
                  >
                    <XCircle
                      className="w-12 h-12"
                      style={{ color: colors.error }}
                    />
                  </div>
                  <h4
                    className="text-lg font-medium mb-2"
                    style={{ color: colors.error }}
                  >
                    Upload Failed
                  </h4>
                  <p
                    className="text-sm mb-6"
                    style={{
                      color: isDarkMode ? colors.terColor : "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    {errorMessage ||
                      "There was a problem uploading your file. Please try again."}
                  </p>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.cardBg,
                    }}
                    onClick={() => setUploadState("idle")}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {uploadState === "idle" && (
          <div
            className="flex justify-end p-5 border-t"
            style={{ borderColor: colors.borderColor }}
          >
            <button
              onClick={() => {
                setShowModal(false);
                resetUploadForm();
              }}
              className="px-4 py-2 mr-3 rounded-lg text-sm"
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              style={{
                backgroundColor: colors.primary,
                color: colors.cardBg,
                opacity:
                  !selectedFile || !fileName || !contentLanguage || loading
                    ? 0.6
                    : 1,
                cursor:
                  !selectedFile || !fileName || !contentLanguage || loading
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={
                !selectedFile || !fileName || !contentLanguage || loading
              }
              onClick={handleUploadSubmit}
            >
              {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              Upload Material
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
