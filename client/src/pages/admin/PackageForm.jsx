import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import api from "../../utils/api";
import Loader from "../../components/Loader";

const emptyItinerary = { day: "", title: "", description: "" };

const PackageForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "umrah",
    shortDescription: "",
    description: "",
    price: "",
    discountPrice: "",
    duration: "",
    groupSize: "",
    isFeatured: false,
    isOffer: false,
    status: "active",
  });
  const [itinerary, setItinerary] = useState([]);
  const [includes, setIncludes] = useState([""]);
  const [excludes, setExcludes] = useState([""]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const fetchPackage = async () => {
      try {
        const { data } = await api.get(`/packages/id/${id}`);
        setForm({
          title: data.title,
          type: data.type,
          shortDescription: data.shortDescription,
          description: data.description || "",
          price: data.price,
          discountPrice: data.discountPrice || "",
          duration: data.duration,
          groupSize: data.groupSize || "",
          isFeatured: data.isFeatured,
          isOffer: data.isOffer,
          status: data.status,
        });
        setItinerary(data.itinerary || []);
        setIncludes(data.includes?.length > 0 ? data.includes : [""]);
        setExcludes(data.excludes?.length > 0 ? data.excludes : [""]);
        setExistingImages(data.images || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load package");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Itinerary handlers
  const addItineraryItem = () => setItinerary([...itinerary, { ...emptyItinerary }]);
  const updateItineraryItem = (idx, field, value) => {
    const updated = [...itinerary];
    updated[idx][field] = value;
    setItinerary(updated);
  };
  const removeItineraryItem = (idx) => setItinerary(itinerary.filter((_, i) => i !== idx));

  // Includes/Excludes handlers
  const updateListItem = (list, setList, idx, value) => {
    const updated = [...list];
    updated[idx] = value;
    setList(updated);
  };
  const addListItem = (list, setList) => setList([...list, ""]);
  const removeListItem = (list, setList, idx) => setList(list.filter((_, i) => i !== idx));

  // Image handlers
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
    setNewImagePreviews([...newImagePreviews, ...files.map((f) => URL.createObjectURL(f))]);
  };
  const removeExistingImage = (img) => setExistingImages(existingImages.filter((i) => i !== img));
  const removeNewImage = (idx) => {
    setNewImages(newImages.filter((_, i) => i !== idx));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("itinerary", JSON.stringify(itinerary.filter((i) => i.day && i.title)));
      formData.append("includes", JSON.stringify(includes.filter((i) => i.trim())));
      formData.append("excludes", JSON.stringify(excludes.filter((i) => i.trim())));

      if (isEdit) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      newImages.forEach((file) => formData.append("images", file));

      if (isEdit) {
        await api.put(`/packages/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/packages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin/packages");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save package");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading package..." />;

  return (
    <div>
      <Link to="/admin/packages" className="inline-flex items-center gap-2 text-primary font-semibold mb-4 hover:underline">
        <ArrowLeft size={18} /> Back to Packages
      </Link>

      <h1 className="font-display text-2xl font-bold text-ink mb-6">
        {isEdit ? "Edit Package" : "Add New Package"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-sage p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink mb-1.5">Title *</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
                placeholder="e.g. 07 Days Umrah Customize Package"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
              >
                <option value="hajj">Hajj</option>
                <option value="umrah">Umrah</option>
                <option value="tour">Holiday / Tour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1.5">Short Description *</label>
            <input
              type="text"
              name="shortDescription"
              required
              value={form.shortDescription}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
              placeholder="One-line summary shown on cards"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1.5">Full Description</label>
            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors resize-none"
              placeholder="Detailed overview of the package..."
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Price (BDT) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Discount Price</label>
              <input
                type="number"
                name="discountPrice"
                min="0"
                value={form.discountPrice}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Duration *</label>
              <input
                type="text"
                name="duration"
                required
                value={form.duration}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
                placeholder="e.g. 07 Days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Group Size</label>
              <input
                type="text"
                name="groupSize"
                value={form.groupSize}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none transition-colors"
                placeholder="e.g. 16+"
              />
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              Show on Homepage (Featured)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
              <input
                type="checkbox"
                name="isOffer"
                checked={form.isOffer}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              Mark as Special Offer
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-sage p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Images</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {existingImages.map((img) => (
              <div key={img} className="relative w-28 h-28 rounded-xl overflow-hidden bg-sage">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {newImagePreviews.map((preview, idx) => (
              <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden bg-sage">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="w-28 h-28 rounded-xl border-2 border-dashed border-sage flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-accent transition-colors text-ink/50">
              <Upload size={20} />
              <span className="text-xs">Upload</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            </label>
          </div>
          <p className="text-xs text-ink/50">JPG, PNG or WEBP. Max 5MB per image.</p>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-2xl border border-sage p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-ink">Itinerary (Optional)</h2>
            <button
              type="button"
              onClick={addItineraryItem}
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              <Plus size={16} /> Add Day
            </button>
          </div>
          {itinerary.length === 0 ? (
            <p className="text-sm text-ink/50">No itinerary added yet.</p>
          ) : (
            <div className="space-y-3">
              {itinerary.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start bg-sand rounded-xl p-4">
                  <input
                    type="text"
                    placeholder="Day (e.g. Day 1)"
                    value={item.day}
                    onChange={(e) => updateItineraryItem(idx, "day", e.target.value)}
                    className="w-full sm:w-32 px-3 py-2 rounded-lg border border-sage focus:border-primary outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => updateItineraryItem(idx, "title", e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 rounded-lg border border-sage focus:border-primary outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItineraryItem(idx, "description", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-sage focus:border-primary outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeItineraryItem(idx)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Includes / Excludes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-sage p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-ink">Package Includes</h2>
              <button
                type="button"
                onClick={() => addListItem(includes, setIncludes)}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {includes.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(includes, setIncludes, idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-sage focus:border-primary outline-none text-sm"
                    placeholder="e.g. Visa Processing"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(includes, setIncludes, idx)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-sage p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-ink">Package Excludes</h2>
              <button
                type="button"
                onClick={() => addListItem(excludes, setExcludes)}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {excludes.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(excludes, setExcludes, idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-sage focus:border-primary outline-none text-sm"
                    placeholder="e.g. Personal Expenses"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(excludes, setExcludes, idx)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            to="/admin/packages"
            className="px-6 py-3 rounded-xl border border-sage font-semibold text-ink hover:bg-sand transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-primary text-sand font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Update Package" : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;
