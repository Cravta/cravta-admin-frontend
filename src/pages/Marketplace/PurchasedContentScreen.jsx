import React, { useState } from "react";
import {
  Bell,
  Book,
  Download,
  FileText,
  Home,
  Settings,
  Moon,
  Sun,
  Search,
  Filter,
  ChevronDown,
  Grid,
  List,
  BookOpen,
  Calendar,
  Star,
  Sparkles,
  Eye,
  ShoppingCart,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";

const PurchasedContent = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);

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

  // Mock purchased content data
  const purchasedContent = [
    {
      id: 1,
      title: "Advanced Algebra Workbook",
      author: "Dr. Smith",
      price: 250,
      type: "Workbook",
      subject: "Mathematics",
      class: "Grade 10",
      purchaseDate: "2023-05-10",
      lastOpened: "2023-05-15",
      image: "algebra_cover.jpg",
      format: "PDF",
      fileSize: "12.4 MB",
    },
    {
      id: 2,
      title: "Chemistry Lab Experiments",
      author: "Prof. Johnson",
      price: 320,
      type: "Lab Manual",
      subject: "Chemistry",
      class: "Grade 11",
      purchaseDate: "2023-05-08",
      lastOpened: "2023-05-12",
      image: "chemistry_cover.jpg",
      format: "PDF",
      fileSize: "15.7 MB",
    },
    {
      id: 6,
      title: "Biology Illustrated Guide",
      author: "Jennifer Adams",
      price: 350,
      type: "Reference",
      subject: "Biology",
      class: "Grade 10",
      purchaseDate: "2023-04-22",
      lastOpened: "2023-05-18",
      image: "biology_cover.jpg",
      format: "PDF",
      fileSize: "28.3 MB",
    },
    {
      id: 9,
      title: "Pre-Calculus Guide",
      author: "Dr. Davis",
      price: 300,
      type: "Study Guide",
      subject: "Mathematics",
      class: "Grade 11",
      purchaseDate: "2023-04-15",
      lastOpened: null, // Never opened
      image: "precalc_cover.jpg",
      format: "PDF",
      fileSize: "10.9 MB",
    },
    {
      id: 5,
      title: "Physics Problem Solving",
      author: "Dr. Miller",
      price: 300,
      type: "Practice Book",
      subject: "Physics",
      class: "Grade 11",
      purchaseDate: "2023-03-28",
      lastOpened: "2023-04-10",
      image: "physics_cover.jpg",
      format: "PDF",
      fileSize: "14.2 MB",
    },
  ];

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Sidebar */}
      <div
        className="w-64 shadow-lg"
        style={{ backgroundColor: colors.sidebarBg }}
      >
        <div
          className="p-5 flex justify-center border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <div className="h-16">
            <img src={Logo1} alt="EduGame Logo" className="h-20 w-auto" />
          </div>
        </div>

        {/* User info and navigation */}
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-8">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: colors.primary }}
            >
              JS
            </div>
            <div>
              <p className="font-medium" style={{ color: colors.primary }}>
                John Smith
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                Teacher
              </p>
            </div>
          </div>

          <nav>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <Home
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <BookOpen
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded"
                  style={{
                    backgroundColor: colors.navActiveBg,
                    color: colors.primary,
                    fontWeight: 500,
                  }}
                >
                  <Book
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  My Purchases
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2.5 rounded hover:bg-opacity-10"
                  style={{ color: colors.text, backgroundColor: "transparent" }}
                >
                  <ShoppingCart
                    className="w-5 h-5 mr-3"
                    style={{ color: colors.primary }}
                  />
                  Cart
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header
          className="flex items-center justify-between p-4 shadow-md"
          style={{ backgroundColor: colors.cardBgAlt }}
        >
          <div className="flex items-center">
            <h2
              className="text-xl font-medium"
              style={{ color: colors.primary }}
            >
              My Purchased Content
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="relative" style={{ width: "300px" }}>
              <input
                type="text"
                placeholder="Search in my content..."
                className="w-full py-2 pl-10 pr-4 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              />
              <Search
                className="absolute left-3 top-2.5 w-5 h-5"
                style={{ color: "rgba(224, 224, 224, 0.5)" }}
              />
            </div>

            {/* Header buttons */}
            <button
              className="p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
            >
              <Settings className="w-5 h-5" style={{ color: colors.primary }} />
            </button>

            <button
              className="p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" style={{ color: colors.accent }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: colors.primary }} />
              )}
            </button>

            <button
              className="p-2 rounded-full hover:bg-opacity-20 relative"
              style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
            >
              <Bell className="w-5 h-5" style={{ color: colors.primary }} />
              <span
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.accentSecondary }}
              ></span>
            </button>

            <div
              className="w-8 h-8 rounded overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #bb86fc 0%, #3700b3 100%)",
              }}
            ></div>
          </div>
        </header>

        {/* Filter Bar */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center px-3 py-2 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                color: colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter
                className="w-4 h-4 mr-2"
                style={{ color: colors.primary }}
              />
              <span>Filters</span>
              <ChevronDown
                className="w-4 h-4 ml-2"
                style={{ color: colors.primary }}
              />
            </button>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor:
                    viewMode === "grid" ? colors.navActiveBg : "transparent",
                  color: viewMode === "grid" ? colors.primary : colors.text,
                }}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor:
                    viewMode === "list" ? colors.navActiveBg : "transparent",
                  color: viewMode === "list" ? colors.primary : colors.text,
                }}
                onClick={() => setViewMode("list")}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span style={{ color: colors.text }}>Sort by:</span>
            <select
              className="py-2 px-3 rounded-lg"
              style={{
                backgroundColor: colors.inputBg,
                color: colors.text,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <option>Purchase Date (Newest)</option>
              <option>Purchase Date (Oldest)</option>
              <option>Last Opened</option>
              <option>Alphabetical</option>
              <option>Subject</option>
            </select>
          </div>
        </div>

        {/* Expanded Filter Panel (conditionally rendered) */}
        {filterOpen && (
          <div
            className="p-4 grid grid-cols-4 gap-4"
            style={{
              backgroundColor: colors.cardBgAlt,
              borderTop: `1px solid ${colors.borderColor}`,
            }}
          >
            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Subject
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <option>All Subjects</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>Chemistry</option>
                <option>Physics</option>
                <option>Biology</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Class/Grade
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <option>All Grades</option>
                <option>Grade 7</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Content Type
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <option>All Types</option>
                <option>Textbooks</option>
                <option>Workbooks</option>
                <option>Study Guides</option>
                <option>Reference</option>
                <option>Lab Manual</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Purchase Date
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <option>All Time</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          {/* Content Stats */}
          <div className="flex justify-between mb-6">
            <h3
              className="text-lg font-medium"
              style={{ color: colors.primary }}
            >
              Your Content Library ({purchasedContent.length} items)
            </h3>

            <div
              className="flex items-center space-x-1"
              style={{ color: "rgba(224, 224, 224, 0.7)" }}
            >
              <span>Total Value:</span>
              <div className="flex items-center ml-1">
                <Sparkles
                  className="w-4 h-4 mr-1"
                  style={{ color: colors.accent }}
                />
                <span style={{ color: colors.primary }}>
                  {purchasedContent.reduce((sum, item) => sum + item.price, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Content List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-3 gap-6">
              {purchasedContent.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <div
                    className="h-40 bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundColor: colors.cardBg,
                    }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                      }}
                    >
                      <span
                        className="text-xs"
                        style={{ color: colors.lightText }}
                      >
                        Purchased:{" "}
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </span>
                      {item.lastOpened && (
                        <div
                          className="flex items-center text-xs"
                          style={{ color: colors.lightText }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {new Date(item.lastOpened).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h4
                      className="font-medium mb-1"
                      style={{ color: colors.lightText }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-sm mb-2"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      by {item.author}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: colors.navActiveBg,
                          color: colors.primary,
                        }}
                      >
                        {item.subject}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: colors.navActiveBg,
                          color: colors.primary,
                        }}
                      >
                        {item.class}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: colors.navActiveBg,
                          color: colors.primary,
                        }}
                      >
                        {item.type}
                      </span>
                    </div>

                    <div
                      className="flex justify-between items-center text-xs mb-4"
                      style={{ color: colors.text }}
                    >
                      <span>
                        {item.format} • {item.fileSize}
                      </span>
                      <div className="flex items-center">
                        <Sparkles
                          className="w-3 h-3 mr-1"
                          style={{ color: colors.accent }}
                        />
                        <span>{item.price}</span>
                      </div>
                    </div>

                    <button
                      className="w-full py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#000",
                        border: `1px solid ${colors.primary}`,
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {purchasedContent.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg overflow-hidden shadow-md flex"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <div
                    className="w-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundColor: colors.cardBg,
                    }}
                  />

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h4
                          className="font-medium mb-1"
                          style={{ color: colors.lightText }}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="text-sm mb-2"
                          style={{ color: "rgba(224, 224, 224, 0.7)" }}
                        >
                          by {item.author}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Sparkles
                          className="w-4 h-4 mr-1"
                          style={{ color: colors.accent }}
                        />
                        <span style={{ color: colors.primary }}>
                          {item.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: colors.navActiveBg,
                          color: colors.primary,
                        }}
                      >
                        {item.subject}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: colors.navActiveBg,
                          color: colors.primary,
                        }}
                      >
                        {item.class}
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: colors.navActiveBg,
                          color: colors.primary,
                        }}
                      >
                        {item.type}
                      </span>
                    </div>

                    <div
                      className="flex justify-between text-xs mb-auto"
                      style={{ color: colors.text }}
                    >
                      <div>
                        <span>
                          {item.format} • {item.fileSize}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <span>
                            Purchased:{" "}
                            {new Date(item.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                        {item.lastOpened && (
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            <span>
                              Last opened:{" "}
                              {new Date(item.lastOpened).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <button
                        className="px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center"
                        style={{
                          backgroundColor: colors.primary,
                          color: "#000",
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State (would show if no purchased content) */}
          {purchasedContent.length === 0 && (
            <div
              className="rounded-lg p-10 flex flex-col items-center justify-center"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <Book
                className="w-16 h-16 mb-4"
                style={{ color: "rgba(224, 224, 224, 0.3)" }}
              />
              <p
                className="text-lg mb-2"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                You don't have any purchased content yet
              </p>
              <p
                className="text-sm text-center mb-6"
                style={{ color: "rgba(224, 224, 224, 0.5)" }}
              >
                Visit the marketplace to discover and purchase educational
                content for your classes.
              </p>
              <button
                className="px-6 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: "#000",
                }}
              >
                Go to Marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasedContent;
