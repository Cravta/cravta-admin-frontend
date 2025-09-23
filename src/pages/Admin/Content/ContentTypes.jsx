import React, { useEffect, useState } from "react";
import {
    FileText,
    Plus,
    Search,
    RefreshCw,
    Edit,
    Trash,
    CheckCircle,
    XCircle,
    ChevronDown,
    X,
} from "lucide-react";
import { useAppSettings } from "../../../contexts/AppSettingsProvider.jsx";
import { useTheme } from "../../../contexts/ThemeContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    fetchContentTypes,
    createContentType,
    updateContentType,
    deleteContentType,
    clearError,
    setCurrentPage,
} from "../../../store/admin/contentTypesSlice";

// Helper function to format date
const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// ContentType Modal Component
const ContentTypeModal = ({ showModal, setShowModal, contentTypeInfo, setContentTypeInfo }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.contentTypes);

    const [name, setName] = useState("");
    const [ar_name, setArabicName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (contentTypeInfo?.id) {
            setName(contentTypeInfo.name || "");
            setArabicName(contentTypeInfo.ar_name || "");
            setDescription(contentTypeInfo.description || "");
            setIsActive(contentTypeInfo.is_active !== undefined ? contentTypeInfo.is_active : true);
        } else {
            resetForm();
        }
    }, [contentTypeInfo?.id, showModal]);

    const resetForm = () => {
        setName("");
        setArabicName("");
        setDescription("");
        setIsActive(true);
        setContentTypeInfo(null);
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Please enter a content type name.");
            return;
        }

        const payload = {
            name: name.trim(),
            ar_name: ar_name.trim(),
            description: description.trim(),
            is_active: isActive,
        };

        setIsSubmitting(true);

        if (contentTypeInfo?.id) {
            // Update existing content type
            dispatch(updateContentType({ id: contentTypeInfo.id, ...payload }))
                .unwrap()
                .then(() => {
                    toast.success("Content type updated successfully!");
                    dispatch(fetchContentTypes({ page: 1 })); // Refresh the list
                    resetForm();
                    setShowModal(false);
                })
                .catch((error) => {
                    toast.error(`Failed to update content type: ${error || "Unknown error"}`);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            // Create new content type
            dispatch(createContentType(payload))
                .unwrap()
                .then(() => {
                    toast.success("Content type created successfully!");
                    dispatch(fetchContentTypes({ page: 1 })); // Refresh the list
                    resetForm();
                    setShowModal(false);
                })
                .catch((error) => {
                    toast.error(`Failed to create content type: ${error || "Unknown error"}`);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const handleCloseModal = () => {
        resetForm();
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
            <div className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: colors.cardBgAlt }}>
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: colors.borderColor }}>
                    <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
                        {contentTypeInfo?.id ? "Edit Content Type" : "Create Content Type"}
                    </h3>
                    <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-opacity-20" style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}>
                        <X className="w-5 h-5" style={{ color: colors.text }} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-5 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm mb-1" style={{ color: colors.terColor }}>Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-lg"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                            }}
                            placeholder="Enter content type name"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div dir={"rtl"}>
                        <label className="block text-sm mb-1" style={{ color: colors.terColor }}>لاسم العربي *</label>
                        <input
                            type="text"
                            value={ar_name}
                            onChange={(e) => setArabicName(e.target.value)}
                            className="w-full p-3 rounded-lg"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                            }}
                            placeholder="Enter content type name"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm mb-1" style={{ color: colors.terColor }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full p-3 rounded-lg resize-none"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                            }}
                            placeholder="Enter description (optional)"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm mb-1" style={{ color: colors.terColor }}>Status</label>
                        <select
                            value={isActive ? "active" : "inactive"}
                            onChange={(e) => setIsActive(e.target.value === "active")}
                            className="w-full p-3 rounded-lg"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                            }}
                            disabled={isSubmitting}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-5 border-t" style={{ borderColor: colors.borderColor }}>
                    <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 mr-3 rounded-lg text-sm"
                        style={{
                            backgroundColor: "transparent",
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                        }}
                        type="button"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim() || isSubmitting}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.cardBg,
                            opacity: !name.trim() || isSubmitting ? 0.6 : 1,
                            cursor: !name.trim() || isSubmitting ? "not-allowed" : "pointer",
                        }}
                        type="button"
                    >
                        {isSubmitting ? (contentTypeInfo?.id ? "Updating..." : "Creating...") : (contentTypeInfo?.id ? "Update Content Type" : "Create Content Type")}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ContentTypeManagement = () => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const {
        contentTypesList,
        loading,
        error,
        currentPage,
        totalPages,
        totalContentTypes
    } = useSelector((state) => state.contentTypes);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [contentTypeInfo, setContentTypeInfo] = useState(null);

    useEffect(() => {
        dispatch(fetchContentTypes({ page: 1, limit: 10 }));
    }, [dispatch]);

    // Clear error when component unmounts or error changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    // Items per page
    const itemsPerPage = 10;

    // Get filtered data (client-side filtering for search and status)
    const getFilteredData = () => {
        let data = contentTypesList || [];

        // Apply search filter
        if (searchTerm) {
            data = data.filter(
                (item) =>
                    item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item?.ar_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item?.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            data = data.filter((item) =>
                statusFilter === "active" ? item.is_active : !item.is_active
            );
        }

        return data;
    };

    const filteredData = getFilteredData();

    // Calculate pagination for filtered data
    const filteredTotalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        dispatch(setCurrentPage(1)); // Reset to first page on search
    };

    // Handle status filter change
    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        dispatch(setCurrentPage(1)); // Reset to first page on filter change
        setShowStatusDropdown(false);
    };

    // Handle refresh
    const handleRefresh = () => {
        dispatch(fetchContentTypes({ page: currentPage, limit: itemsPerPage }));
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage(newPage));
        // If no client-side filtering is active, fetch new page from server
        if (!searchTerm && statusFilter === "all") {
            dispatch(fetchContentTypes({ page: newPage, limit: itemsPerPage }));
        }
    };

    const handleDeleteContentType = (contentTypeId) => {
        if (window.confirm("Are you sure you want to delete this content type?")) {
            dispatch(deleteContentType(contentTypeId))
                .unwrap()
                .then(() => {
                    toast.success("Content type deleted successfully");
                    // Refresh the current page
                    dispatch(fetchContentTypes({ page: currentPage, limit: itemsPerPage }));
                })
                .catch((error) => {
                    toast.error(`Failed to delete content type: ${error || "Unknown error"}`);
                });
        }
    };

    // Use filtered pagination when search or filter is active
    const displayTotalPages = (searchTerm || statusFilter !== "all") ? filteredTotalPages : totalPages;
    const displayCurrentPage = (searchTerm || statusFilter !== "all") ? 1 : currentPage;

    return (
        <div className="p-6 overflow-auto">
            <div className="mb-6">
                <h2
                    className="text-xl font-medium mb-2"
                    style={{ color: colors.primary }}
                >
                    Content Type Management
                </h2>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                    Manage content types for educational materials
                </p>
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
                        placeholder="Search content types..."
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
                    {/* Filter dropdown */}
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
                            <span>
                                {statusFilter === "all"
                                    ? "All Status"
                                    : statusFilter === "active"
                                        ? "Active"
                                        : "Inactive"}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </button>

                        {showStatusDropdown && (
                            <div
                                className="absolute right-0 mt-2 w-40 rounded-md shadow-lg z-10 overflow-hidden"
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
                                        onClick={() => handleStatusFilter("all")}
                                    >
                                        All Status
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm"
                                        style={{
                                            backgroundColor:
                                                statusFilter === "active"
                                                    ? `${colors.primary}20`
                                                    : "transparent",
                                            color: colors.text,
                                        }}
                                        onClick={() => handleStatusFilter("active")}
                                    >
                                        Active
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm"
                                        style={{
                                            backgroundColor:
                                                statusFilter === "inactive"
                                                    ? `${colors.primary}20`
                                                    : "transparent",
                                            color: colors.text,
                                        }}
                                        onClick={() => handleStatusFilter("inactive")}
                                    >
                                        Inactive
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
                        disabled={loading}
                        onClick={handleRefresh}
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                        />
                    </button>

                    {/* Add new content type button */}
                    <button
                        className="flex items-center px-3 py-2 rounded-lg text-sm"
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.lightText,
                        }}
                        onClick={() => setShowModal(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Content Type
                    </button>
                </div>
            </div>

            {/* Content Types Table */}
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
                                Name
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                لاسم العربي
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Description
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Created Date
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Last Updated
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Status
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
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-4 text-center"
                                    style={{ color: colors.textMuted }}
                                >
                                    <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                                </td>
                            </tr>
                        ) : paginatedData?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-4 text-center"
                                    style={{ color: colors.textMuted }}
                                >
                                    No content types found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((contentType, index) => (
                                <tr
                                    key={contentType?.id}
                                    style={{
                                        borderTop:
                                            index !== 0
                                                ? `1px solid ${colors.borderColor}`
                                                : "none",
                                        backgroundColor:
                                            index % 2 === 0 ? colors.cardBg : colors.cardBgAlt,
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                                }}
                                            >
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div
                                                    className="font-medium"
                                                    style={{ color: colors.text }}
                                                >
                                                    {contentType?.name || "-"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {/*<div*/}
                                            {/*    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"*/}
                                            {/*    style={{*/}
                                            {/*        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            {/*    <FileText className="w-4 h-4" />*/}
                                            {/*</div>*/}
                                            <div>
                                                <div
                                                    className="font-medium"
                                                    style={{ color: colors.text }}
                                                >
                                                    {contentType?.ar_name || "-"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 text-sm max-w-xs truncate"
                                        style={{ color: colors.text }}
                                        title={contentType?.description}
                                    >
                                        {contentType?.description || "-"}
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{ color: colors.text }}
                                    >
                                        {formatDate(contentType?.createdAt)}
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{ color: colors.text }}
                                    >
                                        {contentType.updatedAt ? formatDate(contentType.updatedAt) : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className="px-2 py-1 text-xs rounded-full flex items-center w-min"
                                                style={{
                                                    backgroundColor:
                                                        contentType.is_active
                                                            ? `${colors.success}20`
                                                            : `${colors.error}20`,
                                                    color:
                                                        contentType.is_active
                                                            ? colors.success
                                                            : colors.error,
                                                }}
                                            >
                                                {contentType.is_active ? (
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                )}
                                                {contentType.is_active ? "Active" : "Inactive"}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 rounded"
                                                style={{ color: colors.accent }}
                                                title="Edit Content Type"
                                                onClick={() => {setContentTypeInfo(contentType);setShowModal(true);}}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1 rounded"
                                                style={{ color: colors.error }}
                                                title="Delete Content Type"
                                                onClick={() => handleDeleteContentType(contentType?.id)}
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
                </div>

                {/* Pagination */}
                {displayTotalPages > 1 && (
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
                                        displayCurrentPage === 1 ? "transparent" : colors.inputBg,
                                    color: displayCurrentPage === 1 ? colors.textMuted : colors.text,
                                    cursor: displayCurrentPage === 1 ? "not-allowed" : "pointer",
                                    border: `1px solid ${colors.borderColor}`,
                                }}
                                disabled={displayCurrentPage === 1}
                                onClick={() => handlePageChange(displayCurrentPage - 1)}
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.min(5, displayTotalPages) }, (_, i) => {
                                let pageNum;
                                if (displayTotalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (displayCurrentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (displayCurrentPage >= displayTotalPages - 2) {
                                    pageNum = displayTotalPages - 4 + i;
                                } else {
                                    pageNum = displayCurrentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        className="w-8 h-8 flex items-center justify-center rounded text-sm"
                                        style={{
                                            backgroundColor:
                                                displayCurrentPage === pageNum
                                                    ? colors.primary
                                                    : colors.inputBg,
                                            color:
                                                displayCurrentPage === pageNum
                                                    ? colors.lightText
                                                    : colors.text,
                                            border: `1px solid ${
                                                displayCurrentPage === pageNum
                                                    ? colors.primary
                                                    : colors.borderColor
                                            }`,
                                        }}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                className="px-3 py-1 rounded text-sm"
                                style={{
                                    backgroundColor:
                                        displayCurrentPage === displayTotalPages ? "transparent" : colors.inputBg,
                                    color:
                                        displayCurrentPage === displayTotalPages ? colors.textMuted : colors.text,
                                    cursor:
                                        displayCurrentPage === displayTotalPages ? "not-allowed" : "pointer",
                                    border: `1px solid ${colors.borderColor}`,
                                }}
                                disabled={displayCurrentPage === displayTotalPages}
                                onClick={() => handlePageChange(displayCurrentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ContentTypeModal
                showModal={showModal}
                setShowModal={setShowModal}
                contentTypeInfo={contentTypeInfo}
                setContentTypeInfo={setContentTypeInfo}
            />
        </div>
    );
};

export default ContentTypeManagement;