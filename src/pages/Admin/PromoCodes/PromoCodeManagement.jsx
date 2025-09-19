import React, { useEffect, useState } from "react";
import {
    Tag,
    Plus,
    Search,
    RefreshCw,
    Edit,
    Trash,
    CheckCircle,
    XCircle,
    Percent,
    Calendar,
    ToggleLeft,
    ToggleRight,
    BarChart3,
    Users,
    Filter
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { deletePromoCode, fetchPromoCodes, togglePromoCode, fetchPromoCodeUsage } from "../../../store/admin/promoCodesSlice";
import { toast } from "react-toastify";
import PromoCodeModal from "../../../components/modals/PromoCodeModal";

// Helper function to format date
const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to check if promo code is expired
const isExpired = (validUntil) => {
    return new Date(validUntil) <= new Date();
};

const PromoCodeManagement = () => {
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState("codes");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [promoCodeInfo, setPromoCodeInfo] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPromoCode, setSelectedPromoCode] = useState('');
    useEffect(() => {
        if (activeTab === "codes") {
            dispatch(fetchPromoCodes({}));
        } else {
            dispatch(fetchPromoCodeUsage({
                page: currentPage,
                search: searchTerm,
                startDate,
                endDate,
                promoCodeId: selectedPromoCode
            }));
        }
    }, [dispatch, activeTab, currentPage, searchTerm, startDate, endDate, selectedPromoCode]);

    const { promoCodesList, usageList, usagePagination, loading } = useSelector((state) => state.adminPromoCodes);

    // Items per page
    const itemsPerPage = 10;

    // Get filtered data for codes tab
    const getFilteredData = () => {
        let data = promoCodesList || [];

        if (searchTerm) {
            data = data.filter((item) =>
                item?.promoCode?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            if (statusFilter === "active") {
                data = data.filter((item) => item.isActive && !isExpired(item.validUntil));
            } else if (statusFilter === "inactive") {
                data = data.filter((item) => !item.isActive);
            } else if (statusFilter === "expired") {
                data = data.filter((item) => isExpired(item.validUntil));
            }
        }

        return data;
    };

    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        if (activeTab === "codes") {
            dispatch(fetchPromoCodes({}));
        } else {
            dispatch(fetchPromoCodeUsage({
                page: currentPage,
                search: searchTerm,
                startDate,
                endDate,
                promoCodeId: selectedPromoCode
            }));
        }
    };

    // Handle delete promo code
    const handleDeletePromoCode = (promoCodeId) => {
        if (window.confirm("Are you sure you want to delete this promo code?")) {
            dispatch(deletePromoCode(promoCodeId))
                .unwrap()
                .then(() => {
                    toast.success("Promo code deleted successfully");
                })
                .catch((error) => {
                    toast.error(`Failed to delete promo code: ${error || "Unknown error"}`);
                });
        }
    };

    // Handle toggle promo code status
    const handleTogglePromoCode = (promoCodeId) => {
        dispatch(togglePromoCode(promoCodeId))
            .unwrap()
            .then(() => {
                toast.success("Promo code status updated successfully");
            })
            .catch((error) => {
                toast.error(`Failed to toggle promo code: ${error || "Unknown error"}`);
            });
    };

    return (
        <div className="p-6 overflow-auto">
            <div className="mb-6">
                <h2 className="text-xl font-medium mb-2" style={{ color: colors.primary }}>
                    Promo Code Management
                </h2>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                    Create, manage and track promotional discount codes
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6" style={{ borderColor: colors.borderColor }}>
                <button
                    className="px-4 py-2 font-medium relative flex items-center"
                    style={{
                        color: activeTab === "codes" ? colors.primary : colors.text,
                        borderBottom: activeTab === "codes" ? `2px solid ${colors.primary}` : "none",
                    }}
                    onClick={() => {
                        setActiveTab("codes");
                        setCurrentPage(1);
                    }}
                >
                    <Tag className="w-4 h-4 mr-2" />
                    Promo Codes
                </button>
                <button
                    className="px-4 py-2 font-medium relative flex items-center"
                    style={{
                        color: activeTab === "usage" ? colors.primary : colors.text,
                        borderBottom: activeTab === "usage" ? `2px solid ${colors.primary}` : "none",
                    }}
                    onClick={() => {
                        setActiveTab("usage");
                        setCurrentPage(1);
                    }}
                >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Usage Analytics
                </button>
            </div>

            {/* Render content based on active tab */}
            {activeTab === "codes" ? (
                <PromoCodesTab
                    colors={colors}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    setShowModal={setShowModal}
                    paginatedData={paginatedData}
                    handleTogglePromoCode={handleTogglePromoCode}
                    setPromoCodeInfo={setPromoCodeInfo}
                    handleDeletePromoCode={handleDeletePromoCode}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    filteredData={filteredData}
                    itemsPerPage={itemsPerPage}
                />
            ) : (
                <UsageAnalyticsTab
                    colors={colors}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    usageList={usageList}
                    usagePagination={usagePagination}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    promoCodesList={promoCodesList}
                    startDate={startDate}
                    endDate={endDate}
                    selectedPromoCode={selectedPromoCode}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    setSelectedPromoCode={setSelectedPromoCode}
                />
            )}

            <PromoCodeModal
                showModal={showModal}
                setShowModal={setShowModal}
                promoCodeInfo={promoCodeInfo}
                setPromoCodeInfo={setPromoCodeInfo}
            />
        </div>
    );
};

// Separate component for Promo Codes tab
const PromoCodesTab = ({
                           colors,
                           searchTerm,
                           handleSearch,
                           statusFilter,
                           setStatusFilter,
                           loading,
                           handleRefresh,
                           setShowModal,
                           paginatedData,
                           handleTogglePromoCode,
                           setPromoCodeInfo,
                           handleDeletePromoCode,
                           currentPage,
                           setCurrentPage,
                           totalPages,
                           filteredData,
                           itemsPerPage
                       }) => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <>
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="relative w-full md:w-auto md:flex-1 max-w-md">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: colors.textMuted }}
                    />
                    <input
                        type="text"
                        placeholder="Search promo codes..."
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

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg text-sm"
                        style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                    </select>

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
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>

                    <button
                        className="flex items-center px-3 py-2 rounded-lg text-sm"
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.lightText,
                        }}
                        onClick={() => setShowModal(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Promo Code
                    </button>
                </div>
            </div>

            {/* Promo Codes Table */}
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
                        <tr style={{ backgroundColor: colors.cardBgAlt }}>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Promo Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Discount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Valid Until
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center" style={{ color: colors.textMuted }}>
                                    <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                                </td>
                            </tr>
                        ) : paginatedData?.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center" style={{ color: colors.textMuted }}>
                                    No promo codes found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((promoCode, index) => {
                                const expired = isExpired(promoCode.validUntil);
                                const active = promoCode.isActive && !expired;

                                return (
                                    <tr
                                        key={promoCode?.id}
                                        style={{
                                            borderTop: index !== 0 ? `1px solid ${colors.borderColor}` : "none",
                                            backgroundColor: index % 2 === 0 ? colors.cardBg : colors.cardBgAlt,
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
                                                    <Tag className="w-4 h-4" />
                                                </div>
                                                <div className="font-medium font-mono" style={{ color: colors.text }}>
                                                    {promoCode?.promoCode || "-"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className="px-2 py-1 text-sm rounded-full flex items-center w-min"
                                                    style={{
                                                        backgroundColor: `${colors.success}20`,
                                                        color: colors.success,
                                                    }}
                                                >
                                                    <Percent className="w-3 h-3 mr-1" />
                                                    {promoCode?.discountPercentage}%
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" style={{ color: colors.textMuted }} />
                                                <span className={expired ? "text-red-500" : ""}>
                                                        {formatDate(promoCode?.validUntil)}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                                            {formatDate(promoCode?.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className="px-2 py-1 text-xs rounded-full flex items-center w-min"
                                                    style={{
                                                        backgroundColor: active
                                                            ? `${colors.success}20`
                                                            : expired
                                                                ? `${colors.warning}20`
                                                                : `${colors.error}20`,
                                                        color: active
                                                            ? colors.success
                                                            : expired
                                                                ? colors.warning
                                                                : colors.error,
                                                    }}
                                                >
                                                    {active ? (
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                    )}
                                                    {expired ? "Expired" : promoCode.isActive ? "Active" : "Inactive"}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="p-1 rounded"
                                                    style={{ color: colors.primary }}
                                                    title="Toggle Status"
                                                    onClick={() => handleTogglePromoCode(promoCode?.id)}
                                                    disabled={expired}
                                                >
                                                    {promoCode.isActive ? (
                                                        <ToggleRight className="w-4 h-4" />
                                                    ) : (
                                                        <ToggleLeft className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    className="p-1 rounded"
                                                    style={{ color: colors.accent }}
                                                    title="Edit Promo Code"
                                                    onClick={() => {
                                                        setPromoCodeInfo(promoCode);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1 rounded"
                                                    style={{ color: colors.error }}
                                                    title="Delete Promo Code"
                                                    onClick={() => handleDeletePromoCode(promoCode?.id)}
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
                                    backgroundColor: currentPage === 1 ? "transparent" : colors.inputBg,
                                    color: currentPage === 1 ? colors.textMuted : colors.text,
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    border: `1px solid ${colors.borderColor}`,
                                }}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                                            backgroundColor: currentPage === pageNum ? colors.primary : colors.inputBg,
                                            color: currentPage === pageNum ? colors.lightText : colors.text,
                                            border: `1px solid ${
                                                currentPage === pageNum ? colors.primary : colors.borderColor
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
                                    backgroundColor: currentPage === totalPages ? "transparent" : colors.inputBg,
                                    color: currentPage === totalPages ? colors.textMuted : colors.text,
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
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

export default PromoCodeManagement;


const UsageAnalyticsTab = ({
                               colors,
                               searchTerm,
                               handleSearch,
                               loading,
                               handleRefresh,
                               usageList,
                               usagePagination,
                               currentPage,
                               setCurrentPage,
                               promoCodesList,
                               startDate,
                               endDate,
                               selectedPromoCode,
                               setStartDate,
                               setEndDate,
                               setSelectedPromoCode
                           }) => {
    const usageData = usageList || [];
    const { totalItems = 0, totalPages = 0 } = usagePagination || {};
    const startIndex = (currentPage - 1) * 10;

    return (
        <>
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="relative w-full md:w-auto md:flex-1 max-w-md">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: colors.textMuted }}
                    />
                    <input
                        type="text"
                        placeholder="Search users or codes..."
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

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
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
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.cardBgAlt }}>
                <div className="flex items-center mb-3">
                    <Filter className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                    <span className="text-sm font-medium" style={{ color: colors.text }}>
                        Filters
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date Range Filter */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: colors.text }}>
                            Date Range
                        </label>
                        <div className="flex space-x-2">
                            <div className="flex-1">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded border"
                                    style={{
                                        backgroundColor: colors.inputBg,
                                        border: `1px solid ${colors.borderColor}`,
                                        color: colors.text,
                                    }}
                                    placeholder="Start Date"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded border"
                                    style={{
                                        backgroundColor: colors.inputBg,
                                        border: `1px solid ${colors.borderColor}`,
                                        color: colors.text,
                                    }}
                                    placeholder="End Date"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Promo Code Filter */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: colors.text }}>
                            Promo Code
                        </label>
                        <select
                            value={selectedPromoCode}
                            onChange={(e) => setSelectedPromoCode(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded border"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                            }}
                        >
                            <option value="">All Promo Codes</option>
                            {promoCodesList?.map((promo) => (
                                <option key={promo.id} value={promo.id}>
                                    {promo.promoCode} ({promo.discountPercentage}%)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium invisible">Actions</label>
                        <button
                            onClick={() => {
                                setStartDate('');
                                setEndDate('');
                                setSelectedPromoCode('');
                            }}
                            className="w-full px-3 py-2 text-sm rounded border hover:opacity-80"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.borderColor}`,
                                color: colors.text,
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Usage Statistics Summary */}
            {usageData.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBgAlt }}>
                        <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                            {totalItems}
                        </div>
                        <div className="text-sm" style={{ color: colors.textMuted }}>
                            Total Usage
                        </div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBgAlt }}>
                        <div className="text-2xl font-bold" style={{ color: colors.success }}>
                            {usageData.reduce((sum, item) => sum + Number(item.discountAmount || 0), 0).toFixed(2)}
                        </div>
                        <div className="text-sm" style={{ color: colors.textMuted }}>
                            Total Savings (Sparks)
                        </div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBgAlt }}>
                        <div className="text-2xl font-bold" style={{ color: colors.accent }}>
                            {usageData.reduce((sum, item) => sum + Number(item.originalAmount || 0), 0).toFixed(2)}
                        </div>
                        <div className="text-sm" style={{ color: colors.textMuted }}>
                            Total Order Value (Sparks)
                        </div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBgAlt }}>
                        <div className="text-2xl font-bold" style={{ color: colors.text }}>
                            {usageData.length > 0 ? (
                                (usageData.reduce((sum, item) => sum + Number(item.discountAmount || 0), 0) /
                                    usageData.reduce((sum, item) => sum + Number(item.originalAmount || 0), 0) * 100).toFixed(1)
                            ) : 0}%
                        </div>
                        <div className="text-sm" style={{ color: colors.textMuted }}>
                            Avg. Discount Rate
                        </div>
                    </div>
                </div>
            )}

            {/* Usage Table */}
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
                        <tr style={{ backgroundColor: colors.cardBgAlt }}>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Promo Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Order Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Discount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Final Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                                Used At
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center" style={{ color: colors.textMuted }}>
                                    <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                                </td>
                            </tr>
                        ) : usageData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center" style={{ color: colors.textMuted }}>
                                    No promo code usage found
                                </td>
                            </tr>
                        ) : (
                            usageData.map((usage, index) => (
                                <tr
                                    key={usage?.id}
                                    style={{
                                        borderTop: index !== 0 ? `1px solid ${colors.borderColor}` : "none",
                                        backgroundColor: index % 2 === 0 ? colors.cardBg : colors.cardBgAlt,
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
                                                }}
                                            >
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium" style={{ color: colors.text }}>
                                                    {usage?.user?.name || "Unknown User"}
                                                </div>
                                                <div className="text-sm" style={{ color: colors.textMuted }}>
                                                    {usage?.user?.email_address || ""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className="px-2 py-1 text-sm rounded-full font-mono"
                                                style={{
                                                    backgroundColor: `${colors.primary}20`,
                                                    color: colors.primary,
                                                }}
                                            >
                                                {usage?.promoCode?.promoCode || "-"}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                                        {Number(usage?.originalAmount || 0).toFixed(2)} Sparks
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                                <span
                                                    className="px-2 py-1 text-sm rounded-full"
                                                    style={{
                                                        backgroundColor: `${colors.success}20`,
                                                        color: colors.success,
                                                    }}
                                                >
                                                    -{Number(usage?.discountAmount || 0).toFixed(2)} Sparks
                                                </span>
                                            <span className="ml-2 text-xs" style={{ color: colors.textMuted }}>
                                                    ({usage?.promoCode?.discountPercentage || 0}%)
                                                </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.text }}>
                                        {Number(usage?.finalAmount || 0).toFixed(2)} Sparks
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.text }}>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" style={{ color: colors.textMuted }} />
                                            {formatDate(usage?.usedAt)}
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
                        style={{ borderColor: colors.borderColor }}
                    >
                        <div className="text-sm" style={{ color: colors.textMuted }}>
                            Showing {startIndex + 1} to{" "}
                            {Math.min(startIndex + 10, totalItems)} of{" "}
                            {totalItems} entries
                        </div>
                        <div className="flex space-x-1">
                            <button
                                className="px-3 py-1 rounded text-sm"
                                style={{
                                    backgroundColor: currentPage === 1 ? "transparent" : colors.inputBg,
                                    color: currentPage === 1 ? colors.textMuted : colors.text,
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    border: `1px solid ${colors.borderColor}`,
                                }}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                                            backgroundColor: currentPage === pageNum ? colors.primary : colors.inputBg,
                                            color: currentPage === pageNum ? colors.lightText : colors.text,
                                            border: `1px solid ${
                                                currentPage === pageNum ? colors.primary : colors.borderColor
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
                                    backgroundColor: currentPage === totalPages ? "transparent" : colors.inputBg,
                                    color: currentPage === totalPages ? colors.textMuted : colors.text,
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
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
