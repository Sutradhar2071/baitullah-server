import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Hajj", path: "/packages/hajj" },
  { name: "Umrah", path: "/packages/umrah" },
  { name: "Holiday", path: "/packages/tour" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-sand/95 backdrop-blur-sm border-b border-sage">
      {/* Top info bar */}
      <div className="hidden md:flex justify-end items-center gap-2 bg-primary text-sand text-xs px-6 py-1.5">
        <Phone size={14} />
        <a href="tel:+8801617222250" className="hover:text-accent transition-colors">
          +880 1617 222250
        </a>
        <span className="mx-2 text-sand/40">|</span>
        <a href="mailto:ask@baitullahsafar.com" className="hover:text-accent transition-colors">
          ask@baitullahsafar.com
        </a>
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-primary">
            Baitullah <span className="text-accent">Safar</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-accent" : "text-ink hover:text-primary"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="bg-primary text-sand text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-primary"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-sand border-t border-sage px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-accent" : "text-ink"}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="bg-primary text-sand text-sm font-semibold px-5 py-2.5 rounded-full text-center"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
