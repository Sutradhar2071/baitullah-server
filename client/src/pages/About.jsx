import { ShieldCheck, Heart, Globe2, Users2 } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    desc: "Every package and price is communicated clearly — no hidden costs, no surprises.",
  },
  {
    icon: Heart,
    title: "Care for Pilgrims",
    desc: "We treat every traveler like family, especially during the sacred journeys of Hajj and Umrah.",
  },
  {
    icon: Globe2,
    title: "Global Network",
    desc: "Strong partnerships with airlines and hotels across Saudi Arabia and beyond.",
  },
  {
    icon: Users2,
    title: "Experienced Team",
    desc: "Years of experience guiding pilgrims and travelers through smooth, hassle-free trips.",
  },
];

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-arch-pattern" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            About Us
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-sand mt-3 mb-4">
            Guiding Every Journey with Care
          </h1>
          <p className="text-sand/80 max-w-2xl mx-auto">
            Baitullah Safar is a Bangladesh-based travel agency dedicated to making Hajj, Umrah
            and holiday journeys smooth, affordable and spiritually fulfilling.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-sand arch-shape" />
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-4">Our Story</h2>
            <p className="text-ink/70 leading-relaxed mb-4">
              For years, Baitullah Safar has been helping pilgrims and travelers from
              Bangladesh reach their destinations — whether it is the holy cities of Makkah and
              Madinah, or popular holiday spots around the world.
            </p>
            <p className="text-ink/70 leading-relaxed">
              We believe travel, especially for Hajj and Umrah, should be a worry-free
              experience. That's why we handle visa processing, flights, accommodation and local
              transport — so our travelers can focus on what matters most.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-72 bg-sage flex items-center justify-center">
            <span className="font-display text-2xl text-primary/40">Makkah & Madinah</span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-accent text-sm font-semibold tracking-widest uppercase">
            What We Stand For
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-ink mt-2">
            Our Core Values
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl p-6 border border-sage text-center hover:border-accent/50 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-sage flex items-center justify-center mx-auto mb-4">
                <value.icon className="text-primary" size={26} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink mb-2">{value.title}</h3>
              <p className="text-sm text-ink/60">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
