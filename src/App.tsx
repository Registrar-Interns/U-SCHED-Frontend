import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Users from "./pages/UsersPage/Users";
import AuditLog from "./pages/AuditLog/AuditLog";
import RequireAuth from "./components/auth/RequireAuth";
import ResetPasswordRequest from "./pages/AuthPages/ResetPasswordRequest";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import CollegePage from "./pages/CollegePage/CollegePage";

// import SubAdminDashboard from "./subAdminPages/SubAdminDashboard";
// import SchedulePage from "./subAdminPages/SchedulePage";
// import RoomPlottingPage from "./subAdminPages/RoomPlottingPage";
// import SubAdminCurriculumPage from "./subAdminPages/SubAdminCurriculumPage";
// import SectionsPage from "./subAdminPages/SectionsPage";

// Curriculum Pages
import CurriculumPage from "./pages/CurriculumPage/CurriculumPage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Redirect from "/" to "/signin" */}
          <Route index path="/" element={<Navigate replace to="/signin" />} />

          {/* Auth Route */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPasswordRequest />} />
          <Route path="/reset-password/set" element={<ResetPassword />} />

          {/* Dashboard Layout */}
          <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/audit-log" element={<AuditLog />} />
            <Route path="/colleges" element={<CollegePage />} />

            {/* Single route for all dept/program combos */}
            <Route path="/curriculum/department/:dept/:program" element={<CurriculumPage />} />

            {/* Sub-admin routes */}
            {/* <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/room-plotting" element={<RoomPlottingPage />} />
            <Route path="/curriculum" element={<SubAdminCurriculumPage />} />
            <Route path="/sections" element={<SectionsPage />} /> */}

            {/* Other Pages */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

