import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-arch-pattern" />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-ink">
            Baitullah <span className="text-accent">Safar</span>
          </h1>
          <p className="text-ink/60 text-sm mt-2">Admin Panel Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
              placeholder="admin@baitullahsafar.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-sand font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <LogIn size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
