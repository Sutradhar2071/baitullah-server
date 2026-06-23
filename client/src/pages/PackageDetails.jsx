import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Users, CheckCircle2, XCircle, MapPin } from "lucide-react";
import api from "../utils/api";
import Loader from "../components/Loader";
import BookingForm from "../components/BookingForm";
import { formatPrice, typeLabel, resolveImage } from "../utils/helpers";

const PackageDetails = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/packages/slug/${slug}`);
        setPkg(data);
        setActiveImage(0);
      } catch (err) {
        setError(err.response?.data?.message || "Package not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  if (loading) return <Loader label="Loading package details..." />;

  if (error || !pkg) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink mb-3">{error || "Not Found"}</h1>
        <Link to="/packages/umrah" className="text-accent font-semibold hover:underline">
          Browse other packages
        </Link>
      </div>
    );
  }

  const images = pkg.images && pkg.images.length > 0 ? pkg.images.map((img) => resolveImage(img)) : ["/placeholder.jpg"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-ink/50 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/packages/${pkg.type}`} className="hover:text-primary">
          {typeLabel[pkg.type]} Packages
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{pkg.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: details */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="rounded-2xl overflow-hidden bg-sage h-72 lg:h-96 mb-4">
            <img
              src={images[activeImage]}
              alt={pkg.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mb-8 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                    activeImage === idx ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`${pkg.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & meta */}
          <span className="inline-block bg-sage text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {typeLabel[pkg.type]}
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink mb-3">{pkg.title}</h1>
          <p className="text-ink/70 mb-6">{pkg.shortDescription}</p>

          <div className="flex flex-wrap gap-6 mb-8 text-sm text-ink/70">
            <span className="flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Duration: <strong>{pkg.duration}</strong>
            </span>
            {pkg.groupSize && (
              <span className="flex items-center gap-2">
                <Users size={18} className="text-primary" /> Group Size: <strong>{pkg.groupSize}</strong>
              </span>
            )}
            <span className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> Departure: <strong>Dhaka, Bangladesh</strong>
            </span>
          </div>

          {/* Description */}
          {pkg.description && (
            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold text-ink mb-3">Overview</h2>
              <p className="text-ink/70 leading-relaxed whitespace-pre-line">{pkg.description}</p>
            </div>
          )}

          {/* Itinerary */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold text-ink mb-4">Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((item, idx) => (
                  <div key={idx} className="flex gap-4 bg-white rounded-xl p-4 border border-sage">
                    <div className="shrink-0 w-20 text-center">
                      <span className="inline-block bg-primary text-sand text-xs font-semibold px-3 py-1.5 rounded-full">
                        {item.day}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-ink/60">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes / Excludes */}
          {(pkg.includes?.length > 0 || pkg.excludes?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {pkg.includes?.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-3">Package Includes</h3>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-ink/70">
                        <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.excludes?.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-3">Package Excludes</h3>
                  <ul className="space-y-2">
                    {pkg.excludes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-ink/70">
                        <XCircle size={18} className="text-accent shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: booking sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-sage p-6 sticky top-24">
            <div className="mb-4">
              {pkg.discountPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-primary">
                    {formatPrice(pkg.discountPrice)}
                  </span>
                  <span className="text-sm text-ink/40 line-through">{formatPrice(pkg.price)}</span>
                </div>
              ) : (
                <span className="font-display text-2xl font-bold text-primary">
                  {formatPrice(pkg.price)}
                </span>
              )}
              <p className="text-xs text-ink/50 mt-1">per person</p>
            </div>
            <h3 className="font-display text-lg font-semibold text-ink mb-4">
              Book This Package
            </h3>
            <BookingForm pkg={pkg} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
