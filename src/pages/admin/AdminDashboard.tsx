
import React, { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import MetricsOverview from "./MetricsOverview";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to metrics overview by default when dashboard is accessed directly
    if (window.location.pathname === "/admin") {
      navigate("/admin/metrics");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<MetricsOverview />} />
      <Route path="/metrics" element={<MetricsOverview />} />
      {/* Add other admin routes as needed */}
    </Routes>
  );
}
