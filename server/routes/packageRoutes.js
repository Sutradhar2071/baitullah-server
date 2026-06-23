const express = require("express");
const router = express.Router();
const {
  getPackages,
  getPackageBySlug,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", getPackages);
router.get("/slug/:slug", getPackageBySlug);

// Admin routes
router.get("/id/:id", protect, getPackageById);
router.post("/", protect, upload.array("images", 10), createPackage);
router.put("/:id", protect, upload.array("images", 10), updatePackage);
router.delete("/:id", protect, deletePackage);

module.exports = router;
