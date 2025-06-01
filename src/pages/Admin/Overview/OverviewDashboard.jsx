import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  BookOpen,
  FileText,
  Award,
  Upload,
  Brain,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  ChevronDown,
  BarChart2,
  LineChart as LineChartIcon,
  UserCheck,
  BookMarked,
  MoreHorizontal,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { fetchAdminDashboard } from "../../../store/admin/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";

// Dummy data for charts
const userGrowthData = [
  { name: "Jan", teachers: 20, students: 150 },
  { name: "Feb", teachers: 25, students: 200 },
  { name: "Mar", teachers: 30, students: 250 },
  { name: "Apr", teachers: 40, students: 300 },
  { name: "May", teachers: 45, students: 380 },
  { name: "Jun", teachers: 50, students: 450 },
];

const classCreationData = [
  { name: "Jan", classes: 15 },
  { name: "Feb", classes: 20 },
  { name: "Mar", classes: 25 },
  { name: "Apr", classes: 30 },
  { name: "May", classes: 35 },
  { name: "Jun", classes: 40 },
];

const recentActivityData = [
  {
    id: 1,
    type: "signup",
    description: "New teacher signed up",
    details: "John Smith (john.smith@example.com)",
    time: "10 minutes ago",
  },
  {
    id: 2,
    type: "class",
    description: "Large class created",
    details: "Advanced Physics - 45 students enrolled",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "alert",
    description: "System alert",
    details: "Unusual spike in quiz generations detected",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "signup",
    description: "Multiple new student signups",
    details: "12 new students joined from same domain",
    time: "5 hours ago",
  },
  {
    id: 5,
    type: "usage",
    description: "High AI usage detected",
    details: "Teacher generated 50+ quizzes in 30 minutes",
    time: "1 day ago",
  },
];

const OverviewDashboard = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [timeFilter, setTimeFilter] = useState("7days");
  // const [isLoading, setIsLoading] = useState(false);
  const {dashboardData,loading} = useSelector((state) => state.dashboard);
  useEffect(() => {
    dispatch(fetchAdminDashboard());
  },[])
  // Helper function to get trend indicator and color
  const getTrendIndicator = (value) => {
    if (value > 0) {
      return {
        icon: (
          <ArrowUpRight className="w-4 h-4" style={{ color: colors.success }} />
        ),
        color: colors.success,
        text: `+${value}%`,
      };
    } else if (value < 0) {
      return {
        icon: (
          <ArrowDownRight className="w-4 h-4" style={{ color: colors.error }} />
        ),
        color: colors.error,
        text: `${value}%`,
      };
    } else {
      return {
        icon: <Minus className="w-4 h-4" style={{ color: colors.text }} />,
        color: colors.text,
        text: "0%",
      };
    }
  };

  return (
    <div className="p-6 overflow-auto">
      {/* Time filter selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium" style={{ color: colors.primary }}>
          Platform Overview
        </h2>
        <div
          className="inline-flex rounded-md shadow-sm"
          role="group"
          style={{ backgroundColor: colors.cardBg }}
        >
          {["today", "7days", "30days", "quarter"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className="px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor:
                  timeFilter === period ? colors.primary : "transparent",
                color: timeFilter === period ? colors.lightText : colors.text,
                borderRadius: timeFilter === period ? "0.375rem" : "0",
              }}
            >
              {period === "today"
                ? "Today"
                : period === "7days"
                ? "Last 7 Days"
                : period === "30days"
                ? "Last 30 Days"
                : "This Quarter"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Users KPI */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-1" style={{ color: colors.textMuted }}>
                Total Users
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {loading?"loading...":dashboardData?.totalUsers??0}
              </div>
              <div className="flex items-center">
                {getTrendIndicator(12).icon}
                <span
                  className="text-xs ml-1"
                  style={{ color: getTrendIndicator(12).color }}
                >
                  {getTrendIndicator(12).text} from last period
                </span>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Users className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
          </div>
          <div
            className="mt-4 pt-4 flex justify-between"
            style={{ borderTop: `1px solid ${colors.borderColor}` }}
          >
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Teachers
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.teacherCount??0}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Students
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.studentCount??0}
              </div>
            </div>
          </div>
        </div>

        {/* New Signups KPI */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-1" style={{ color: colors.textMuted }}>
                New Signups
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {loading?"loading...":dashboardData?.totalUsers??0}
              </div>
              <div className="flex items-center">
                {getTrendIndicator(8).icon}
                <span
                  className="text-xs ml-1"
                  style={{ color: getTrendIndicator(8).color }}
                >
                  {getTrendIndicator(8).text} from last period
                </span>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.accent}20` }}
            >
              <UserPlus className="w-6 h-6" style={{ color: colors.accent }} />
            </div>
          </div>
          <div
            className="mt-4 pt-4 flex justify-between"
            style={{ borderTop: `1px solid ${colors.borderColor}` }}
          >
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Teachers
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.teacherCount??0}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Students
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.studentCount??0}
              </div>
            </div>
          </div>
        </div>

        {/* Active Users KPI */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-1" style={{ color: colors.textMuted }}>
                Active Users
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {loading?"loading...":dashboardData?.activeUsers-10??0}
              </div>
              <div className="flex items-center">
                {getTrendIndicator(5).icon}
                <span
                  className="text-xs ml-1"
                  style={{ color: getTrendIndicator(5).color }}
                >
                  {getTrendIndicator(5).text} from last period
                </span>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.success}20` }}
            >
              <UserCheck
                className="w-6 h-6"
                style={{ color: colors.success }}
              />
            </div>
          </div>
          <div
            className="mt-4 pt-4 flex justify-between"
            style={{ borderTop: `1px solid ${colors.borderColor}` }}
          >
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                DAU
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.activeUsers-12??0}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                MAU
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.activeUsers-16??0}
              </div>
            </div>
          </div>
        </div>

        {/* Total Classes KPI */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-1" style={{ color: colors.textMuted }}>
                Total Classes
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {loading?"loading...":dashboardData?.totalClasses??0}
              </div>
              <div className="flex items-center">
                {getTrendIndicator(15).icon}
                <span
                  className="text-xs ml-1"
                  style={{ color: getTrendIndicator(15).color }}
                >
                  {getTrendIndicator(15).text} from last period
                </span>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.secondary}20` }}
            >
              <BookMarked
                className="w-6 h-6"
                style={{ color: colors.secondary }}
              />
            </div>
          </div>
          <div
            className="mt-4 pt-4 flex justify-between"
            style={{ borderTop: `1px solid ${colors.borderColor}` }}
          >
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Active
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.totalClasses??0}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Average Size
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                24 students
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Quizzes KPI */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-1" style={{ color: colors.textMuted }}>
                Total Quizzes
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {loading?"loading...":dashboardData?.totalQuizzes??0}
              </div>
              <div className="flex items-center">
                {getTrendIndicator(22).icon}
                <span
                  className="text-xs ml-1"
                  style={{ color: getTrendIndicator(22).color }}
                >
                  {getTrendIndicator(22).text} from last period
                </span>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Award className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
          </div>
          <div
            className="mt-4 pt-4 grid grid-cols-2 gap-4"
            style={{ borderTop: `1px solid ${colors.borderColor}` }}
          >
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Teacher Created
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.totalQuizzes-dashboardData?.aiQuizzes??0}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                AI Generated
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.aiQuizzes??0}
              </div>
            </div>
          </div>
        </div>

        {/* Materials Uploaded KPI */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-1" style={{ color: colors.textMuted }}>
                Materials Uploaded
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {loading?"loading...":dashboardData?.totalContent??0}
              </div>
              <div className="flex items-center">
                {getTrendIndicator(9).icon}
                <span
                  className="text-xs ml-1"
                  style={{ color: getTrendIndicator(9).color }}
                >
                  {getTrendIndicator(9).text} from last period
                </span>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.accent}20` }}
            >
              <Upload className="w-6 h-6" style={{ color: colors.accent }} />
            </div>
          </div>
          <div
            className="mt-4 pt-4 grid grid-cols-2 gap-4"
            style={{ borderTop: `1px solid ${colors.borderColor}` }}
          >
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Teacher Materials
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.teacherContent??0}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Student Materials
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.totalContent-dashboardData?.teacherContent??0}
              </div>
            </div>
          </div>
        </div>

        {/* AI Usage KPI */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-1" style={{ color: colors.textMuted }}>
                AI Feature Usage
              </div>
              <div
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {loading?"loading...":dashboardData?.aiQuizzes+dashboardData?.flashCardCount??0}
              </div>
              <div className="flex items-center">
                {getTrendIndicator(31).icon}
                <span
                  className="text-xs ml-1"
                  style={{ color: getTrendIndicator(31).color }}
                >
                  {getTrendIndicator(31).text} from last period
                </span>
              </div>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.secondary}20` }}
            >
              <Brain className="w-6 h-6" style={{ color: colors.secondary }} />
            </div>
          </div>
          <div
            className="mt-4 pt-4 grid grid-cols-2 gap-4"
            style={{ borderTop: `1px solid ${colors.borderColor}` }}
          >
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Quizzes Generated
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.aiQuizzes}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: colors.textMuted }}>
                Flashcards Generated
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {loading?"loading...":dashboardData?.flashCardCount??0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* User Growth Chart */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium" style={{ color: colors.text }}>
              User Growth
            </h3>
            <div className="flex">
              <button
                className="p-1 rounded-md hover:opacity-80"
                style={{ color: colors.text }}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-md hover:opacity-80 ml-1"
                style={{
                  color: colors.text,
                  backgroundColor: `${colors.primary}20`,
                }}
              >
                <LineChartIcon className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-md hover:opacity-80 ml-1"
                style={{ color: colors.text }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Chart would go here */}
          <div className="h-64 w-full">
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: colors.textMuted }}
            >
              <div className="text-center">
                <LineChartIcon className="w-10 h-10 mx-auto mb-3 opacity-60" />
                <p>User Growth Visualization</p>
                <p className="text-xs mt-1">Jan to Jun 2023</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex items-center mr-4">
              <div
                className="w-3 h-3 mr-1 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <span className="text-xs" style={{ color: colors.textMuted }}>
                Teachers
              </span>
            </div>
            <div className="flex items-center">
              <div
                className="w-3 h-3 mr-1 rounded-full"
                style={{ backgroundColor: colors.accent }}
              ></div>
              <span className="text-xs" style={{ color: colors.textMuted }}>
                Students
              </span>
            </div>
          </div>
        </div>

        {/* Class Creation Trend */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium" style={{ color: colors.text }}>
              Class Creation Trend
            </h3>
            <div className="flex">
              <button
                className="p-1 rounded-md hover:opacity-80"
                style={{
                  color: colors.text,
                  backgroundColor: `${colors.primary}20`,
                }}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-md hover:opacity-80 ml-1"
                style={{ color: colors.text }}
              >
                <LineChartIcon className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-md hover:opacity-80 ml-1"
                style={{ color: colors.text }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Chart would go here */}
          <div className="h-64 w-full">
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: colors.textMuted }}
            >
              <div className="text-center">
                <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-60" />
                <p>Class Creation Visualization</p>
                <p className="text-xs mt-1">Jan to Jun 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Engagement Trend */}
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium" style={{ color: colors.text }}>
              Quiz Engagement Trend
            </h3>
            <div className="flex">
              <button
                className="p-1 rounded-md hover:opacity-80"
                style={{ color: colors.text }}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-md hover:opacity-80 ml-1"
                style={{
                  color: colors.text,
                  backgroundColor: `${colors.primary}20`,
                }}
              >
                <LineChartIcon className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-md hover:opacity-80 ml-1"
                style={{ color: colors.text }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Chart would go here */}
          <div className="h-64 w-full">
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: colors.textMuted }}
            >
              <div className="text-center">
                <LineChartIcon className="w-10 h-10 mx-auto mb-3 opacity-60" />
                <p>Quiz Engagement Visualization</p>
                <p className="text-xs mt-1">Jan to Jun 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div
        className="p-6 rounded-lg shadow-sm"
        style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.borderColor}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium" style={{ color: colors.text }}>
            Recent Activity
          </h3>
          <button
            className="text-sm px-3 py-1 rounded"
            style={{
              backgroundColor: colors.inputBg,
              color: colors.textMuted,
            }}
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentActivityData.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start p-3 rounded"
              style={{
                backgroundColor: colors.cardBgAlt,
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              <div
                className="p-2 rounded-lg mr-3"
                style={{
                  backgroundColor:
                    activity.type === "alert"
                      ? `${colors.accentSecondary}20`
                      : activity.type === "signup"
                      ? `${colors.primary}20`
                      : activity.type === "class"
                      ? `${colors.accent}20`
                      : `${colors.secondary}20`,
                }}
              >
                {activity.type === "alert" ? (
                  <AlertTriangle
                    className="w-5 h-5"
                    style={{ color: colors.accentSecondary }}
                  />
                ) : activity.type === "signup" ? (
                  <UserPlus
                    className="w-5 h-5"
                    style={{ color: colors.primary }}
                  />
                ) : activity.type === "class" ? (
                  <BookOpen
                    className="w-5 h-5"
                    style={{ color: colors.accent }}
                  />
                ) : (
                  <Activity
                    className="w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-medium" style={{ color: colors.text }}>
                    {activity.description}
                  </span>
                  <span
                    className="text-xs flex items-center"
                    style={{ color: colors.textMuted }}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                  {activity.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
