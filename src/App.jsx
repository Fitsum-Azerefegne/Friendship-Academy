import { Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { AdminLangProvider } from "./context/AdminLangContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Gallery from "./pages/Gallery";
import Staff from "./pages/Staff";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ContentEditor from "./pages/admin/ContentEditor";
import NewsManager from "./pages/admin/NewsManager";
import StaffManager from "./pages/admin/StaffManager";
import GalleryManager from "./pages/admin/GalleryManager";
import Messages from "./pages/admin/Messages";

function AdminLangLayout() {
  return (
    <AdminLangProvider>
      <Outlet />
    </AdminLangProvider>
  );
}

function App() {
  return (
    <>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin area (shares one language toggle across login + dashboard) */}
        <Route element={<AdminLangLayout />}>
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/content" element={<ContentEditor />} />
              <Route path="/admin/news" element={<NewsManager />} />
              <Route path="/admin/staff" element={<StaffManager />} />
              <Route path="/admin/gallery" element={<GalleryManager />} />
              <Route path="/admin/messages" element={<Messages />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
