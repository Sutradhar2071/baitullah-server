const mongoose = require("mongoose");

const itineraryItemSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // e.g. "Day 1"
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["hajj", "umrah", "tour"],
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    duration: {
      type: String, // e.g. "07 Days", "14 Days"
      required: true,
    },
    groupSize: {
      type: String, // e.g. "16+"
      default: "",
    },
    images: [
      {
        type: String, // file paths /uploads/xxxx.jpg
      },
    ],
    itinerary: [itineraryItemSchema],
    includes: [{ type: String }], // e.g. "Visa Processing", "Hotel Stay"
    excludes: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOffer: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

packageSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model("Package", packageSchema);
