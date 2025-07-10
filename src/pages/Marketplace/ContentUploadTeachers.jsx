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
  Plus
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, createProductSignedUrl, clearError, clearSuccess } from "../../store/admin/market/productSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ContentUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scheduleLater, setScheduleLater] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [productPreviewImages, setProductPreviewImages] = useState([]);
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
  // useEffect(() => {
  //   if (success && success.includes("successfully")) {
  //     // Only show toast for specific success messages, not all
  //     // We handle success messages manually in handleSubmit
  //     console.log('Success:', success);
  //   }
  // }, [success]);

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

   const handlePreviewImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB limit for preview images)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        toast.error('Preview image size must be less than 2MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPEG, PNG, or GIF image');
        return;
      }

      try {
        // Get signed URL for image upload
        const signedUrlData = {
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size
        };

        const signedUrlResult = await dispatch(createProductSignedUrl(signedUrlData));
        
        if (createProductSignedUrl.rejected.match(signedUrlResult)) {
          toast.error('Failed to get upload URL for preview image');
          return;
        }

        const signedUrl = signedUrlResult.payload.uploadDocURL;
        const imageId = signedUrlResult.payload.id.id;

        // Upload image to signed URL
        await uploadFileToSignedUrl(signedUrl, file);
        
        // Create preview URL for display
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewImage({
            file: file,
            url: event.target.result,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            imageId: imageId // Store the image ID for later use
          });
        };
        reader.readAsDataURL(file);

        toast.success('Preview image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading preview image:', error);
        toast.error('Failed to upload preview image');
      }
    }
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

  const handleProductPreviewImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5; // Maximum 5 images allowed

    if (productPreviewImages.length + files.length > maxImages) {
      toast.error(`You can upload maximum ${maxImages} images. You already have ${productPreviewImages.length} images.`);
      return;
    }

    for (const file of files) {
      // Check file size (2MB limit for preview images)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        toast.error(`${file.name} size must be less than 2MB`);
        continue;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format. Please upload JPEG, PNG, or GIF images.`);
        continue;
      }

      try {
        // Get signed URL for image upload
        const signedUrlData = {
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          isPreview: true
        };

        const signedUrlResult = await dispatch(createProductSignedUrl(signedUrlData));

        if (createProductSignedUrl.rejected.match(signedUrlResult)) {
          toast.error(`Failed to get upload URL for ${file.name}`);
          continue;
        }

        const signedUrl = signedUrlResult.payload.uploadDocURL;
        const imageId = signedUrlResult.payload.id.id;

        // Upload image to signed URL
        await uploadFileToSignedUrl(signedUrl, file);

        // Create preview URL for display
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            file: file,
            url: event.target.result,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            imageId: imageId // Store the image ID for later use
          };

          setProductPreviewImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (files.length > 0) {
      toast.success(`${files.length} image(s) uploaded successfully!`);
    }
  };

  const removeProductPreviewImage = (index) => {
    setProductPreviewImages(prev => prev.filter((_, i) => i !== index));
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
      let productId = null;

      // Step 1: Get signed URL and product_id first (if file is uploaded)
      if (uploadedFile && uploadedFile.file) {
        const signedUrlData = {
          file_name: uploadedFile.file.name,
          mimeType: uploadedFile.file.type,
          file_size: uploadedFile.file.size,
        };

        console.log('Requesting signed URL with data:', signedUrlData);
        const signedUrlResult = await dispatch(createProductSignedUrl(signedUrlData));
        console.log('Signed URL Result:', signedUrlResult);
        
        if (createProductSignedUrl.fulfilled.match(signedUrlResult)) {
          // Extract product_id from the signed URL response
          const responseData = signedUrlResult.payload;
          productId = responseData.id.id || responseData.productId;
          
          if (!productId) {
            toast.error('failed to upload product');
            console.error('Signed URL response:', responseData);
            return;
          }

          console.log('Received product ID:', productId);

          // Step 2: Upload file to the signed URL
          const signedUrl = responseData.uploadDocURL || responseData.signedUrl || responseData.url;
          
          if (!signedUrl) {
            toast.error('Invalid signed URL response - missing signed URL');
            console.error('Signed URL response:', responseData);
            return;
          }

          console.log('Received signed URL:', signedUrl);
          
          try {
            console.log('Uploading file to signed URL...');
            await uploadFileToSignedUrl(signedUrl, uploadedFile.file);
            console.log('File uploaded successfully to signed URL');
          } catch (uploadError) {
            toast.error('Failed to upload file to storage');
            console.error('File upload error:', uploadError);
            return;
          }
        } else {
          const errorMessage = signedUrlResult.payload || 'Failed to get signed URL for file upload';
          toast.error(errorMessage);
          console.error('Signed URL creation failed:', signedUrlResult);
          return;
        }
      } else {
        console.log('No file uploaded, proceeding without file upload');
      }

      // Step 3: Create the product with the product_id (if we have one)
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        grade: formData.grade,
        subject: formData.subject,
        content_type: formData.content_type,
        status: isDraft ? 'draft' : 'published',
        ...(productId && { product_id: productId }),
        ...(previewImage?.imageId && { image_array: [previewImage.imageId] }),
        ...(productPreviewImages.length > 0 && { 
          preview_images: productPreviewImages.map(img => img.imageId) 
        }),
      };

      console.log('Creating product with data:', productData);
      const productResult = await dispatch(createProduct(productData));
      console.log('Product Result:', productResult);
      
      if (createProduct.fulfilled.match(productResult)) {
        const successMessage = uploadedFile && uploadedFile.file 
          ? 'Product and file uploaded successfully!' 
          : 'Product created successfully!';
        toast.success(successMessage);
        // Navigate to marketplace after successful creation
        navigate('/market/marketplace');
      } else {
        toast.error(productResult.payload || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to upload file to signed URL
  const uploadFileToSignedUrl = async (signedUrl, file) => {
    try {
      if (!signedUrl || !file) {
        throw new Error('Missing signed URL or file');
      }

      const response = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
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
                {/* <div className="mb-5">
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
                </div> */}

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
                    style={{ 
                      borderColor: previewImage 
                        ? colors.primary 
                        : "rgba(224, 224, 224, 0.3)",
                      backgroundColor: previewImage
                        ? "rgba(187, 134, 252, 0.05)"
                        : "transparent",
                    }}
                  >
                    {!previewImage ? (
                      <>
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
                          onChange={handlePreviewImageUpload}
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
                      </>
                    ) : (
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <img
                              src={previewImage.url}
                              alt="Preview"
                              className="w-16 h-16 object-cover rounded mr-3"
                            />
                            <div>
                              <p
                                className="font-medium"
                                style={{ color: colors.lightText }}
                              >
                                {previewImage.name}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "rgba(224, 224, 224, 0.5)" }}
                              >
                                {previewImage.size}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setPreviewImage(null)}
                            className="p-1 rounded-full"
                            style={{
                              backgroundColor: "rgba(207, 102, 121, 0.1)",
                              color: colors.accentSecondary,
                            }}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {/* <button
                          onClick={() => document.getElementById("preview-image").click()}
                          className="w-full px-4 py-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: "rgba(187, 134, 252, 0.1)",
                            color: colors.primary,
                            border: `1px solid ${colors.primary}`,
                          }}
                        >
                          Change Image
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Preview Images */}
                <div className="mb-5">
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: colors.text }}
                  >
                    Product Preview Images (Optional)
                  </label>
                  <p
                    className="text-xs mb-3"
                    style={{ color: "rgba(224, 224, 224, 0.5)" }}
                  >
                    Upload up to 5 images to showcase your content. These will be displayed in the product gallery.
                  </p>

                  {/* Upload Area */}
                  {productPreviewImages.length < 5 && (
                    <div
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center mb-4"
                      style={{
                        borderColor: "rgba(224, 224, 224, 0.3)",
                        backgroundColor: "transparent",
                      }}
                    >
                      <Upload
                        className="w-8 h-8 mb-2"
                        style={{ color: "rgba(224, 224, 224, 0.5)" }}
                      />
                      <p
                        className="text-center mb-2 text-sm"
                        style={{ color: colors.text }}
                      >
                        Click to add more images
                      </p>
                      <p
                        className="text-xs text-center mb-3"
                        style={{ color: "rgba(224, 224, 224, 0.5)" }}
                      >
                        JPEG, PNG, GIF up to 2MB each
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id="product-preview-images"
                        onChange={handleProductPreviewImagesUpload}
                      />
                      <button
                        onClick={() =>
                          document.getElementById("product-preview-images").click()
                        }
                        className="px-4 py-2 rounded-lg text-sm"
                        style={{
                          backgroundColor: "rgba(187, 134, 252, 0.1)",
                          color: colors.primary,
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add Images
                      </button>
                    </div>
                  )}

                  {/* Display Uploaded Images */}
                  {productPreviewImages.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.text }}
                        >
                          Uploaded Images ({productPreviewImages.length}/5)
                        </span>
                        {productPreviewImages.length >= 5 && (
                          <span
                            className="text-xs"
                            style={{ color: "rgba(224, 224, 224, 0.5)" }}
                          >
                            Maximum images reached
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {productPreviewImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative border rounded-lg p-3"
                            style={{
                              backgroundColor: colors.cardBg,
                              borderColor: colors.borderColor,
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className="text-xs font-medium truncate"
                                style={{ color: colors.text }}
                                title={image.name}
                              >
                                {image.name}
                              </span>
                              <button
                                onClick={() => removeProductPreviewImage(index)}
                                className="p-1 rounded-full hover:bg-red-500/10"
                                style={{ color: colors.accentSecondary }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <img
                              src={image.url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <p
                              className="text-xs mt-1"
                              style={{ color: "rgba(224, 224, 224, 0.5)" }}
                            >
                              {image.size}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
