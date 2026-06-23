const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const offerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    link: { type: String, default: "" }, // can link to a package slug
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = {
  Banner: mongoose.model("Banner", bannerSchema),
  Offer: mongoose.model("Offer", offerSchema),
};
