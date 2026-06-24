import { MapPin, Mail, Phone, Clock } from "lucide-react";
import BookingForm from "../components/BookingForm";

const Contact = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-arch-pattern" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-sand mt-3 mb-4">
            Contact Us
          </h1>
          <p className="text-sand/80 max-w-2xl mx-auto">
            Have questions about Hajj, Umrah, Visa or Holiday packages? Reach
            out — we're here to help plan your journey.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-sand arch-shape" />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-sage flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center shrink-0">
                <MapPin className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Office Address</h3>
                <p className="text-sm text-ink/60">
                  Block-A,House-44,Road-19,Mirpur-11,Dhaka-1216
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-sage flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center shrink-0">
                <Phone className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Phone</h3>
                <p className="text-sm text-ink/60">
                  <a href="tel:+8801407916252" className="hover:text-primary">
                    +880 1407 916252
                  </a>
                  <br />
                  <a href="tel:+8801911041674" className="hover:text-primary">
                    +880 1911 041674
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-sage flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center shrink-0">
                <Mail className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Email</h3>
                <p className="text-sm text-ink/60">
                  <a
                    href="mailto:baitullahsafarinshaallah@gmail.com"
                    className="hover:text-primary"
                  >
                    baitullahsafarinshaallah@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-sage flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center shrink-0">
                <Clock className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Office Hours</h3>
                <p className="text-sm text-ink/60">
                  Saturday - Thursday: 10:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-sage p-8">
            <h2 className="font-display text-2xl font-bold text-ink mb-2">
              Send Us a Message
            </h2>
            <p className="text-ink/60 text-sm mb-6">
              Fill out the form below and our team will get back to you within
              24 hours.
            </p>
            <BookingForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
