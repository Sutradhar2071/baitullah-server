import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import { resolveImage } from "../../utils/helpers";

const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("offers");

  // Offer form state
  const [offerForm, setOfferForm] = useState({ title: "", description: "", link: "" });
  const [offerImage, setOfferImage] = useState(null);
  const [offerPreview, setOfferPreview] = useState(null);
  const [savingOffer, setSavingOffer] = useState(false);

  // Banner form state
  const [bannerForm, setBannerForm] = useState({ title: "", subtitle: "" });
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [savingBanner, setSavingBanner] = useState(false);

  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offerRes, bannerRes] = await Promise.all([
        api.get("/site/offers"),
        api.get("/site/banners"),
      ]);
      setOffers(offerRes.data);
      setBanners(bannerRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------- Offers ----------
  const handleOfferImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOfferImage(file);
      setOfferPreview(URL.createObjectURL(file));
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!offerImage) {
      setError("Please select an image for the offer");
      return;
    }
    setSavingOffer(true);
    try {
      const formData = new FormData();
      formData.append("title", offerForm.title);
      formData.append("description", offerForm.description);
      formData.append("link", offerForm.link);
      formData.append("image", offerImage);

      const { data } = await api.post("/site/offers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOffers([data, ...offers]);
      setOfferForm({ title: "", description: "", link: "" });
      setOfferImage(null);
      setOfferPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create offer");
    } finally {
      setSavingOffer(false);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      await api.delete(`/site/offers/${id}`);
      setOffers(offers.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete offer");
    }
  };

  // ---------- Banners ----------
  const handleBannerImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!bannerImage) {
      setError("Please select an image for the banner");
      return;
    }
    setSavingBanner(true);
    try {
      const formData = new FormData();
      formData.append("title", bannerForm.title);
      formData.append("subtitle", bannerForm.subtitle);
      formData.append("image", bannerImage);

      const { data } = await api.post("/site/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBanners([data, ...banners]);
      setBannerForm({ title: "", subtitle: "" });
      setBannerImage(null);
      setBannerPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create banner");
    } finally {
      setSavingBanner(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await api.delete(`/site/banners/${id}`);
      setBanners(banners.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete banner");
    }
  };

  if (loading) return <Loader label="Loading offers & banners..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">Offers & Banners</h1>
      <p className="text-ink/60 mb-6">Manage homepage promotional offers and hero banners.</p>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("offers")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            activeTab === "offers" ? "bg-primary text-sand" : "bg-white text-ink border border-sage"
          }`}
        >
          Recent Offers
        </button>
        {/* <button
          onClick={() => setActiveTab("banners")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            activeTab === "banners" ? "bg-primary text-sand" : "bg-white text-ink border border-sage"
          }`}
        >
          Hero Banners
        </button> */}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl mb-4">{error}</p>}

      {/* Offers tab */}
      {activeTab === "offers" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl border border-sage p-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Add New Offer</h2>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none"
                  placeholder="e.g. Best Flight Deals 20% Discount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Link (optional)</label>
                <input
                  type="text"
                  value={offerForm.link}
                  onChange={(e) => setOfferForm({ ...offerForm, link: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none"
                  placeholder="/packages/umrah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Image *</label>
                {offerPreview ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-sage">
                    <img src={offerPreview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setOfferImage(null); setOfferPreview(null); }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-32 rounded-xl border-2 border-dashed border-sage flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-accent transition-colors text-ink/50">
                    <Upload size={20} />
                    <span className="text-xs">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleOfferImageSelect} />
                  </label>
                )}
              </div>
              <button
                type="submit"
                disabled={savingOffer}
                className="w-full bg-primary text-sand font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Plus size={18} /> {savingOffer ? "Adding..." : "Add Offer"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {offers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sage p-10 text-center text-ink/50">
                No offers added yet.
              </div>
            ) : (
              offers.map((offer) => (
                <div key={offer._id} className="bg-white rounded-2xl border border-sage p-4 flex gap-4 items-center">
                  <img src={resolveImage(offer.image)} alt={offer.title} className="w-20 h-20 rounded-xl object-cover bg-sage" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink">{offer.title}</h3>
                    <p className="text-sm text-ink/60 line-clamp-2">{offer.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteOffer(offer._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Banners tab */}
      {activeTab === "banners" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl border border-sage p-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Add New Banner</h2>
            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Title</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none"
                  placeholder="e.g. Discover the World, Create Memories."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Image *</label>
                {bannerPreview ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-sage">
                    <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setBannerImage(null); setBannerPreview(null); }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-32 rounded-xl border-2 border-dashed border-sage flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-accent transition-colors text-ink/50">
                    <Upload size={20} />
                    <span className="text-xs">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageSelect} />
                  </label>
                )}
              </div>
              <button
                type="submit"
                disabled={savingBanner}
                className="w-full bg-primary text-sand font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Plus size={18} /> {savingBanner ? "Adding..." : "Add Banner"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {banners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sage p-10 text-center text-ink/50">
                No banners added yet.
              </div>
            ) : (
              banners.map((banner) => (
                <div key={banner._id} className="bg-white rounded-2xl border border-sage p-4 flex gap-4 items-center">
                  <img src={resolveImage(banner.image)} alt={banner.title} className="w-28 h-16 rounded-xl object-cover bg-sage" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink">{banner.title || "Untitled Banner"}</h3>
                    <p className="text-sm text-ink/60">{banner.subtitle}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBanner(banner._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOffers;
