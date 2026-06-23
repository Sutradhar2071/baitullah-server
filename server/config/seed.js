const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./db");
const Admin = require("../models/Admin");
const Package = require("../models/Package");

dotenv.config();

const seed = async () => {
  await connectDB();

  try {
    // ----- Seed Admin -----
    const adminEmail = process.env.ADMIN_EMAIL || "admin@baitullahsafar.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

    let admin = await Admin.findOne({ email: adminEmail });

    if (!admin) {
      admin = await Admin.create({
        name: "Site Admin",
        email: adminEmail,
        password: adminPassword,
        role: "superadmin",
      });
      console.log(`Admin created -> email: ${adminEmail} | password: ${adminPassword}`);
    } else {
      console.log("Admin already exists, skipping admin creation.");
    }

    // ----- Seed Sample Packages -----
    const existingCount = await Package.countDocuments();

    if (existingCount === 0) {
      await Package.insertMany([
        {
          title: "07 Days Umrah Customize Package",
          slug: "07-days-umrah-customize-package",
          type: "umrah",
          shortDescription: "Best Umrah Package with complete service solution for 7 days.",
          description: "A complete 7 days Umrah package including visa, flight, hotel and transport.",
          price: 95000,
          discountPrice: 89000,
          duration: "07 Days",
          groupSize: "16+",
          images: [],
          itinerary: [
            { day: "Day 1", title: "Departure from Dhaka", description: "Flight to Jeddah/Madinah" },
            { day: "Day 2-4", title: "Stay in Madinah", description: "Ziyarat & Ibadah" },
            { day: "Day 5-7", title: "Stay in Makkah", description: "Umrah & Ziyarat, return flight" },
          ],
          includes: ["Visa Processing", "Air Ticket", "Hotel Accommodation", "Transport"],
          excludes: ["Personal Expenses", "Zamzam Water Extra Baggage"],
          isFeatured: true,
          isOffer: false,
          status: "active",
        },
        {
          title: "14 Days Umrah Group Package",
          slug: "14-days-umrah-group-package",
          type: "umrah",
          shortDescription: "Best Umrah Package for groups with complete service solution.",
          description: "14 days group Umrah package with comfortable hotels near Haram.",
          price: 150000,
          discountPrice: null,
          duration: "14 Days",
          groupSize: "16+",
          images: [],
          itinerary: [],
          includes: ["Visa Processing", "Air Ticket", "Hotel Accommodation", "Transport", "Group Guide"],
          excludes: ["Personal Expenses"],
          isFeatured: true,
          isOffer: false,
          status: "active",
        },
        {
          title: "Best Flight Deals - Dhaka to Riyadh",
          slug: "best-flight-deals-dhaka-riyadh",
          type: "tour",
          shortDescription: "Limited time offer - Get 20% OFF on Ticket Booking!",
          description: "Special discounted return flight tickets from Dhaka to Riyadh.",
          price: 45000,
          discountPrice: 36000,
          duration: "1 Day",
          groupSize: "",
          images: [],
          itinerary: [],
          includes: ["Return Air Ticket"],
          excludes: ["Visa", "Hotel"],
          isFeatured: false,
          isOffer: true,
          status: "active",
        },
      ]);
      console.log("Sample packages seeded successfully.");
    } else {
      console.log("Packages already exist, skipping package seeding.");
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seed();
