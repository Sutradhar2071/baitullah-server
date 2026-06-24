import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Inbox, Image as ImageIcon, ArrowRight, Mail, Phone, Clock } from "lucide-react";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import { typeLabel } from "../../utils/helpers";

const Dashboard = () => {
  const [stats, setStats] = useState({ packages: 0, bookings: 0, newBookings: 0, offers: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, bookingRes, offerRes] = await Promise.all([
          api.get("/packages?status=active"),
          api.get("/bookings"),
          api.get("/site/offers"),
        ]);

        const allPkgRes = await api.get("/packages");

        setStats({
          packages: allPkgRes.data.length,
          bookings: bookingRes.data.length,
          newBookings: bookingRes.data.filter((b) => b.status === "new").length,
          offers: offerRes.data.length,
        });
        setRecentBookings(bookingRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = [
    { label: "Total Packages", value: stats.packages, icon: Package, link: "/admin/packages" },
    { label: "Total Inquiries", value: stats.bookings, icon: Inbox, link: "/admin/bookings" },
    { label: "New Inquiries", value: stats.newBookings, icon: Mail, link: "/admin/bookings" },
    { label: "Offers", value: stats.offers, icon: ImageIcon, link: "/admin/offers" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Dashboard</h1>
      <p className="text-ink/60 mb-8">Welcome back! Here's an overview of your website.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white rounded-2xl p-6 border border-sage hover:border-accent/50 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center mb-4">
              <card.icon className="text-primary" size={22} />
            </div>
            <p className="text-3xl font-bold text-ink mb-1">{card.value}</p>
            <p className="text-sm text-ink/60">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="bg-white rounded-2xl border border-sage p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-ink">Recent Inquiries</h2>
          <Link
            to="/admin/bookings"
            className="text-sm font-semibold text-accent hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-ink/50 text-sm text-center py-8">No inquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 bg-sand rounded-xl"
              >
                <div>
                  <p className="font-semibold text-ink">{booking.name}</p>
                  <p className="text-sm text-ink/60">{booking.packageTitle || "General Inquiry"}</p>
                  <div className="flex items-center gap-4 text-xs text-ink/50 mt-1">
                    <span className="flex items-center gap-1"><Phone size={12} /> {booking.phone}</span>
                    <span className="flex items-center gap-1"><Mail size={12} /> {booking.email}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                    booking.status === "new"
                      ? "bg-accent/20 text-accent-dark"
                      : booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-sage text-primary"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
