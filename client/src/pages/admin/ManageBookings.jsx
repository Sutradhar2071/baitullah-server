import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, Users, Trash2, MessageSquare } from "lucide-react";
import api from "../../utils/api";
import Loader from "../../components/Loader";

const statusOptions = ["new", "contacted", "confirmed", "cancelled"];

const statusStyles = {
  new: "bg-accent/20 text-accent-dark",
  contacted: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/bookings/${id}`, { status });
      setBookings(bookings.map((b) => (b._id === id ? data : b)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter((b) => b._id !== id));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete inquiry");
    }
  };

  const filtered = statusFilter ? bookings.filter((b) => b.status === statusFilter) : bookings;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Booking Inquiries</h1>
          <p className="text-ink/60">Manage customer inquiries and update their status.</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors"
        >
          <option value="">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading inquiries..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-sage p-10 text-center text-ink/50">
          No inquiries found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl border border-sage p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-lg font-semibold text-ink">{booking.name}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyles[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink/70 mb-2 font-medium">
                    {booking.packageTitle || "General Inquiry"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-ink/60 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} /> <a href={`mailto:${booking.email}`} className="hover:text-primary">{booking.email}</a>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} /> <a href={`tel:${booking.phone}`} className="hover:text-primary">{booking.phone}</a>
                    </span>
                    {booking.numberOfTravelers && (
                      <span className="flex items-center gap-1.5">
                        <Users size={14} /> {booking.numberOfTravelers} traveler(s)
                      </span>
                    )}
                    {booking.preferredDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {booking.preferredDate}
                      </span>
                    )}
                  </div>
                  {booking.message && (
                    <p className="flex items-start gap-1.5 text-sm text-ink/60 bg-sand rounded-xl p-3 mt-2">
                      <MessageSquare size={14} className="mt-0.5 shrink-0" /> {booking.message}
                    </p>
                  )}
                  <p className="text-xs text-ink/40 mt-2">
                    Submitted: {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className="px-3 py-2 rounded-lg border border-sage text-sm focus:border-primary outline-none capitalize"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setDeleteId(booking._id)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-display text-lg font-semibold text-ink mb-2">Delete Inquiry?</h3>
            <p className="text-sm text-ink/60 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-sage font-semibold text-ink hover:bg-sand transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
