import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import { Suspense, lazy } from "react";
import ErrorHandler from "../pages/OtherPage/ErrorHandler";
import ProtectedRoute from "../components/protectedRoute";
import Loading from "./Loading";
import Complaints from "../POS/elmasa/complaints/complaints";
import ComplaintDetails from "../POS/elmasa/complaints/complaintDetails/ComplaintDetails";
import Inquiries from "../POS/elmasa/Inquiries/inquiries";
import InquiriesDetails from "../POS/elmasa/Inquiries/inquiriesDetails/InquiriesDetails";
import Products from "../POS/elmasa/products/Products";
import Roles from "../POS/elmasa/Roles/Roles";
import AdminsPage from "../POS/elmasa/Admins/Admins";

const TuitionDiscount = lazy(() => import("../POS/elmasa/TuitionDiscounts/TuitionDiscounts"));

const Schools = lazy(() => import("../POS/elmasa/Schools/Schools"));

const EdicationalInfo = lazy(() => import("../POS/elmasa/EducationalInfo/EdicationalInfo"));

const EduSys = lazy(() => import("../POS/elmasa/SysEdu/EduSys"));
const AcademicStages = lazy(() => import("../POS/elmasa/academicStages/AcademicStages"));
const AcademicYears = lazy(() => import("../POS/elmasa/academicYears/AcademicStages"));
const AcademicClasses = lazy(() => import("../POS/elmasa/academicClasses/AcademicClasses"));
const AcademicStudents = lazy(() => import("../POS/elmasa/academicStudents/AcademicStudents"));
const AcademicBooking = lazy(() => import("../POS/elmasa/academicBookings/AcademicBooking"));
const News = lazy(() => import("../POS/elmasa/News/News"));
const Teatchers = lazy(() => import("../POS/elmasa/Teachers/Teatchers"));

const AppLayout = lazy(() => import("../layout/AppLayout"));
// Lazy-loaded pages
const Home = lazy(() => import("../pages/Dashboard/Home"));
const UserProfiles = lazy(() => import("../pages/UserProfiles"));
const Blank = lazy(() => import("../pages/Blank"));
// const BasicTables = lazy(() => import("../pages/Tables/BasicTables"));
const Alerts = lazy(() => import("../pages/UiElements/Alerts"));
const Avatars = lazy(() => import("../pages/UiElements/Avatars"));
const Badges = lazy(() => import("../pages/UiElements/Badges"));
const Buttons = lazy(() => import("../pages/UiElements/Buttons"));
const Images = lazy(() => import("../pages/UiElements/Images"));
const Videos = lazy(() => import("../pages/UiElements/Videos"));
const LineChart = lazy(() => import("../pages/Charts/LineChart"));
const BarChart = lazy(() => import("../pages/Charts/BarChart"));
const NotFound = lazy(() => import("../pages/OtherPage/NotFound"));
const Calendar = lazy(() => import("../pages/Calendar"));



const SignIn = lazy(() => import("../pages/AuthPages/SignIn"));



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AppLayout />} errorElement={<ErrorHandler />}>
        {/* <Route
          index
          element={
            <ProtectedRoute  redirect="signin">
              <Home />
            </ProtectedRoute>
          }
        /> */}
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="signin">
                <Home />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<Loading />}>
              <UserProfiles />
            </Suspense>
          }
        />
        <Route
          path="roles"
          element={
            <Suspense fallback={<Loading />}>
              <Roles />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<Loading />}>
              <AdminsPage />
            </Suspense>
          }
        />
        {/* AdminsPage */}
        
        <Route
          path="calendar"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <Calendar />
              </ProtectedRoute>
            </Suspense>
          }
        />

        {/* Start Almasa */}
        <Route
          path="academic-years"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <AcademicYears />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="schools"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <Schools />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="tuition-discount"
          element={
            <Suspense fallback={<Loading />}>

              <ProtectedRoute redirect="/signin">

              <TuitionDiscount /> 
              </ProtectedRoute > 
            </Suspense>
          }
        />
        <Route
          path="educational-informations"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <EdicationalInfo />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="academic-classes"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <AcademicClasses />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="academic-students"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <AcademicStudents />
              </ProtectedRoute>
            </Suspense>
          }
        />
         <Route
          path="complaints"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <Complaints />
              </ProtectedRoute>
            </Suspense>
          }
        />

         <Route
          path="complaints/:id"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <ComplaintDetails />
              </ProtectedRoute>
            </Suspense>
          }
        />

        <Route
          path="inquiries"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <Inquiries />
              </ProtectedRoute>
            </Suspense>
          }
        />

         <Route
          path="inquiries/:id"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <InquiriesDetails />
              </ProtectedRoute>
            </Suspense>
          }
        />
        


        <Route
          path="academic-bookings"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <AcademicBooking />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="academic-teatcher"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <Teatchers />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="academic-booking"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="/signin">
                <AcademicBooking />
              </ProtectedRoute>
            </Suspense>
          }
        />
        {/* End Almasa */}
        <Route
          path="blank"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <Blank />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="alerts"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <Alerts />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="avatars"
          element={
            <Suspense fallback={<Loading />}>
              {" "}
              <ProtectedRoute redirect="signin">
                <Avatars />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="badge"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <Badges />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="buttons"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <Buttons />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="images"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <Images />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="videos"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <Videos />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="line-chart"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <LineChart />
              </ProtectedRoute>
            </Suspense>
          }
        />


        <Route
          path="bar-chart"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <BarChart />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="educational-systems"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <EduSys />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="news"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <News />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="academic-stages"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <AcademicStages />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <Products />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="teatchers"
          element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute redirect="/signin">
                <Teatchers />
              </ProtectedRoute>
            </Suspense>
          }
        />
      </Route>

      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    basename: "/admin", // 👈 This is the important part
  }
);

export default router;
