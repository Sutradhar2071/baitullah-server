import { Link } from "react-router-dom";
import { Facebook, Linkedin, Youtube, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-sand mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand & contact */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">
            Baitullah <span className="text-accent">Safar</span>
          </h3>
          <p className="text-sand/70 text-sm mb-4 leading-relaxed">
            Your trusted partner for Hajj, Umrah, Visa and Holiday packages —
            guiding every journey with care.
          </p>
          <div className="flex items-start gap-2 text-sm text-sand/80 mb-2">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            <span>Block-A,House-44,Road-19,Mirpur-11,Dhaka-1216</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-sand/80 mb-2">
            <Mail size={16} />
            <a
              href="mailto:baitullahsafarinshaallah@gmail.com"
              className="hover:text-accent"
            >
              baitullahsafarinshaallah@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-sand/80">
            <Phone size={16} />
            <a href="tel:+8801407916252" className="hover:text-accent">
              +880 1407916252
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-sand/80">
            <li>
              <Link to="/about" className="hover:text-accent">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/packages/hajj" className="hover:text-accent">
                Hajj Packages
              </Link>
            </li>
            <li>
              <Link to="/packages/umrah" className="hover:text-accent">
                Umrah Packages
              </Link>
            </li>
            <li>
              <Link to="/packages/tour" className="hover:text-accent">
                Holiday Packages
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">
            Our Services
          </h4>
          <ul className="space-y-2 text-sm text-sand/80">
            <li>
              <Link to="/packages/umrah" className="hover:text-accent">
                Umrah
              </Link>
            </li>
            <li>
              <Link to="/packages/hajj" className="hover:text-accent">
                Hajj
              </Link>
            </li>
            <li>
              <Link to="/packages/tour" className="hover:text-accent">
                Holiday
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Visa Support
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Flight Booking
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">
            Stay Connected
          </h4>
          <p className="text-sand/70 text-sm mb-4">
            Follow us for travel tips, offers and the latest Hajj &amp; Umrah
            updates.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/share/1Myr7A86bb/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-sand/10 flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/baitullah-safar/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-sand/10 flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://youtube.com/@baitullahsafar?si=2MjzaGM8L97NYeCc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-sand/10 flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-sand/10 py-5 text-center text-sand/60 text-sm">
        © {new Date().getFullYear()} Baitullah Safar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
