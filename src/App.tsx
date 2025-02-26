import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AuditLog from "./pages/AuditLog/AuditLog";
import RequireAuth from "./components/auth/RequireAuth";

// Curriculum Pages
import BSIT from "./pages/CurriculumPage/Department/CCS/BSIT";
import BSCS from "./pages/CurriculumPage/Department/CCS/BSCS";
import BSIE from "./pages/CurriculumPage/Department/COE/BSIE";
import BSCPE from "./pages/CurriculumPage/Department/COE/BSCPE";

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
            <Route path="/audit-log" element={<AuditLog />} />

            {/* Curriculum Routes */}
            <Route path="/department/ccs/bsit" element={<BSIT />} />
            <Route path="/department/ccs/bscs" element={<BSCS />} />
            <Route path="/department/coe/bsie" element={<BSIE />} />
            <Route path="/department/coe/bscpe" element={<BSCPE />} />

            {/* Other Pages */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* UI Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

