import React, { useState, useEffect } from "react";
import {
    Home,
    Users,
    BookOpen,
    FileText,
    BarChart2,
    Settings,
    Shield,
    Menu,
    X,
    Activity,
    Database,
    AlertTriangle,
    BookOpen as BookIcon,
    User,
    Package,
    CircleDollarSign,
    DollarSign,
    Upload,
    Receipt,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import Logo1 from "../../../assets/LOGO-01.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Sidebar = ({
    activeSection,
    setActiveSection,
    isSidebarOpen,
    setIsSidebarOpen,
}) => {
    const { colors } = useTheme();
    const [alerts, setAlerts] = useState(2); // Number of system alerts
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
        console.log("Pathname changed:", pathname);
    }, [pathname])
    return (
        <>
            {/* Mobile Sidebar Toggle */}
            <div
                className="flex lg:hidden justify-between items-center p-4 border-b"
                style={{
                    backgroundColor: colors.sidebarBg,
                    borderColor: colors.borderColor,
                }}
            >
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-md shadow-md hover:bg-opacity-20 transition-colors"
                    style={{ backgroundColor: colors.cardBg, color: colors.text }}
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="font-bold" style={{ color: colors.primary }}>
                    Admin Dashboard
                </span>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 w-64 h-screen shadow-lg border-r transition-transform duration-300 ease-in-out z-50 overflow-y-auto 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:static`}
                style={{
                    backgroundColor: colors.sidebarBg,
                    borderColor: colors.borderColor,
                }}
            >
                {/* Close button - only visible on mobile when sidebar is open */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-20 transition-colors lg:hidden"
                    style={{ backgroundColor: colors.cardBg, color: colors.text }}
                    aria-label="Close sidebar"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Logo */}
                <div
                    className="p-5 flex justify-center border-b"
                    style={{ borderColor: colors.borderColor }}
                >
                    <div className="h-16">
                        <img src={Logo1} alt="Cravta Logo" className="h-20 w-auto" />
                    </div>
                </div>

                {/* Admin Profile Section */}
                <div className="p-5">
                    <div className="flex items-center space-x-3 mb-8">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                            }}
                        >
                            A
                        </div>
                        <div>
                            <p className="font-medium" style={{ color: colors.primary }}>
                                Admin Console
                            </p>
                            <div className="flex items-center space-x-2">
                                <p className="text-xs" style={{ color: colors.textMuted }}>
                                    Super Administrator
                                </p>
                                <span
                                    className="text-xs px-1.5 py-0.5 rounded"
                                    style={{
                                        backgroundColor: `${colors.accent}30`,
                                        color: colors.accent,
                                    }}
                                >
                                    SUPER
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav>
                        <ul className="space-y-1">
                            {/* {user?.role?.rights?.includes("overview") &&
                                <li>
                                    <button
                                        onClick={() => navigate("/admin/overview")}
                                        className="flex items-center px-3 py-2.5 rounded w-full text-left"
                                        style={{
                                            backgroundColor:
                                                (pathname === "/admin/overview")
                                                    ? colors.navActiveBg
                                                    : "transparent",
                                            color:
                                                (pathname === "/admin/overview")
                                                    ? colors.primary
                                                    : colors.text,
                                        }}
                                    >
                                        <Home
                                            className="w-5 h-5 mr-3"
                                            style={{ color: colors.primary }}
                                        />
                                        Dashboard Overview
                                    </button>
                                </li>
                            } */}
                            <li>
                                <button
                                    onClick={() => navigate("/admin/overview")}
                                    className="flex items-center px-3 py-2.5 rounded w-full text-left"
                                    style={{
                                        backgroundColor:
                                            (pathname === "/admin/overview")
                                                ? colors.navActiveBg
                                                : "transparent",
                                        color:
                                            (pathname === "/admin/overview") ? colors.primary : colors.text,
                                    }}
                                >
                                    <Home
                                        className="w-5 h-5 mr-3"
                                        style={{ color: colors.primary }}
                                    />
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/market/marketplace")}
                                    className="flex items-center px-3 py-2.5 rounded w-full text-left"
                                    style={{
                                        backgroundColor:
                                            (pathname.includes("/market/marketplace"))
                                                ? colors.navActiveBg
                                                : "transparent",
                                        color:
                                            (pathname.includes("/market/marketplace")) ? colors.primary : colors.text,
                                    }}
                                >
                                    <BookOpen
                                        className="w-5 h-5 mr-3"
                                        style={{ color: colors.primary }}
                                    />
                                    Marketplace
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/market/content-upload")}
                                    className="flex items-center px-3 py-2.5 rounded w-full text-left"
                                    style={{
                                        backgroundColor:
                                            (pathname === "/market/content-upload")
                                                ? colors.navActiveBg
                                                : "transparent",
                                        color:
                                            (pathname === "/market/content-upload") ? colors.primary : colors.text,
                                    }}
                                >
                                    <Upload
                                        className="w-5 h-5 mr-3"
                                        style={{ color: colors.primary }}
                                    />
                                    Upload Content
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/market/commission")}
                                    className="flex items-center px-3 py-2.5 rounded w-full text-left"
                                    style={{
                                        backgroundColor:
                                            (pathname === "/market/commission")
                                                ? colors.navActiveBg
                                                : "transparent",
                                        color:
                                            (pathname === "/market/commission") ? colors.primary : colors.text,
                                    }}
                                >
                                    <DollarSign
                                        className="w-5 h-5 mr-3"
                                        style={{ color: colors.primary }}
                                    />
                                    Commission
                                </button>
                            </li>
                            {/* <li>
                                <button
                                    onClick={() => navigate("/market/purchase-track")}
                                    className="flex items-center px-3 py-2.5 rounded w-full text-left"
                                    style={{
                                        backgroundColor:
                                            (pathname === "/market/purchase-track")
                                                ? colors.navActiveBg
                                                : "transparent",
                                        color:
                                            (pathname === "/market/purchase-track") ? colors.primary : colors.text,
                                    }}
                                >
                                    <BarChart2
                                        className="w-5 h-5 mr-3"
                                        style={{ color: colors.primary }}
                                    />
                                    Sales Analytics
                                </button>
                            </li> */}
                            {/* <li>
                                <button
                                    onClick={() => navigate("/market/currency")}
                                    className="flex items-center px-3 py-2.5 rounded w-full text-left"
                                    style={{
                                        backgroundColor:
                                            (pathname === "/market/currency")
                                                ? colors.navActiveBg
                                                : "transparent",
                                        color:
                                            (pathname === "/market/currency") ? colors.primary : colors.text,
                                    }}
                                >
                                    <Receipt
                                        className="w-5 h-5 mr-3"
                                        style={{ color: colors.primary }}
                                    />
                                    Exchange Currency
                                </button>
                            </li> */}
                        </ul>
                    </nav>
                </div>

                {/* Platform Status */}
                {/* <div
                    className="p-4 mx-4 mt-8 rounded-lg"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className="text-sm font-medium"
                            style={{ color: colors.text }}
                        >
                            Platform Status
                        </span>
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.success }}
                        ></div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div
                                className="flex items-center text-xs"
                                style={{ color: colors.textMuted }}
                            >
                                <Activity className="w-3 h-3 mr-1" />
                                System
                            </div>
                            <span className="text-xs" style={{ color: colors.success }}>
                                Online
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div
                                className="flex items-center text-xs"
                                style={{ color: colors.textMuted }}
                            >
                                <Database className="w-3 h-3 mr-1" />
                                Database
                            </div>
                            <span className="text-xs" style={{ color: colors.success }}>
                                Healthy
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div
                                className="flex items-center text-xs"
                                style={{ color: colors.textMuted }}
                            >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Alerts
                            </div>
                            <span
                                className="text-xs"
                                style={{
                                    color: alerts > 0 ? colors.accentSecondary : colors.success,
                                }}
                            >
                                {alerts > 0 ? `${alerts} Active` : "None"}
                            </span>
                        </div>
                    </div>
                </div> */}
            </aside>
        </>
    );
};

export default Sidebar;
