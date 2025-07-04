import React, { useState } from "react";
import {
  Bell,
  Book,
  FileText,
  Home,
  Settings,
  Moon,
  Sun,
  Search,
  Filter,
  ChevronDown,
  BookOpen,
  Calendar,
  BarChart2,
  ShoppingCart,
  Sparkles,
  User,
  Download,
  TrendingUp,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Upload,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";

const PurchaseTracking = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Mock data for sales analytics
  const salesData = {
    totalSales: 83,
    totalRevenue: 19250,
    commissionPaid: 1925, // 10% commission
    netRevenue: 17325,
    sparkBalance: 12500,
    recentSales: [
      {
        id: 1,
        buyer: "Student 1",
        product: "Advanced Algebra Workbook",
        amount: 250,
        date: "2023-05-18",
      },
      {
        id: 2,
        buyer: "Teacher X",
        product: "Advanced Algebra Workbook",
        amount: 250,
        date: "2023-05-17",
      },
      {
        id: 3,
        buyer: "Student 2",
        product: "Geometry Fundamentals",
        amount: 220,
        date: "2023-05-16",
      },
      {
        id: 4,
        buyer: "Student 3",
        product: "Advanced Algebra Workbook",
        amount: 250,
        date: "2023-05-15",
      },
      {
        id: 5,
        buyer: "Teacher Y",
        product: "Geometry Fundamentals",
        amount: 220,
        date: "2023-05-14",
      },
      {
        id: 6,
        buyer: "Student 4",
        product: "Advanced Algebra Workbook",
        amount: 250,
        date: "2023-05-13",
      },
      {
        id: 7,
        buyer: "Student 5",
        product: "Geometry Fundamentals",
        amount: 220,
        date: "2023-05-12",
      },
      {
        id: 8,
        buyer: "Student 6",
        product: "Advanced Algebra Workbook",
        amount: 250,
        date: "2023-05-11",
      },
    ],
    productPerformance: [
      {
        id: 1,
        title: "Advanced Algebra Workbook",
        sales: 43,
        revenue: 10750,
        image: "algebra_cover.jpg",
      },
      {
        id: 2,
        title: "Geometry Fundamentals",
        sales: 28,
        revenue: 6160,
        image: "geometry_cover.jpg",
      },
      {
        id: 3,
        title: "Trigonometry Made Easy",
        sales: 12,
        revenue: 2340,
        image: "trigonometry_cover.jpg",
      },
    ],
    monthlySales: [
      { month: "Jan", sales: 3200 },
      { month: "Feb", sales: 4100 },
      { month: "Mar", sales: 3800 },
      { month: "Apr", sales: 4500 },
      { month: "May", sales: 3650 },
    ],
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: colors.background }}
    >

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        {/* <header
          className="flex items-center justify-between p-4 shadow-md"
          style={{ backgroundColor: colors.cardBgAlt }}
        > */}
          {/* <div className="flex items-center">
            <h2
              className="text-xl font-medium"
              style={{ color: colors.primary }}
            >
              Sales Analytics
            </h2>
          </div> */}

          {/* <div className="flex items-center space-x-4"> */}
            {/* Date Range Selector */}
            {/* <div
              className="flex items-center px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: colors.navActiveBg,
                color: colors.primary,
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <select
                className="bg-transparent border-none outline-none"
                style={{ color: colors.primary }}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Last Year">Last Year</option>
                <option value="All Time">All Time</option>
              </select>
            </div> */}

            {/* Header buttons */}
            {/* <button
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
            ></div> */}
          {/* </div> */}
        {/* </header> */}

        {/* Main Content Area */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div
              className="rounded-lg shadow-md p-5"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                Total Sales
              </p>
              <div className="flex items-center mb-2">
                <ShoppingCart
                  className="w-5 h-5 mr-2"
                  style={{ color: colors.primary }}
                />
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.lightText }}
                >
                  {salesData.totalSales}
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.primary }}>
                +12% from previous period
              </p>
            </div>

            <div
              className="rounded-lg shadow-md p-5"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                Total Revenue
              </p>
              <div className="flex items-center mb-2">
                <Sparkles
                  className="w-5 h-5 mr-2"
                  style={{ color: colors.accent }}
                />
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.lightText }}
                >
                  {salesData.totalRevenue}
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.accent }}>
                +8.5% from previous period
              </p>
            </div>

            <div
              className="rounded-lg shadow-md p-5"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                Net Revenue (After Commission)
              </p>
              <div className="flex items-center mb-2">
                <Sparkles
                  className="w-5 h-5 mr-2"
                  style={{ color: colors.primary }}
                />
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.lightText }}
                >
                  {salesData.netRevenue}
                </span>
              </div>
              <p
                className="text-xs"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                10% commission:{" "}
                <span style={{ color: colors.accentSecondary }}>
                  {salesData.commissionPaid}
                </span>
              </p>
            </div>

            <div
              className="rounded-lg shadow-md p-5"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                Current Spark Balance
              </p>
              <div className="flex items-center mb-2">
                <Sparkles
                  className="w-5 h-5 mr-2"
                  style={{ color: colors.accent }}
                />
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.lightText }}
                >
                  {salesData.sparkBalance}
                </span>
              </div>
              <button
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: "rgba(3, 218, 198, 0.1)",
                  color: colors.accent,
                }}
              >
                Exchange for Riyals
              </button>
            </div>
          </div>

          {/* Sales Chart and Product Performance */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div
              className="col-span-2 rounded-lg shadow-md p-5"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium" style={{ color: colors.primary }}>
                  Sales Trend
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: colors.primary }}
                    ></span>
                    <span
                      className="text-xs"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Sales
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div
                className="h-64 rounded-lg"
                style={{ backgroundColor: colors.cardBg }}
              >
                {/* This would be replaced with an actual chart component */}
                <div className="flex items-end justify-between h-full p-4">
                  {salesData.monthlySales.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-16"
                        style={{
                          height: `${(month.sales / 5000) * 100}%`,
                          backgroundColor: colors.primary,
                        }}
                      ></div>
                      <span
                        className="mt-2 text-xs"
                        style={{ color: colors.text }}
                      >
                        {month.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="rounded-lg shadow-md p-5"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium" style={{ color: colors.primary }}>
                  Product Performance
                </h3>
              </div>

              <div className="space-y-4">
                {salesData.productPerformance.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-2 rounded-lg"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div
                      className="w-12 h-12 rounded bg-cover bg-center mr-3"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundColor: colors.inputBg,
                      }}
                    />

                    <div className="flex-1">
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.lightText }}
                      >
                        {product.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <p
                          className="text-xs"
                          style={{ color: "rgba(224, 224, 224, 0.5)" }}
                        >
                          {product.sales} sales
                        </p>
                        <div className="flex items-center">
                          <Sparkles
                            className="w-3 h-3 mr-1"
                            style={{ color: colors.accent }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: colors.primary }}
                          >
                            {product.revenue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(187, 134, 252, 0.1)",
                  color: colors.primary,
                }}
              >
                View All Products
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div
            className="rounded-lg shadow-md overflow-hidden"
            style={{
              backgroundColor: colors.cardBgAlt,
              border: `1px solid ${colors.borderColor}`,
            }}
          >
            <div
              className="p-5 flex justify-between items-center border-b"
              style={{ borderColor: colors.borderColor }}
            >
              <h3 className="font-medium" style={{ color: colors.primary }}>
                Recent Sales
              </h3>

              <div className="flex items-center">
                <Search
                  className="w-4 h-4 mr-2"
                  style={{ color: "rgba(224, 224, 224, 0.5)" }}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="py-1 px-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.cardBg }}>
                    <th
                      className="py-3 px-4 text-left"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      ID
                    </th>
                    <th
                      className="py-3 px-4 text-left"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Buyer
                    </th>
                    <th
                      className="py-3 px-4 text-left"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Product
                    </th>
                    <th
                      className="py-3 px-4 text-right"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Amount
                    </th>
                    <th
                      className="py-3 px-4 text-left"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.recentSales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="border-t"
                      style={{ borderColor: colors.borderColor }}
                    >
                      <td className="py-3 px-4" style={{ color: colors.text }}>
                        #{sale.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                            style={{
                              backgroundColor: "rgba(187, 134, 252, 0.1)",
                            }}
                          >
                            <User
                              className="w-4 h-4"
                              style={{ color: colors.primary }}
                            />
                          </div>
                          <span style={{ color: colors.lightText }}>
                            {sale.buyer}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4" style={{ color: colors.text }}>
                        {sale.product}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <Sparkles
                            className="w-4 h-4 mr-1"
                            style={{ color: colors.primary }}
                          />
                          <span style={{ color: colors.lightText }}>
                            {sale.amount}
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-4"
                        style={{ color: "rgba(224, 224, 224, 0.7)" }}
                      >
                        {new Date(sale.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="p-4 border-t flex justify-between items-center"
              style={{ borderColor: colors.borderColor }}
            >
              <button
                className="px-3 py-1 rounded flex items-center"
                style={{
                  backgroundColor: "rgba(187, 134, 252, 0.1)",
                  color: colors.primary,
                }}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex items-center">
                <span style={{ color: colors.text }}>
                  Page {currentPage} of 3
                </span>
              </div>

              <button
                className="px-3 py-1 rounded flex items-center"
                style={{
                  backgroundColor: "rgba(187, 134, 252, 0.1)",
                  color: colors.primary,
                }}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTracking;
