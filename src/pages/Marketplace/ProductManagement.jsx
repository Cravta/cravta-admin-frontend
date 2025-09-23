import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Archive,
  MoreVertical,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  Download,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsStats, fetchProductsWithStatus, downloadProductById, updateProductStatus, deleteProduct,updateProductFeatured  } from "../../store/admin/market/productSlice";
import DocumentPreviewModal from "../../components/modals/DocumentPreviewModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RejectionReasonModal from "../../components/modals/RejectionReasonModal";

const AdminProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionLoading, setRejectionLoading] = useState(false);
  const [rejectionProduct, setRejectionProduct] = useState(null);
  useEffect(() => {
    console.log('Dispatching fetchProductsStats...');
    dispatch(fetchProductsStats());
    dispatch(fetchProductsWithStatus());
  }, [dispatch]);
  const {productStats, loading, error,products} = useSelector(state => state.product);
  
  // Colors for dark mode (same as your component)
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
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
  };

  // Dummy data
  // const products = [
  //   {
  //     id: 1,
  //     title: "Advanced Algebra Workbook",
  //     teacher: "Dr. Smith",
  //     subject: "Mathematics",
  //     grade: "Grade 10",
  //     price: 250,
  //     status: "pending",
  //     uploadDate: "2024-01-15",
  //     views: 0,
  //     sales: 0,
  //     rating: 0,
  //   },
  //   {
  //     id: 2,
  //     title: "Chemistry Lab Manual",
  //     teacher: "Prof. Johnson",
  //     subject: "Science",
  //     grade: "Grade 11",
  //     price: 300,
  //     status: "approved",
  //     uploadDate: "2024-01-10",
  //     views: 156,
  //     sales: 23,
  //     rating: 4.5,
  //   },
  //   {
  //     id: 3,
  //     title: "English Grammar Guide",
  //     teacher: "Ms. Davis",
  //     subject: "English",
  //     grade: "Grade 9",
  //     price: 200,
  //     status: "approved",
  //     uploadDate: "2024-01-08",
  //     views: 234,
  //     sales: 45,
  //     rating: 4.8,
  //   },
  //   {
  //     id: 4,
  //     title: "Physics Problem Sets",
  //     teacher: "Dr. Wilson",
  //     subject: "Physics",
  //     grade: "Grade 12",
  //     price: 350,
  //     status: "rejected",
  //     uploadDate: "2024-01-12",
  //     views: 0,
  //     sales: 0,
  //     rating: 0,
  //     rejectionReason: "Poor quality content",
  //   },
  //   {
  //     id: 5,
  //     title: "History Timeline Workbook",
  //     teacher: "Mr. Brown",
  //     subject: "History",
  //     grade: "Grade 8",
  //     price: 180,
  //     status: "archived",
  //     uploadDate: "2023-12-20",
  //     views: 89,
  //     sales: 12,
  //     rating: 3.9,
  //   },
  //   {
  //     id: 6,
  //     title: "Biology Lab Reports",
  //     teacher: "Dr. Taylor",
  //     subject: "Biology",
  //     grade: "Grade 11",
  //     price: 280,
  //     status: "pending",
  //     uploadDate: "2024-01-16",
  //     views: 0,
  //     sales: 0,
  //     rating: 0,
  //   },
  // ];

  // Filter products based on status and search
  const filteredProducts = products?.filter((product) => {
    const matchesStatus =
      selectedStatus === "all" || product?.publishing_status === selectedStatus;
    const matchesSearch =
      product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.uploader_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  // Statistics - use API data if available, otherwise use dummy data
  const stats = productStats ? {
    total: productStats.totalProducts || 0,
    pending: productStats.pending || 0,
    approved: productStats.approved || 0,
    rejected: productStats.rejected || 0,
    archived: productStats.archived || 0,
  } : {
    total: products.length,
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  const handleToggleFeatured = async (product) => {
    try {
      const newFeaturedStatus = !product.featured;
      await dispatch(updateProductFeatured({
        id: product.id,
        featured: newFeaturedStatus
      })).unwrap();

      toast.success(
          `Product ${newFeaturedStatus ? 'featured' : 'unfeatured'} successfully!`
      );
      dispatch(fetchProductsWithStatus());
      dispatch(fetchProductsStats());
    } catch (err) {
      toast.error(err || "Failed to update featured status");
    }
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: colors.warning, text: "#000" },
      approved: { bg: colors.success, text: "#fff" },
      rejected: { bg: colors.error, text: "#fff" },
      archived: { bg: colors.borderColor, text: colors.text },
    };

    const style = styles[status?.toLowerCase()] || styles.pending;

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: style.bg,
          color: style.text,
        }}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // Handle preview button click
  const handlePreviewClick = async (product) => {
    setPreviewLoading(true);
    setSelectedProduct(product);
    setShowPreviewModal(true);

    try {
      // Get the first image from the product's image array
      if (product?.product_id) {
        const result = await dispatch(downloadProductById(product?.product_id)).unwrap();
        
        if (result?.uploadDocURL) {
          setDocumentUrl(result.uploadDocURL);
        } else {
          toast.error('No preview document available');
        }
      } else {
        toast.error('No preview document available');
      }
    } catch (error) {
      console.error('Error loading preview:', error);
      toast.error('Failed to load preview document');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowPreviewModal(false);
    setDocumentUrl(null);
    setSelectedProduct(null);
    setPreviewLoading(false);
  };

  // Add handlers for Approve/Reject
  const handleApprove = async (product) => {
    try {
      await dispatch(updateProductStatus({ id: product.id, status: "Approved" })).unwrap();
      toast.success("Product approved successfully!");
      dispatch(fetchProductsWithStatus());
      dispatch(fetchProductsStats());
    } catch (err) {
      toast.error(err || "Failed to approve product");
    }
  };

  const handleReject = (product) => {
    setRejectionProduct(product);
    setShowRejectionModal(true);
  };

  const handleRejectionSubmit = async (reason) => {
    if (!rejectionProduct) return;
    setRejectionLoading(true);
    try {
      await dispatch(updateProductStatus({ id: rejectionProduct.id, status: "Rejected", rejection_reason: reason })).unwrap();
      toast.success("Product rejected successfully!");
      setShowRejectionModal(false);
      setRejectionProduct(null);
      dispatch(fetchProductsWithStatus());
      dispatch(fetchProductsStats());
    } catch (err) {
      toast.error(err || "Failed to reject product");
    } finally {
      setRejectionLoading(false);
    }
  };

  const handleRejectionCancel = () => {
    setShowRejectionModal(false);
    setRejectionProduct(null);
  };

  const handleArchive = async (product) => {
    try {
      await dispatch(updateProductStatus({ id: product.id, status: "Archived" })).unwrap();
      toast.success("Product archived successfully!");
      dispatch(fetchProductsWithStatus());
      dispatch(fetchProductsStats());
    } catch (err) {
      toast.error(err || "Failed to archive product");
    }
  };

  const handleUnarchive = async (product) => {
    try {
      await dispatch(updateProductStatus({ id: product.id, status: "Approved" })).unwrap();
      toast.success("Product unarchived (approved) successfully!");
      dispatch(fetchProductsWithStatus());
      dispatch(fetchProductsStats());
    } catch (err) {
      toast.error(err || "Failed to unarchive product");
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      toast.success("Product deleted successfully!");
      dispatch(fetchProductsWithStatus());
      dispatch(fetchProductsStats());
    } catch (err) {
      toast.error(err?.message || "Failed to delete product");
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: colors.lightText }}
        >
          Product Management
        </h1>
        <p style={{ color: colors.text }}>
          Review and manage teacher-uploaded products
        </p>
        
        {/* Debug Info */}
        {loading && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.warning, color: '#000' }}>
            Loading product stats...
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div
          className="rounded-lg p-6 shadow-md"
          style={{
            backgroundColor: colors.cardBgAlt,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8" style={{ color: colors.primary }} />
            <span
              className="text-2xl font-bold"
              style={{ color: colors.lightText }}
            >
              {stats.total}
            </span>
          </div>
          <p className="text-sm" style={{ color: colors.text }}>
            Total Products
          </p>
        </div>

        <div
          className="rounded-lg p-6 shadow-md"
          style={{
            backgroundColor: colors.cardBgAlt,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <AlertCircle
              className="w-8 h-8"
              style={{ color: colors.warning }}
            />
            <span
              className="text-2xl font-bold"
              style={{ color: colors.lightText }}
            >
              {stats.pending}
            </span>
          </div>
          <p className="text-sm" style={{ color: colors.text }}>
            Pending Approval
          </p>
        </div>

        <div
          className="rounded-lg p-6 shadow-md"
          style={{
            backgroundColor: colors.cardBgAlt,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle
              className="w-8 h-8"
              style={{ color: colors.success }}
            />
            <span
              className="text-2xl font-bold"
              style={{ color: colors.lightText }}
            >
              {stats.approved}
            </span>
          </div>
          <p className="text-sm" style={{ color: colors.text }}>
            Approved Products
          </p>
        </div>

        <div
          className="rounded-lg p-6 shadow-md"
          style={{
            backgroundColor: colors.cardBgAlt,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" style={{ color: colors.accent }} />
            <span
              className="text-2xl font-bold"
              style={{ color: colors.lightText }}
            >
              SAR {productStats?.totalRevenue??0}
            </span>
          </div>
          <p className="text-sm" style={{ color: colors.text }}>
            Total Revenue
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div
        className="rounded-lg shadow-md p-6 mb-6"
        style={{
          backgroundColor: colors.cardBgAlt,
          border: `1px solid ${colors.borderColor}`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: colors.text }}
              />
              <input
                type="text"
                placeholder="Search products, teachers, subjects..."
                className="w-full pl-10 pr-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              className="px-4 py-2 rounded-lg font-medium flex items-center"
              style={{
                backgroundColor: colors.navActiveBg,
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
              }}
              onClick={() => {
                dispatch(fetchProductsStats())
                dispatch(fetchProductsWithStatus());
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>

            {/* <button
              className="px-4 py-2 rounded-lg font-medium flex items-center"
              style={{
                backgroundColor: colors.primary,
                color: "#000",
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button> */}
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-4">
          {["all", "Pending", "Approved", "Rejected", "Archived"].map(
            (status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all`}
                style={{
                  backgroundColor:
                    selectedStatus === status ? colors.primary : "transparent",
                  color: selectedStatus === status ? "#000" : colors.text,
                  border: `1px solid ${
                    selectedStatus === status
                      ? colors.primary
                      : colors.borderColor
                  }`,
                }}
                onClick={() => setSelectedStatus(status)}
              >
                {status === "all" ? "All Products" : status}
                <span
                  className="ml-2 text-xs"
                  style={{
                    backgroundColor:
                      selectedStatus === status
                        ? "rgba(0,0,0,0.2)"
                        : colors.cardBg,
                    padding: "2px 6px",
                    borderRadius: "12px",
                  }}
                >
                  {status === "all"
                    ? stats.total
                    : products.filter((p) => p.publishing_status === status).length}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Products Table */}
      <div
        className="rounded-lg shadow-md overflow-hidden"
        style={{
          backgroundColor: colors.cardBgAlt,
          border: `1px solid ${colors.borderColor}`,
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: colors.cardBg }}>
              {/* <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded"
                  style={{ accentColor: colors.primary }}
                />
              </th> */}
              <th className="p-4 text-left" style={{ color: colors.primary }}>
                Product
              </th>
              <th className="p-4 text-left" style={{ color: colors.primary }}>
                Teacher
              </th>
              <th className="p-4 text-left" style={{ color: colors.primary }}>
                Target Audience
              </th>
              <th className="p-4 text-left" style={{ color: colors.primary }}>
                Subject/Grade
              </th>
              <th className="p-4 text-left" style={{ color: colors.primary }}>
                Price
              </th>
              <th className="p-4 text-left" style={{ color: colors.primary }}>
                Status
              </th>
              <th className="p-4 text-left" style={{ color: colors.primary }}>
                Metrics
              </th>
              <th className="p-4 text-left" style={{ color: colors.primary }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-opacity-50"
                style={{
                  borderColor: colors.borderColor,
                  backgroundColor: selectedProducts.includes(product.id)
                    ? colors.navActiveBg
                    : "transparent",
                }}
              >
                {/* <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded"
                    style={{ accentColor: colors.primary }}
                  />
                </td> */}
                <td className="p-4">
                  <div>
                    <h3
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      {product.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(224, 224, 224, 0.6)" }}
                    >
                      Uploaded: {product.createdAt.substring(0, 10)}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <p style={{ color: colors.text }}>{product.isAdmin ? "Cravta" : product.uploader_name}</p>
                </td>
                <td className="p-4">
                  <p style={{ color: colors.text }}>{product.isAdmin ? "Cravta" : product.target_audience}</p>
                </td>
                <td className="p-4">
                  <p style={{ color: colors.text }}>{product.subject}</p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(224, 224, 224, 0.6)" }}
                  >
                    {product.grade}
                  </p>
                </td>
                <td className="p-4">
                  <p className="font-medium" style={{ color: colors.accent }}>
                    {product.price} Sparks
                  </p>
                </td>
                <td className="p-4">
                  {getStatusBadge(product.publishing_status)}
                  {product.rejection_reason && (
                    <p className="text-xs mt-1" style={{ color: colors.error }}>
                      {product.rejection_reason}
                    </p>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <p style={{ color: colors.text }}>Views: {product.views??0}</p>
                    <p style={{ color: colors.text }}>Sales: {product.total_sales??0}</p>
                    {product.rating > 0 && (
                      <p style={{ color: colors.accent }}>
                        Rating: {product.rating}⭐
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {product?.publishing_status?.toLowerCase() === "pending" && (
                        <>
                          <button
                              className="p-2 rounded-lg hover:bg-opacity-20"
                              style={{
                                backgroundColor: "rgba(76, 175, 80, 0.1)",
                                color: colors.success,
                              }}
                              title="Approve"
                              onClick={() => handleApprove(product)}
                          >
                            <CheckCircle className="w-4 h-4"/>
                          </button>
                          <button
                              className="p-2 rounded-lg hover:bg-opacity-20"
                              style={{
                                backgroundColor: "rgba(244, 67, 54, 0.1)",
                                color: colors.error,
                              }}
                              title="Reject"
                              onClick={() => handleReject(product)}
                          >
                            <XCircle className="w-4 h-4"/>
                          </button>
                        </>
                    )}
                    <button
                        className="p-2 rounded-lg hover:bg-opacity-20"
                        style={{
                          backgroundColor: product.featured
                              ? "rgba(255, 193, 7, 0.2)"
                              : "rgba(187, 134, 252, 0.1)",
                          color: product.featured ? "#ffc107" : colors.primary,
                        }}
                        title={product.featured ? "Remove Featured" : "Make Featured"}
                        onClick={() => handleToggleFeatured(product)}
                    >
                      <TrendingUp className="w-4 h-4"/>
                    </button>

                    <button
                        className="p-2 rounded-lg hover:bg-opacity-20"
                        style={{
                          backgroundColor: "rgba(187, 134, 252, 0.1)",
                          color: colors.primary,
                        }}
                        title="Preview"
                        onClick={() => handlePreviewClick(product)}
                    >
                      <Eye className="w-4 h-4"/>
                    </button>

                    {product.publishing_status === "Archived" ? (
                        <button
                            className="p-2 rounded-lg hover:bg-opacity-20"
                            style={{
                              backgroundColor: "rgba(255, 152, 0, 0.1)",
                              color: colors.warning,
                            }}
                            title="Unhide"
                            onClick={() => handleUnarchive(product)}
                        >
                          <EyeOff className="w-4 h-4"/>
                        </button>
                    ) : (
                        <button
                            className="p-2 rounded-lg hover:bg-opacity-20"
                            style={{
                              backgroundColor: "rgba(187, 134, 252, 0.1)",
                              color: colors.text,
                            }}
                            title="Archive"
                            onClick={() => handleArchive(product)}
                        >
                          <Archive className="w-4 h-4"/>
                        </button>
                    )}

                    <div className="relative">
                      <button
                          className="p-2 rounded-lg hover:bg-opacity-20"
                          style={{
                            backgroundColor: "rgba(187, 134, 252, 0.1)",
                            color: colors.text,
                          }}
                          onClick={() =>
                              setShowActionMenu(
                                  showActionMenu === product.id ? null : product.id
                              )
                          }
                      >
                        <MoreVertical className="w-4 h-4"/>
                      </button>

                      {showActionMenu === product.id && (
                          <div
                              className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-10"
                              style={{
                                backgroundColor: colors.cardBg,
                                border: `1px solid ${colors.borderColor}`,
                              }}
                          >
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-opacity-20"
                                style={{
                                  color: colors.text,
                                  backgroundColor: "transparent",
                                }}
                                onClick={() => navigate(`/market/marketplace/product/${product.id}`)}
                            >
                              View Details
                            </button>
                            {/* <button
                            className="w-full px-4 py-2 text-left hover:bg-opacity-20"
                            style={{
                              color: colors.text,
                              backgroundColor: "transparent",
                            }}
                          >
                            Edit Product
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-opacity-20"
                            style={{
                              color: colors.text,
                              backgroundColor: "transparent",
                            }}
                          >
                            Contact Teacher
                          </button> */}
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-opacity-20"
                                style={{
                                  color: colors.error,
                                  backgroundColor: "transparent",
                                }}
                                onClick={() => handleDeleteProduct(product)}
                            >
                              Delete Product
                            </button>
                          </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
            <div
                className="p-4 flex items-center justify-between"
                style={{
                  backgroundColor: colors.cardBg,
                  borderTop: `1px solid ${colors.borderColor}`,
                }}
            >
            <p style={{ color: colors.text }}>
              {selectedProducts.length} products selected
            </p>
            <div className="flex items-center space-x-3">
              <button
                className="px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: colors.success,
                  color: "#fff",
                }}
              >
                Approve Selected
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: colors.error,
                  color: "#fff",
                }}
              >
                Reject Selected
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: colors.borderColor,
                  color: colors.text,
                }}
              >
                Archive Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={showPreviewModal}
        onClose={handleCloseModal}
        documentUrl={documentUrl}
        title={`Document Preview - ${selectedProduct?.title || 'Product'}`}
        loading={previewLoading}
        colors={colors}
      />

      <RejectionReasonModal
        isOpen={showRejectionModal}
        onClose={handleRejectionCancel}
        onSubmit={handleRejectionSubmit}
        loading={rejectionLoading}
        productTitle={rejectionProduct?.title}
      />
    </div>
  );
};

export default AdminProductManagement;
