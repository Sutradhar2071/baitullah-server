const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null,
    },
    packageTitle: {
      type: String, // store title even if package later deleted
      default: "",
    },
    numberOfTravelers: {
      type: Number,
      default: 1,
    },
    preferredDate: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
