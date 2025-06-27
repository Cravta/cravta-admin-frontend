import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../middleware/ProtectedRoute";
import MarketPlace from "../pages/Marketplace/MarketPlace";
import MarketPlaceLayout from "../layouts/MarketLayout";
import ProductDetail from "../pages/Marketplace/ProductDetail";
import CommissionManagement from "../pages/Marketplace/CommissionManagement";
import ContentUpload from "../pages/Marketplace/ContentUploadTeachers";
import PurchaseTracking from "../pages/Marketplace/PurchaseTracking";
import { Currency } from "lucide-react";
import CurrencyExchange from "../pages/Marketplace/CurrencyExchange";

export default function MarketPlaceRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><MarketPlaceLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="marketplace" replace />} />
        <Route path="marketplace" element={<MarketPlace />} />
        <Route path="marketplace/product/:id" element={<ProductDetail />} />
        <Route path="commission" element={<CommissionManagement />} />
        <Route path="content-upload" element={<ContentUpload />} />
        <Route path="purchase-track" element={<PurchaseTracking />} />
        <Route path="currency" element={<CurrencyExchange/>} />
      </Route>
    </Routes>
  );
}