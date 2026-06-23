import { useState } from "react";
import api from "../utils/api";
import { Send, CheckCircle2 } from "lucide-react";

const BookingForm = ({ pkg = null }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfTravelers: 1,
    preferredDate: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      await api.post("/bookings", {
        ...form,
        packageId: pkg ? pkg._id : undefined,
        packageTitle: pkg ? pkg.title : "General Inquiry",
      });
      setStatus({ loading: false, success: true, error: "" });
      setForm({
        name: "",
        email: "",
        phone: "",
        numberOfTravelers: 1,
        preferredDate: "",
        message: "",
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  if (status.success) {
    return (
      <div className="bg-sage rounded-2xl p-8 text-center flex flex-col items-center gap-3">
        <CheckCircle2 size={48} className="text-primary" />
        <h3 className="font-display text-xl font-semibold text-ink">Thank you!</h3>
        <p className="text-ink/70 text-sm">
          Your inquiry has been submitted successfully. Our team will contact you soon.
        </p>
        <button
          onClick={() => setStatus({ loading: false, success: false, error: "" })}
          className="mt-2 text-accent font-semibold text-sm hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {pkg && (
        <div className="bg-sage rounded-xl px-4 py-3 text-sm text-ink/70">
          Inquiring about: <span className="font-semibold text-ink">{pkg.title}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors"
            placeholder="+880 1XXXXXXXXX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Email Address *</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Number of Travelers</label>
          <input
            type="number"
            name="numberOfTravelers"
            min="1"
            value={form.numberOfTravelers}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Preferred Travel Date</label>
          <input
            type="date"
            name="preferredDate"
            value={form.preferredDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Message</label>
        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors resize-none"
          placeholder="Tell us about your requirements..."
        />
      </div>

      {status.error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{status.error}</p>
      )}

      <button
        type="submit"
        disabled={status.loading}
        className="w-full bg-primary text-sand font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {status.loading ? "Submitting..." : "Submit Inquiry"}
        {!status.loading && <Send size={18} />}
      </button>
    </form>
  );
};

export default BookingForm;
