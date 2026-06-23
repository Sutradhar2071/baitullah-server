import { Link } from "react-router-dom";
import { Clock, Users, ArrowRight } from "lucide-react";
import { formatPrice, typeLabel, resolveImage } from "../utils/helpers";

const PackageCard = ({ pkg }) => {
  const image = pkg.images && pkg.images.length > 0 ? resolveImage(pkg.images[0]) : "/placeholder.jpg";

  return (
    <Link
      to={`/package/${pkg.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-sage hover:border-accent/50 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative h-52 overflow-hidden bg-sage">
        <img
          src={image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
        />
        <span className="absolute top-3 left-3 bg-primary text-sand text-xs font-semibold px-3 py-1 rounded-full">
          {typeLabel[pkg.type] || pkg.type}
        </span>
        {pkg.discountPrice && (
          <span className="absolute top-3 right-3 bg-accent text-ink text-xs font-bold px-3 py-1 rounded-full">
            Special Offer
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-ink mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {pkg.title}
        </h3>
        <p className="text-sm text-ink/60 mb-4 line-clamp-2">{pkg.shortDescription}</p>

        <div className="flex items-center gap-4 text-xs text-ink/60 mb-4">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {pkg.duration}
          </span>
          {pkg.groupSize && (
            <span className="flex items-center gap-1">
              <Users size={14} /> {pkg.groupSize}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-sage">
          <div>
            {pkg.discountPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg font-bold text-primary">
                  {formatPrice(pkg.discountPrice)}
                </span>
                <span className="text-xs text-ink/40 line-through">{formatPrice(pkg.price)}</span>
              </div>
            ) : (
              <span className="font-display text-lg font-bold text-primary">
                {formatPrice(pkg.price)}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
            Details <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
