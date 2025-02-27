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

// Curriculum Pages
import BSIT from "./pages/CurriculumPage/Department/CCS/BSIT";
import BSCS from "./pages/CurriculumPage/Department/CCS/BSCS";

import BSIE from "./pages/CurriculumPage/Department/COE/BSIE";
import BSCPE from "./pages/CurriculumPage/Department/COE/BSCPE";
import BSECE from "./pages/CurriculumPage/Department/COE/BSECE";

import BSA from "./pages/CurriculumPage/Department/CBAA/BSA";
import BSBAFF from "./pages/CurriculumPage/Department/CBAA/BSBAMM";
import BSBAFM from "./pages/CurriculumPage/Department/CBAA/BSBAFM";

import BEED from "./pages/CurriculumPage/Department/COED/BEED";
import BSEDE from "./pages/CurriculumPage/Department/COED/BSEDE";
import BSEDF from "./pages/CurriculumPage/Department/COED/BSEDF";
import BSEDM from "./pages/CurriculumPage/Department/COED/BSEDM";
import BSEDS from "./pages/CurriculumPage/Department/COED/BSEDS";

import BSPSY from "./pages/CurriculumPage/Department/CAS/BSPSY";

import BSN from "./pages/CurriculumPage/Department/CHAS/BSN";

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

          {/* Dashboard Layout */}
          <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route path="/dashboard" element={<Home />} />

            <Route path="/users" element={<Users />} />
            <Route path="/audit-log" element={<AuditLog />} />

            {/* Curriculum Routes */}
            <Route path="/department/ccs/bsit" element={<BSIT />} />
            <Route path="/department/ccs/bscs" element={<BSCS />} />

            <Route path="/department/coe/bsie" element={<BSIE />} />
            <Route path="/department/coe/bscpe" element={<BSCPE />} />
            <Route path="/department/coe/bsece" element={<BSECE />} />

            <Route path="/department/cbaa/bsa" element={<BSA />} />
            <Route path="/department/cbaa/bsba-ff" element={<BSBAFF />} />
            <Route path="/department/cbaa/bsba-fm" element={<BSBAFM />} />

            <Route path="/department/coed/beed" element={<BEED />} />
            <Route path="/department/coed/bsede" element={<BSEDE />} />
            <Route path="/department/coed/bsedf" element={<BSEDF />} />
            <Route path="/department/coed/bsedm" element={<BSEDM />} />
            <Route path="/department/coed/bseds" element={<BSEDS />} />

            <Route path="/department/cas/bspsy" element={<BSPSY />} />

            <Route path="/department/chas/bsn" element={<BSN />} />

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

