import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import { formatPrice, typeLabel, resolveImage } from "../../utils/helpers";

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/packages");
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/packages/${id}`);
      setPackages(packages.filter((p) => p._id !== id));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete package");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = packages.filter((pkg) => {
    const matchesSearch = pkg.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? pkg.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Manage Packages</h1>
          <p className="text-ink/60">Add, edit or remove Hajj, Umrah and Tour packages.</p>
        </div>
        <Link
          to="/admin/packages/new"
          className="bg-primary text-sand font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Package
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packages..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-sage bg-white focus:border-primary outline-none transition-colors"
        >
          <option value="">All Types</option>
          <option value="hajj">Hajj</option>
          <option value="umrah">Umrah</option>
          <option value="tour">Holiday</option>
        </select>
      </div>

      {loading ? (
        <Loader label="Loading packages..." />
      ) : (
        <div className="bg-white rounded-2xl border border-sage overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand text-ink/70">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Package</th>
                <th className="text-left px-5 py-3 font-semibold">Type</th>
                <th className="text-left px-5 py-3 font-semibold">Price</th>
                <th className="text-left px-5 py-3 font-semibold">Duration</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-right px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-ink/50">
                    No packages found.
                  </td>
                </tr>
              ) : (
                filtered.map((pkg) => (
                  <tr key={pkg._id} className="border-t border-sage">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-sage overflow-hidden shrink-0">
                          {pkg.images?.[0] && (
                            <img src={resolveImage(pkg.images[0])} alt={pkg.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-ink line-clamp-1">{pkg.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize">{typeLabel[pkg.type]}</td>
                    <td className="px-5 py-3">
                      {pkg.discountPrice ? (
                        <span>
                          {formatPrice(pkg.discountPrice)}{" "}
                          <span className="text-ink/40 line-through text-xs">{formatPrice(pkg.price)}</span>
                        </span>
                      ) : (
                        formatPrice(pkg.price)
                      )}
                    </td>
                    <td className="px-5 py-3">{pkg.duration}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                          pkg.status === "active" ? "bg-green-100 text-green-700" : "bg-sage text-ink/60"
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/packages/edit/${pkg._id}`}
                          className="p-2 rounded-lg hover:bg-sage transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} className="text-primary" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(pkg._id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-display text-lg font-semibold text-ink mb-2">Delete Package?</h3>
            <p className="text-sm text-ink/60 mb-6">
              This action cannot be undone. The package and its images will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-sage font-semibold text-ink hover:bg-sand transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePackages;
