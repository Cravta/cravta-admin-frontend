import React, { useEffect, useState } from "react";
import {
    Building2,
    Search,
    Filter,
    RefreshCw,
    Calendar,
    MapPin,
    Eye,
    Edit,
    Trash,
    Download,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Users,
    Clock,
    Plus,
    BookOpen,
    GraduationCap,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteEnterpriseByAdmin,
    fetchEnterprisesAdmin,
    fetchEnterpriseById
} from "../../../store/admin/enterpriseSlice";
import { toast } from "react-toastify";
import CreateEnterpriseModal from "../../../components/modals/CreateEnterpriseModal";

// Helper function to format date
const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount || 0);
};

const EnterpriseManagement = () => {
    const { colors } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [expandedEnterprise, setExpandedEnterprise] = useState(null);
    const [selectedTab, setSelectedTab] = useState("teachers");
    const [enterpriseData, setEnterpriseData] = useState({});
    const debounceRef = React.useRef(null);
    const isFirstSearch = React.useRef(true);
    const dispatch = useDispatch();

    // Effect for initial load and page changes
    useEffect(() => {
        if (!debounceRef.current) {
            dispatch(fetchEnterprisesAdmin({ page: currentPage, search: searchTerm }));
        }
    }, [dispatch, currentPage]);


    // Debounced search effect
    useEffect(() => {
        if (isFirstSearch.current) {
            if (!searchTerm) {
                isFirstSearch.current = false;
                return;
            }
        }

        setCurrentPage(1);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            dispatch(fetchEnterprisesAdmin({ page: 1, search: searchTerm }));
            debounceRef.current = null;
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [dispatch, searchTerm]);

    // Safe selector with fallback values
    const enterpriseState = useSelector((state) => state.adminEnterprise || {});
    const {
        enterpriseList = [],
        loading = false,
        totalPages = 1,
        totalEnterprises = 0
    } = enterpriseState;

    // Get unique locations for filter
    const uniqueLocations = [...new Set(enterpriseList?.map((e) => e.location))].filter(Boolean);

    // Apply filters
    const getFilteredData = () => {
        let data = enterpriseList || [];

        // Apply location filter
        if (locationFilter !== "all") {
            data = data.filter((enterprise) => enterprise.location === locationFilter);
        }

        return data;
    };

    const filteredData = getFilteredData();

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Handle refresh
    const handleRefresh = () => {
        dispatch(fetchEnterprisesAdmin({ page: currentPage, search: searchTerm }));
    };

    // Handle delete enterprise
    const handleDeleteEnterprise = (enterpriseId) => {
        if (window.confirm("Are you sure you want to delete this enterprise?")) {
            dispatch(deleteEnterpriseByAdmin(enterpriseId))
                .unwrap()
                .then(() => {
                    toast.success("Enterprise deleted successfully");
                })
                .catch((error) => {
                    toast.error(`Failed to delete Enterprise: ${error || "Unknown error"}`);
                });
        }
    };

    // Handle view enterprise details
    const handleViewEnterprise = (enterpriseId) => {
        dispatch(fetchEnterpriseById(enterpriseId))
            .unwrap()
            .then(() => {
                // You can add a modal or navigate to a details page here
                toast.success("Enterprise details loaded");
            })
            .catch((error) => {
                toast.error(`Failed to load enterprise details: ${error || "Unknown error"}`);
            });
    };

    // Handle enterprise expansion and fetch data
    const handleEnterpriseToggle = async (enterpriseId) => {
        if (expandedEnterprise === enterpriseId) {
            setExpandedEnterprise(null);
        } else {
            setExpandedEnterprise(enterpriseId);
            setSelectedTab("teachers");

            // Fetch teachers and courses for this enterprise
            if (!enterpriseData[enterpriseId]) {
                try {
                    // Fetch teachers
                    const teachersResponse = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/enterprise/teacher/${enterpriseId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    const teachersData = await teachersResponse.json();

                    // Fetch courses
                    const coursesResponse = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/enterprise/courses?enterprise_id=${enterpriseId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    const coursesData = await coursesResponse.json();

                    setEnterpriseData((prev) => ({
                        ...prev,
                        [enterpriseId]: {
                            teachers: teachersData.data || [],
                            courses: coursesData.data || [],
                            loading: false,
                        },
                    }));
                } catch (error) {
                    console.error("Error fetching enterprise data:", error);
                    toast.error("Failed to load enterprise details");
                    setEnterpriseData((prev) => ({
                        ...prev,
                        [enterpriseId]: {
                            teachers: [],
                            courses: [],
                            loading: false,
                        },
                    }));
                }
            }
        }
    };

    useEffect(() => {
        console.log('Enterprise state:', enterpriseState);
        console.log('Filtered data:', filteredData);
    }, [enterpriseState, filteredData]);
    return (
        <div className="p-6 overflow-auto">
            <div className="mb-6">
                <h2
                    className="text-xl font-medium mb-2"
                    style={{ color: colors.primary }}
                >
                    Enterprise Management
                </h2>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                    View and manage all enterprises across the platform
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
                        placeholder="Search enterprises..."
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
                    {/* Location filter dropdown */}
                    {uniqueLocations.length > 0 && (
                        <div className="relative">
                            <button
                                className="flex items-center px-3 py-2 rounded-lg"
                                style={{
                                    backgroundColor:
                                        locationFilter !== "all"
                                            ? `${colors.primary}20`
                                            : colors.inputBg,
                                    color: locationFilter !== "all" ? colors.primary : colors.text,
                                    border: `1px solid ${colors.borderColor}`,
                                }}
                                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                            >
                                <span>{locationFilter === "all" ? "All Locations" : locationFilter}</span>
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </button>

                            {showLocationDropdown && (
                                <div
                                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto"
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
                                                    locationFilter === "all"
                                                        ? `${colors.primary}20`
                                                        : "transparent",
                                                color: colors.text,
                                            }}
                                            onClick={() => {
                                                setLocationFilter("all");
                                                setShowLocationDropdown(false);
                                            }}
                                        >
                                            All Locations
                                        </button>

                                        {uniqueLocations.map((location) => (
                                            <button
                                                key={location}
                                                className="w-full text-left px-4 py-2 text-sm"
                                                style={{
                                                    backgroundColor:
                                                        locationFilter === location
                                                            ? `${colors.primary}20`
                                                            : "transparent",
                                                    color: colors.text,
                                                }}
                                                onClick={() => {
                                                    setLocationFilter(location);
                                                    setShowLocationDropdown(false);
                                                }}
                                            >
                                                {location}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

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

                    {/* Add new enterprise button */}
                    <button
                        className="flex items-center px-3 py-2 rounded-lg text-sm"
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.lightText,
                        }}
                        onClick={() => setShowEnterpriseModal(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Enterprise
                    </button>
                </div>
            </div>

            {/* Enterprise Table */}
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
                                Enterprise Name
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Location
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Token Price
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Users
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Freemium Period
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                style={{color: colors.textMuted}}
                            >
                                Created Date
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
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-4 text-center"
                                    style={{ color: colors.textMuted }}
                                >
                                    No enterprises found matching your criteria
                                </td>
                            </tr>
                        ) : (
                            filteredData?.map((enterprise, index) => (
                                <React.Fragment key={enterprise.id}>
                                <tr
                                    style={{
                                        borderTop:
                                            index !== 0
                                                ? `1px solid ${colors.borderColor}`
                                                : "none",
                                        backgroundColor:
                                            index % 2 === 0 ? colors.cardBg : colors.cardBgAlt,
                                    }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div
                                                className="w-8 h-8 px-2 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3"
                                                style={{
                                                    backgroundColor: enterprise.theme?.colour || colors.primary,
                                                }}
                                            >
                                                <Building2 className="w-4 h-4"/>
                                            </div>
                                            <div
                                                className="font-medium"
                                                style={{color: colors.text}}
                                            >
                                                {enterprise.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{color: colors.text}}
                                    >
                                        <div className="flex items-center">
                                            <MapPin
                                                className="w-3 h-3 mr-1"
                                                style={{color: colors.textMuted}}
                                            />
                                            {enterprise.location}
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{color: colors.text}}
                                    >
                                        <span
                                            className="px-2 py-1 text-xs rounded-full"
                                            style={{
                                                backgroundColor: `${colors.primary}20`,
                                                color: colors.primary,
                                            }}
                                        >
                                            {enterprise.default_token_price || 0} sparks
                                        </span>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{color: colors.text}}
                                    >
                                        <div className="flex items-center">
                                            <Users
                                                className="w-3 h-3 mr-1"
                                                style={{color: colors.textMuted}}
                                            />
                                            <span
                                                className="px-2 py-1 text-xs rounded-full"
                                                style={{
                                                    backgroundColor: `${colors.accent}20`,
                                                    color: colors.accent,
                                                }}
                                            >
                                                {enterprise.user_id ? '1' : '0'}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{color: colors.text}}
                                    >
                                        <div className="flex items-center">
                                            <Clock
                                                className="w-3 h-3 mr-1"
                                                style={{color: colors.textMuted}}
                                            />
                                            {enterprise.default_freemium_period ?
                                                `${enterprise.default_freemium_period} hours` :
                                                'N/A'
                                            }
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm"
                                        style={{color: colors.text}}
                                    >
                                        <div className="flex items-center">
                                            <Calendar
                                                className="w-3 h-3 mr-1"
                                                style={{color: colors.textMuted}}
                                            />
                                            {formatDate(enterprise.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 rounded"
                                                style={{color: colors.primary}}
                                                title="View Details"
                                                onClick={() => handleEnterpriseToggle(enterprise.id)}
                                            >
                                                {expandedEnterprise === enterprise.id ? (
                                                    <ChevronUp className="w-4 h-4"/>
                                                ) : (
                                                    <ChevronDown className="w-4 h-4"/>
                                                )}
                                            </button>
                                            <button
                                                className="p-1 rounded"
                                                style={{color: colors.accent}}
                                                title="Edit Enterprise"
                                                onClick={() => {
                                                    setEnterpriseInfo(enterprise);
                                                    setShowEnterpriseModal(true);
                                                }}
                                            >
                                                <Edit className="w-4 h-4"/>
                                            </button>
                                            <button
                                                className="p-1 rounded"
                                                style={{color: colors.error}}
                                                title="Delete Enterprise"
                                                onClick={() => handleDeleteEnterprise(enterprise.id)}
                                            >
                                                <Trash className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Expanded Content Row */}
                                {expandedEnterprise === enterprise.id && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4" style={{backgroundColor: colors.cardBgAlt}}>
                                            {/* Tabs */}
                                            <div className="flex space-x-4 mb-4 border-b" style={{borderColor: colors.borderColor}}>
                                                <button
                                                    onClick={() => setSelectedTab("teachers")}
                                                    className="px-4 py-2 font-medium transition-colors"
                                                    style={{
                                                        color: selectedTab === "teachers" ? colors.primary : colors.text,
                                                        borderBottom: selectedTab === "teachers" ? `2px solid ${colors.primary}` : "none",
                                                    }}
                                                >
                                                    <Users className="w-4 h-4 inline mr-2"/>
                                                    Teachers ({enterpriseData[enterprise.id]?.teachers?.length || 0})
                                                </button>
                                                <button
                                                    onClick={() => setSelectedTab("courses")}
                                                    className="px-4 py-2 font-medium transition-colors"
                                                    style={{
                                                        color: selectedTab === "courses" ? colors.primary : colors.text,
                                                        borderBottom: selectedTab === "courses" ? `2px solid ${colors.primary}` : "none",
                                                    }}
                                                >
                                                    <BookOpen className="w-4 h-4 inline mr-2"/>
                                                    Courses ({enterpriseData[enterprise.id]?.courses?.length || 0})
                                                </button>
                                                <button
                                                    onClick={() => setSelectedTab("students")}
                                                    className="px-4 py-2 font-medium transition-colors"
                                                    style={{
                                                        color: selectedTab === "students" ? colors.primary : colors.text,
                                                        borderBottom: selectedTab === "students" ? `2px solid ${colors.primary}` : "none",
                                                    }}
                                                >
                                                    <GraduationCap className="w-4 h-4 inline mr-2"/>
                                                    Students (N/A)
                                                </button>
                                            </div>

                                            {/* Tab Content */}
                                            <div className="min-h-[200px]">
                                                {/* Teachers Tab */}
                                                {selectedTab === "teachers" && (
                                                    <div>
                                                        {enterpriseData[enterprise.id]?.loading ? (
                                                            <div className="flex justify-center py-8">
                                                                <RefreshCw className="w-6 h-6 animate-spin" style={{color: colors.primary}}/>
                                                            </div>
                                                        ) : enterpriseData[enterprise.id]?.teachers?.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {enterpriseData[enterprise.id].teachers.map((teacher) => (
                                                                    <div
                                                                        key={teacher.id}
                                                                        className="flex items-center justify-between p-3 rounded-lg"
                                                                        style={{backgroundColor: colors.cardBg}}
                                                                    >
                                                                        <div>
                                                                            <p className="font-medium" style={{color: colors.text}}>
                                                                                {teacher.name}
                                                                            </p>
                                                                            <p className="text-sm" style={{color: colors.textMuted}}>
                                                                                {teacher.email_address}
                                                                            </p>
                                                                        </div>
                                                                        <div className="text-sm" style={{color: colors.textMuted}}>
                                                                            {teacher.organization || "N/A"}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-center py-8" style={{color: colors.textMuted}}>
                                                                No teachers found
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Courses Tab */}
                                                {selectedTab === "courses" && (
                                                    <div>
                                                        {enterpriseData[enterprise.id]?.loading ? (
                                                            <div className="flex justify-center py-8">
                                                                <RefreshCw className="w-6 h-6 animate-spin" style={{color: colors.primary}}/>
                                                            </div>
                                                        ) : enterpriseData[enterprise.id]?.courses?.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {enterpriseData[enterprise.id].courses.map((course) => (
                                                                    <div
                                                                        key={course.id}
                                                                        className="p-4 rounded-lg"
                                                                        style={{backgroundColor: colors.cardBg}}
                                                                    >
                                                                        <h4 className="font-medium mb-2" style={{color: colors.text}}>
                                                                            {course.title}
                                                                        </h4>
                                                                        <p className="text-sm mb-2" style={{color: colors.textMuted}}>
                                                                            {course.description}
                                                                        </p>
                                                                        <div className="flex items-center justify-between text-xs" style={{color: colors.textMuted}}>
                                                                            <span>Status: {course.status}</span>
                                                                            <span>Category: {course.category}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-center py-8" style={{color: colors.textMuted}}>
                                                                No courses found
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Students Tab */}
                                                {selectedTab === "students" && (
                                                    <div>
                                                        <p className="text-center py-8" style={{color: colors.textMuted}}>
                                                            Student data endpoint not yet implemented
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </React.Fragment>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div
                        className="px-6 py-3 flex items-center justify-between border-t"
                        style={{borderColor: colors.borderColor}}
                    >
                        <div className="text-sm" style={{color: colors.textMuted}}>
                            Showing {(currentPage - 1) * 10 + 1} to{" "}
                            {(currentPage - 1) * 10 + filteredData.length} of{" "}
                            {totalEnterprises} enterprises
                        </div>
                        <div className="flex space-x-1">
                            <button
                                className="px-3 py-1 rounded text-sm"
                                style={{
                                    backgroundColor:
                                        currentPage === 1 ? "transparent" : colors.inputBg,
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
                                            backgroundColor:
                                                currentPage === pageNum
                                                    ? colors.primary
                                                    : colors.inputBg,
                                            color:
                                                currentPage === pageNum
                                                    ? colors.lightText
                                                    : colors.text,
                                            border: `1px solid ${
                                                currentPage === pageNum
                                                    ? colors.primary
                                                    : colors.borderColor
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
                                    backgroundColor:
                                        currentPage === totalPages ? "transparent" : colors.inputBg,
                                    color:
                                        currentPage === totalPages ? colors.textMuted : colors.text,
                                    cursor:
                                        currentPage === totalPages ? "not-allowed" : "pointer",
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

            {/* Create/Edit Enterprise Modal */}
            <CreateEnterpriseModal
                showModal={showEnterpriseModal}
                setShowModal={setShowEnterpriseModal}
                enterpriseInfo={enterpriseInfo}
                onClose={() => setEnterpriseInfo(null)}
            />
        </div>
    );
};

export default EnterpriseManagement;