import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-ink/60 mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-primary text-sand font-semibold px-7 py-3 rounded-full hover:bg-primary-dark transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
