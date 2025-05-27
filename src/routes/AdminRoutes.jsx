import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../middleware/ProtectedRoute";
import OverviewDashboard from "../pages/Admin/Overview/OverviewDashboard";
import UserManagement   from "../pages/Admin/Users/UserManagement";
import ClassManagement  from "../pages/Admin/Classes/ClassManagement";
import ContentMonitoring from "../pages/Admin/Content/ContentMonitoring";
import BlogManagement    from "../pages/Admin/Blogs/BlogManagement";
import ReportingAnalytics from "../pages/Admin/Reports/ReportingAnalytics";
import PlatformSettings from "../pages/Admin/Settings/PlatformSettings";
import AuditLog         from "../pages/Admin/Audit/AuditLog";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewDashboard />} />
        <Route path="users"    element={<UserManagement />} />
        <Route path="classes"  element={<ClassManagement />} />
        <Route path="content"  element={<ContentMonitoring />} />
        <Route path="blogs"    element={<BlogManagement />} />
        <Route path="reports"  element={<ReportingAnalytics />} />
        <Route path="settings" element={<PlatformSettings />} />
        <Route path="audit"    element={<AuditLog />} />
      </Route>
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}