import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import Guard from '../components/Guard.jsx';
import Home from '../pages/public/Home.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Dashboard from '../pages/student/Dashboard.jsx';
import Browse from '../pages/student/Browse.jsx';
import ItemDetails from '../pages/student/ItemDetails.jsx';
import ReportItem from '../pages/student/ReportItem.jsx';
import MyReports from '../pages/student/MyReports.jsx';
import MyClaims from '../pages/student/MyClaims.jsx';
import Notifications from '../pages/student/Notifications.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminReports from '../pages/admin/AdminReports.jsx';
import AdminClaims from '../pages/admin/AdminClaims.jsx';
import ClaimDetail from '../pages/admin/ClaimDetail.jsx';
import Analytics from '../pages/admin/Analytics.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Shell />}>
        <Route path="/browse" element={<Browse />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route element={<Guard />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/reports" element={<MyReports />} />
          <Route path="/claims" element={<MyClaims />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route element={<Guard role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/claims" element={<AdminClaims />} />
          <Route path="/admin/claims/:id" element={<ClaimDetail />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
