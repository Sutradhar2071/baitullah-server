import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManagePackages from "./pages/admin/ManagePackages";
import PackageForm from "./pages/admin/PackageForm";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageOffers from "./pages/admin/ManageOffers";
import ProtectedRoute from "./components/ProtectedRoute";

const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/packages/:type" element={<PublicLayout><Packages /></PublicLayout>} />
      <Route path="/package/:slug" element={<PublicLayout><PackageDetails /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="packages" element={<ManagePackages />} />
        <Route path="packages/new" element={<PackageForm />} />
        <Route path="packages/edit/:id" element={<PackageForm />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="offers" element={<ManageOffers />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}

export default App;
