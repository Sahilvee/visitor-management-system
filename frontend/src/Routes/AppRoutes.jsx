import { BrowserRouter, Routes, Route } from "react-router-dom";

// =================  PUBLIC PAGES  =================
import Home  from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Visitorpage  from "../pages/Vistorpage.jsx";
import VisitorRegister from "../pages/VisitorRegister.jsx";
import Otpverify from "../pages/Otpverify.jsx";
import BookingAppointment from "../pages/BookingAppointment.jsx";
import TrackingPage  from "../pages/TrackingPage.jsx";
import AboutPage  from "../pages/About.jsx";
import HelpPage   from "../pages/HelpPage.jsx";

//  =================  ADMIN PAGES  =================
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminLayout from "../pages/AdminLayout.jsx";
import AdminAppointments from "../pages/AdminAppointment.jsx";

import AdminVisitor from "../pages/AdminVisitor.jsx";

import AdminUser from "../pages/AdminUser.jsx";

// ================= EMPLOYEE  / FRONTDESK =================
import  EmployeeDashboard  from "../pages/EmployeeDashboard.jsx";

import FrontDesk from "../pages/FrontDesk.jsx";

 // =================  AUTH / PROTECTION =================
import PrivateRoute from "./PrivateRoute.jsx";

//  ================= ERROR  PAGE =================
import ErrorPage from  "../pages/ErrorPage.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes >

        {/*  ================= Public Routes  ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/help" element={<HelpPage />} />
 
        <Route path="/auth/login" element={<Login />} />

        <Route  path="/visitors" element= {<Visitorpage  />} />
          <Route path="/register-form" element={<VisitorRegister />} />
        <Route path="/otp" element={<Otpverify />} />
        <Route path="/book-appointment"  element= {<BookingAppointment />} />
        <Route  path="/track-appointment" element={<TrackingPage />} />

        {/*  ================= ADMIN ROUTES ================= */}


        <Route 
          path="/admin_dashboard"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >

          <Route index element={<AdminDashboard />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="visitors" element={<AdminVisitor />} />
            <Route path="users" element={<AdminUser />} />
        </Route>

        {/* ================= EMPLOYEE ROUTES ================= */}
         <Route
          path="/employee_dashboard"
            element={
              <PrivateRoute allowedRoles={["EMPLOYEE"]}>
                          <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        {/* ================= FRONT DESK ================= */}
        <Route 
           path="/frontdesk_dashboard"
          element={
            <PrivateRoute allowedRoles={["FRONTDESK"]}>
                          <FrontDesk />
            </PrivateRoute>
          }
        />

        {/*  ================= FALLBACK ================= */}
        <Route path="*" element={<ErrorPage />}  />

      </Routes>

    </BrowserRouter>
    
  );
}

export default AppRoutes;