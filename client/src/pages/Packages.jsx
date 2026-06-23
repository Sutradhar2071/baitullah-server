import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import PackageCard from "../components/PackageCard";
import Loader from "../components/Loader";
import { typeLabel } from "../utils/helpers";

const tabs = [
  { key: "hajj", label: "Hajj" },
  { key: "umrah", label: "Umrah" },
  { key: "tour", label: "Holiday" },
];

const Packages = () => {
  const { type } = useParams();
  const activeType = type || "umrah";

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/packages?type=${activeType}`);
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [activeType]);

  const filtered = packages.filter((pkg) =>
    pkg.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-accent text-sm font-semibold tracking-widest uppercase">
          Packages
        </span>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink mt-2">
          {typeLabel[activeType]} Packages
        </h1>
        <p className="text-ink/60 mt-3 max-w-2xl mx-auto">
          Browse our {typeLabel[activeType].toLowerCase()} packages and find the one that suits
          your needs. Click on any package to view full details and submit an inquiry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={`/packages/${tab.key}`}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeType === tab.key
                ? "bg-primary text-sand"
                : "bg-white text-ink border border-sage hover:border-primary"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${typeLabel[activeType]} packages...`}
          className="w-full px-5 py-3 rounded-full border border-sage bg-white focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Results */}
      {loading ? (
        <Loader label="Loading packages..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink/60 mb-4">No packages found.</p>
          <Link to="/contact" className="text-accent font-semibold hover:underline">
            Contact us for a custom package
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;
