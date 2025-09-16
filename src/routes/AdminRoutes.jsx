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
import RoleManagement from "../pages/Admin/Roles/RoleManagement";
import TeamManagement from "../pages/Admin/Teams/TeamManagement";
import HelpCenter from "../pages/Admin/Help/HelpCenterManagement"
import PackageManagement from "../pages/Admin/Package/PackageManagement";
import PackagePurchases from "../pages/Admin/Package/PackagePurchases"
import EnterpriseManagement from "../pages/Admin/Enterprise/EnterpriseManagment.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewDashboard />} />
        <Route path="teams"    element={<TeamManagement />} />
        <Route path="users"    element={<UserManagement />} />
        <Route path="roles"    element={<RoleManagement />} />
        <Route path="classes"  element={<ClassManagement />} />
        <Route path="/enterprise" element={<EnterpriseManagement />} />
        <Route path="content"  element={<ContentMonitoring />} />
        <Route path="blogs"    element={<BlogManagement />} />
        <Route path="packages" element={<PackageManagement />} />
        <Route path="packages-purchases" element={<PackagePurchases />} />
        <Route path="help"     element={<HelpCenter />} />
        <Route path="reports"  element={<ReportingAnalytics />} />
        <Route path="settings" element={<PlatformSettings />} />
        <Route path="audit"    element={<AuditLog />} />
      </Route>
    </Routes>
  );
}