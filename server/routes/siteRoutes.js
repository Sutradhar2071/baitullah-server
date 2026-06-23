const express = require("express");
const router = express.Router();
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/siteController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Banners
router.get("/banners", getBanners);
router.post("/banners", protect, upload.single("image"), createBanner);
router.put("/banners/:id", protect, upload.single("image"), updateBanner);
router.delete("/banners/:id", protect, deleteBanner);

// Offers
router.get("/offers", getOffers);
router.post("/offers", protect, upload.single("image"), createOffer);
router.put("/offers/:id", protect, upload.single("image"), updateOffer);
router.delete("/offers/:id", protect, deleteOffer);

module.exports = router;
