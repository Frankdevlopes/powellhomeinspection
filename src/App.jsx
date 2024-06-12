import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Applayout from "./ui/Applayout";
import Signup from "./auth/Signup";
import Reports from "./pages/Reports";
import HomeDashboard from "./pages/HomeDashboard";
import ChartComponents from "./components/ChartComponents";
import PdfComponents from "./components/PdfComponents";
import FollowupReports from "./components/FollowupReports";
import Assigned from "./features/Reports/Assigned";
import ReportDashboard from "./components/Reportdashboard";
import TemplateBuilder from "./components/TemplateBuilder";
import Profile from "./auth/Profile"; // Ensure the correct import path

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="login" />} />
        <Route element={<Applayout />}>
          <Route path="/home" element={<HomeDashboard />} />
          <Route element={<Reports />}>
            <Route index element={<Navigate replace to="/reports" />} />
            <Route path="/reports" element={<ChartComponents />} />
            <Route path="/pdf" element={<PdfComponents />} />
            <Route path="in-progress" element={<FollowupReports />} />
            <Route path="/assigned" element={<Assigned />} />
          </Route>
          <Route path="/report-dashboard" element={<ReportDashboard />} />
          <Route path="/template-builder" element={<TemplateBuilder />} />
          <Route path="/profile" element={<Profile />} /> {/* Add this route */}
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
