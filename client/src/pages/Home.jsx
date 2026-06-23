import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Headphones, BadgePercent, Compass } from "lucide-react";
import api from "../utils/api";
import PackageCard from "../components/PackageCard";
import Loader from "../components/Loader";
import { resolveImage } from "../utils/helpers";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, offerRes] = await Promise.all([
          api.get("/packages?featured=true&limit=6"),
          api.get("/site/offers"),
        ]);
        setFeatured(pkgRes.data);
        setOffers(offerRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-arch-pattern" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-36 text-center">
          <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            Trusted Travel Partner Since Day One
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-sand leading-tight mb-6">
            Walk the Sacred Path,
            <br />
            <span className="text-accent">Find Inner Peace.</span>
          </h1>
          <p className="text-sand/80 max-w-2xl mx-auto mb-10 text-lg">
            Reliable Hajj, Umrah, Visa &amp; Holiday packages — crafted with care, guided with
            trust. Let us take care of the journey so you can focus on the worship and the
            memories.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/packages/umrah"
              className="bg-accent text-ink font-semibold px-7 py-3.5 rounded-full hover:bg-accent-dark transition-colors flex items-center gap-2"
            >
              Explore Umrah Packages <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="border border-sand/30 text-sand font-semibold px-7 py-3.5 rounded-full hover:bg-sand/10 transition-colors"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>

        {/* Arch divider - signature element */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-sand arch-shape" />
      </section>

      {/* Trust badges */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: ShieldCheck, label: "IATA & ATAB Certified" },
            { icon: Headphones, label: "24/7 Support" },
            { icon: BadgePercent, label: "Best Price Guarantee" },
            { icon: Compass, label: "Expert Travel Guidance" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-5 flex flex-col items-center text-center gap-2 shadow-sm border border-sage"
            >
              <item.icon className="text-primary" size={28} />
              <span className="text-sm font-medium text-ink">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Offers */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Grab
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-ink mt-2">
              Recent Offers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Link
                key={offer._id}
                to={offer.link || "/packages/tour"}
                className="group bg-white rounded-2xl overflow-hidden border border-sage hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden bg-sage">
                  <img
                    src={resolveImage(offer.image)}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-ink mb-1 group-hover:text-primary transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-ink/60 line-clamp-2">{offer.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured packages */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            Choose
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-ink mt-2">
            Our Packages
          </h2>
        </div>

        {loading ? (
          <Loader label="Loading packages..." />
        ) : featured.length === 0 ? (
          <p className="text-center text-ink/60">No packages available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/packages/umrah"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors"
          >
            View All Packages <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-primary rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-arch-pattern" />
          <div className="relative">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-sand mb-4">
              Ready to begin your journey?
            </h2>
            <p className="text-sand/80 max-w-xl mx-auto mb-8">
              Share your travel plans with us and our team will get back to you with the best
              options tailored for you.
            </p>
            <Link
              to="/contact"
              className="bg-accent text-ink font-semibold px-8 py-3.5 rounded-full hover:bg-accent-dark transition-colors inline-flex items-center gap-2"
            >
              Get In Touch <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
