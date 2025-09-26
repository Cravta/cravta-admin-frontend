import React, { useEffect, useState } from "react";
import {
  Bell,
  Settings,
  Moon,
  Sun,
  DollarSign,
  Download,
  BarChart2,
  User,
  Users,
  FileText,
  PieChart,
  Filter,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
} from "lucide-react";
import Logo1 from "../../assets/LOGO-01.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentTransactions, fetchSalesComission } from "../../store/admin/market/salesSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../../contexts/ThemeContext";

const CommissionManagement = () => {
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState("This Month");
  const {commission,recentTransactions} = useSelector((state) => state.sales);
  useEffect(() => {
    dispatch(fetchSalesComission())
    dispatch(fetchRecentTransactions())
  }, [dispatch]);
  // Colors for dark mode
  // const colors = {
  //   primary: "#bb86fc",
  //   secondary: "#3700b3",
  //   accent: "#03dac6",
  //   accentLight: "#018786",
  //   accentSecondary: "#cf6679",
  //   text: "#e0e0e0",
  //   lightText: "#ffffff",
  //   background: "#121212",
  //   cardBg: "#1e1e1e",
  //   cardBgAlt: "#2d2d2d",
  //   borderColor: "#333333",
  //   sidebarBg: "#1a1a1a",
  //   navActiveBg: "rgba(187, 134, 252, 0.12)",
  //   inputBg: "#2d2d2d",
  // };

  // Mock commission data
  const commissionData = {
    totalCommission: 12580,
    pendingPayouts: 3450,
    totalSales: 125800,
    salesCount: 423,
    topSellers: [
      { id: 1, name: "Dr. Smith", totalSales: 32500, commission: 3250 },
      { id: 2, name: "Prof. Johnson", totalSales: 28700, commission: 2870 },
      { id: 3, name: "Sarah Williams", totalSales: 19400, commission: 1940 },
      { id: 4, name: "Dr. Miller", totalSales: 18500, commission: 1850 },
      { id: 5, name: "Jennifer Adams", totalSales: 14300, commission: 1430 },
    ],
    recentTransactions: [
      {
        id: 1,
        seller: "Dr. Smith",
        product: "Advanced Algebra Workbook",
        amount: 250,
        commission: 25,
        date: "2023-05-18",
      },
      {
        id: 2,
        seller: "Prof. Johnson",
        product: "Chemistry Lab Experiments",
        amount: 320,
        commission: 32,
        date: "2023-05-17",
      },
      {
        id: 3,
        seller: "Dr. Miller",
        product: "Physics Problem Solving",
        amount: 300,
        commission: 30,
        date: "2023-05-17",
      },
      {
        id: 4,
        seller: "Sarah Williams",
        product: "English Literature Analysis",
        amount: 190,
        commission: 19,
        date: "2023-05-16",
      },
      {
        id: 5,
        seller: "Jennifer Adams",
        product: "Biology Illustrated Guide",
        amount: 350,
        commission: 35,
        date: "2023-05-16",
      },
      {
        id: 6,
        seller: "Dr. Smith",
        product: "Geometry Fundamentals",
        amount: 220,
        commission: 22,
        date: "2023-05-15",
      },
      {
        id: 7,
        seller: "Prof. Johnson",
        product: "Trigonometry Made Easy",
        amount: 280,
        commission: 28,
        date: "2023-05-15",
      },
      {
        id: 8,
        seller: "Dr. Davis",
        product: "World History: Modern Era",
        amount: 280,
        commission: 28,
        date: "2023-05-14",
      },
    ],
    monthlySummary: [
      { month: "Jan", sales: 9200, commission: 920 },
      { month: "Feb", sales: 10500, commission: 1050 },
      { month: "Mar", sales: 12300, commission: 1230 },
      { month: "Apr", sales: 15800, commission: 1580 },
      { month: "May", sales: 14700, commission: 1470 },
    ],
  };

  return (
    <div
      className="flex"
      style={{ backgroundColor: colors.background }}
    >

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - admin version */}
        {/* <header
          className="flex items-center justify-between p-4 shadow-md"
          style={{ backgroundColor: colors.cardBgAlt }}
        > */}
          {/* <div className="flex items-center">
            <h2
              className="text-xl font-medium"
              style={{ color: colors.accent }}
            >
              Commission Management
            </h2>
          </div> */}

          {/* <div className="flex items-center space-x-4"> */}
            {/* Search bar */}
            {/* <div className="relative" style={{ width: "250px" }}>
              <input
                type="text"
                placeholder="Search transactions..."
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
            </div> */}

            {/* Header buttons */}
            {/* <button
              className="p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(3, 218, 198, 0.05)" }}
            >
              <Settings className="w-5 h-5" style={{ color: colors.accent }} />
            </button>

            <button
              className="p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(3, 218, 198, 0.05)" }}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" style={{ color: colors.primary }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: colors.accent }} />
              )}
            </button>

            <button
              className="p-2 rounded-full hover:bg-opacity-20 relative"
              style={{ backgroundColor: "rgba(3, 218, 198, 0.05)" }}
            >
              <Bell className="w-5 h-5" style={{ color: colors.accent }} />
              <span
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.accentSecondary }}
              ></span>
            </button> */}

            {/* <div
              className="w-8 h-8 rounded overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #03dac6 0%, #018786 100%)",
              }}
            ></div> */}
          {/* </div>
        </header> */}

        {/* Commission Management Content */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: colors.background }}
        >
          {/* Filter and Date Range */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <button
                className="flex items-center px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <Filter
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.accent }}
                />
                <span>Filter</span>
                <ChevronDown
                  className="w-4 h-4 ml-2"
                  style={{ color: colors.accent }}
                />
              </button>

              <button
                className="flex items-center px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colors.cardBgAlt,
                  color: colors.text,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <Calendar
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.accent }}
                />
                <span>{dateRange}</span>
                <ChevronDown
                  className="w-4 h-4 ml-2"
                  style={{ color: colors.accent }}
                />
              </button>
            </div>

            <button
              className="flex items-center px-4 py-2 rounded-lg"
              style={{
                backgroundColor: "rgba(3, 218, 198, 0.1)",
                color: colors.accent,
                border: `1px solid ${colors.accent}`,
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Export Report</span>
            </button>
          </div>

          {/* Summary Cards */}
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
                Total Commission
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
                  {commission?.totalCommission??0}
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.accent }}>
                +12.5% from last month
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
                Pending Payouts
              </p>
              <div className="flex items-center mb-2">
                <Sparkles
                  className="w-5 h-5 mr-2"
                  style={{ color: colors.accentSecondary }}
                />
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.lightText }}
                >
                  {/* {commissionData.pendingPayouts} */}
                  {commission?.pendingPayouts??0}
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.accentSecondary }}>
                0 teacher payouts pending
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
                Total Sales
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
                  {commission?.totalSalesAmount??0}
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.primary }}>
                +8.3% from last month
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
                Total Transactions
              </p>
              <div className="flex items-center mb-2">
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.lightText }}
                >
                  {commission?.totalTransactions??0}
                </span>
              </div>
              <p
                className="text-xs"
                style={{ color: "rgba(224, 224, 224, 0.7)" }}
              >
                Across {commission?.topSellers?.length??0} sellers
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div
              className="col-span-2 rounded-lg shadow-md p-5"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium" style={{ color: colors.accent }}>
                  Monthly Commission Overview
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
                  <div className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: colors.accent }}
                    ></span>
                    <span
                      className="text-xs"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Commission
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div
                className="h-64 rounded-lg"
                style={{ backgroundColor: colors.cardBg }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={commission?.monthlySummary} barCategoryGap={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} />
                    <XAxis dataKey="month" stroke={colors.text} />
                    <YAxis stroke={colors.text} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.cardBgAlt,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                      labelStyle={{ color: colors.lightText }}
                      itemStyle={{ color: colors.text }}
                    />
                    <Bar
                      dataKey="sales"
                      fill={colors.primary}
                      radius={[4, 4, 0, 0]}
                      name="Sales"
                    />
                    <Bar
                      dataKey="commission"
                      fill={colors.accent}
                      radius={[4, 4, 0, 0]}
                      name="Commission"
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                <h3 className="font-medium" style={{ color: colors.accent }}>
                  Top Sellers
                </h3>
                <PieChart
                  className="w-5 h-5"
                  style={{ color: colors.accent }}
                />
              </div>

              <div className="space-y-4">
                {commission?.topSellers?.slice(0, 5).map((seller, index) => (
                  <div
                    key={seller?.seller_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "rgba(3, 218, 198, 0.1)"
                              : colors.cardBg,
                          color: index === 0 ? colors.accent : colors.text,
                        }}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: colors.lightText }}
                        >
                          {seller?.seller_name??"user"}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(224, 224, 224, 0.5)" }}
                        >
                          Sales:{" "}
                          <span style={{ color: colors.primary }}>
                            {seller?.total_sales??0}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Sparkles
                        className="w-4 h-4 mr-1"
                        style={{ color: colors.accent }}
                      />
                      <span style={{ color: colors.text }}>
                        {seller?.total_commission??0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(3, 218, 198, 0.1)",
                  color: colors.accent,
                }}
              >
                View All Sellers
              </button>
            </div>
          </div>

          {/* Recent Transactions Table */}
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
              <h3 className="font-medium" style={{ color: colors.accent }}>
                Recent Transactions
              </h3>
              <span style={{ color: "rgba(224, 224, 224, 0.7)" }}>
                Showing {recentTransactions?.total??0} of{" "}
                {recentTransactions?.total??0} transactions
              </span>
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
                      Seller
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
                      Sale Amount
                    </th>
                    <th
                      className="py-3 px-4 text-right"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Discounted Amount
                    </th>
                    <th
                      className="py-3 px-4 text-right"
                      style={{ color: "rgba(224, 224, 224, 0.7)" }}
                    >
                      Commission (25%)
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
                  {recentTransactions?.transactions?.map((transaction) => (
                      <tr
                          key={transaction.id}
                          className="border-t"
                          style={{borderColor: colors.borderColor}}
                      >
                        <td className="py-3 px-4" style={{color: colors.text}}>
                          #{transaction.transaction_id}
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
                                  style={{color: colors.primary}}
                              />
                            </div>
                            <span style={{color: colors.lightText}}>
                            {transaction.seller}
                          </span>
                          </div>
                        </td>
                        <td className="py-3 px-4" style={{color: colors.text}}>
                          {transaction.product}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end">
                            <Sparkles
                                className="w-4 h-4 mr-1"
                                style={{color: colors.primary}}
                            />
                            <span style={{color: colors.lightText}}>
                            {transaction.sale_amount}
                          </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end">
                            <Sparkles
                                className="w-4 h-4 mr-1"
                                style={{color: colors.accent}}
                            />
                            <span style={{color: colors.accent}}>
                            {transaction.discount_amount}
                          </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end">
                            <Sparkles
                                className="w-4 h-4 mr-1"
                                style={{color: colors.accent}}
                            />
                            <span style={{color: colors.accent}}>
                            {transaction.commission}
                          </span>
                          </div>
                        </td>
                        <td
                            className="py-3 px-4"
                            style={{color: "rgba(224, 224, 224, 0.7)"}}
                        >
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/* <div
              className="p-4 border-t flex justify-between items-center"
              style={{ borderColor: colors.borderColor }}
            >
              <button
                className="px-3 py-1 rounded flex items-center"
                style={{
                  backgroundColor: "rgba(3, 218, 198, 0.1)",
                  color: colors.accent,
                }}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex items-center">
                <span style={{ color: colors.text }}>
                  Page {currentPage} of 5
                </span>
              </div>

              <button
                className="px-3 py-1 rounded flex items-center"
                style={{
                  backgroundColor: "rgba(3, 218, 198, 0.1)",
                  color: colors.accent,
                }}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionManagement;
