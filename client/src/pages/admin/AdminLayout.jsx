import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Inbox, ImageIcon, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/bookings", label: "Bookings", icon: Inbox },
  { to: "/admin/offers", label: "Offers & Banners", icon: ImageIcon },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-sand">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-sand flex flex-col shrink-0">
        <div className="p-6 border-b border-sand/10">
          <h1 className="font-display text-xl font-bold">
            Baitullah <span className="text-accent">Safar</span>
          </h1>
          <p className="text-sand/50 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-accent text-ink" : "text-sand/80 hover:bg-sand/10"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sand/10 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-sand/80 hover:bg-sand/10 transition-colors"
          >
            <ExternalLink size={18} />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-sand/80 hover:bg-sand/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-sage px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">{admin?.name}</p>
              <p className="text-xs text-ink/50">{admin?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center font-display font-bold text-primary">
              {admin?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
