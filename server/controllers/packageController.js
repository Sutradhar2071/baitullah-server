const Package = require("../models/Package");
const fs = require("fs");
const path = require("path");

// Helper: generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// @desc    Get all packages (public) - supports ?type=hajj|umrah|tour & ?featured=true & ?offer=true
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res, next) => {
  try {
    const { type, featured, offer, status, limit, search } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (featured === "true") filter.isFeatured = true;
    if (offer === "true") filter.isOffer = true;

    // Public requests only see active packages by default
    if (!req.admin) {
      filter.status = "active";
    } else if (status) {
      filter.status = status;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    let query = Package.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const packages = await query;
    res.json(packages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package by slug
// @route   GET /api/packages/:slug
// @access  Public
const getPackageBySlug = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug });

    if (!pkg) {
      res.status(404);
      throw new Error("Package not found");
    }

    res.json(pkg);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package by ID (admin)
// @route   GET /api/packages/id/:id
// @access  Private
const getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      res.status(404);
      throw new Error("Package not found");
    }

    res.json(pkg);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new package
// @route   POST /api/packages
// @access  Private
const createPackage = async (req, res, next) => {
  try {
    const {
      title,
      type,
      shortDescription,
      description,
      price,
      discountPrice,
      duration,
      groupSize,
      itinerary,
      includes,
      excludes,
      isFeatured,
      isOffer,
      status,
    } = req.body;

    if (!title || !type || !shortDescription || !price || !duration) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    let slug = generateSlug(title);

    // Ensure slug uniqueness
    const existing = await Package.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const pkg = await Package.create({
      title,
      slug,
      type,
      shortDescription,
      description,
      price,
      discountPrice: discountPrice || null,
      duration,
      groupSize,
      images,
      itinerary: itinerary ? JSON.parse(itinerary) : [],
      includes: includes ? JSON.parse(includes) : [],
      excludes: excludes ? JSON.parse(excludes) : [],
      isFeatured: isFeatured === "true" || isFeatured === true,
      isOffer: isOffer === "true" || isOffer === true,
      status: status || "active",
    });

    res.status(201).json(pkg);
  } catch (error) {
    next(error);
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private
const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      res.status(404);
      throw new Error("Package not found");
    }

    const {
      title,
      type,
      shortDescription,
      description,
      price,
      discountPrice,
      duration,
      groupSize,
      itinerary,
      includes,
      excludes,
      isFeatured,
      isOffer,
      status,
      existingImages,
    } = req.body;

    if (title && title !== pkg.title) {
      let newSlug = generateSlug(title);
      const existing = await Package.findOne({ slug: newSlug, _id: { $ne: pkg._id } });
      if (existing) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      pkg.slug = newSlug;
      pkg.title = title;
    }

    pkg.type = type || pkg.type;
    pkg.shortDescription = shortDescription || pkg.shortDescription;
    pkg.description = description !== undefined ? description : pkg.description;
    pkg.price = price !== undefined ? price : pkg.price;
    pkg.discountPrice = discountPrice !== undefined ? (discountPrice || null) : pkg.discountPrice;
    pkg.duration = duration || pkg.duration;
    pkg.groupSize = groupSize !== undefined ? groupSize : pkg.groupSize;
    pkg.itinerary = itinerary ? JSON.parse(itinerary) : pkg.itinerary;
    pkg.includes = includes ? JSON.parse(includes) : pkg.includes;
    pkg.excludes = excludes ? JSON.parse(excludes) : pkg.excludes;
    pkg.isFeatured = isFeatured !== undefined ? (isFeatured === "true" || isFeatured === true) : pkg.isFeatured;
    pkg.isOffer = isOffer !== undefined ? (isOffer === "true" || isOffer === true) : pkg.isOffer;
    pkg.status = status || pkg.status;

    // Handle images: keep existing (filtered) + add new uploads
    let keptImages = pkg.images;
    if (existingImages !== undefined) {
      try {
        keptImages = JSON.parse(existingImages);
      } catch (e) {
        keptImages = pkg.images;
      }
    }

    const newImages = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    // Delete removed images from disk
    const removedImages = pkg.images.filter((img) => !keptImages.includes(img));
    removedImages.forEach((imgPath) => {
      const filePath = path.join(__dirname, "..", imgPath);
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete image: ${filePath}`, err.message);
      });
    });

    pkg.images = [...keptImages, ...newImages];

    const updated = await pkg.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private
const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      res.status(404);
      throw new Error("Package not found");
    }

    // Delete associated images from disk
    pkg.images.forEach((imgPath) => {
      const filePath = path.join(__dirname, "..", imgPath);
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete image: ${filePath}`, err.message);
      });
    });

    await pkg.deleteOne();
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackages,
  getPackageBySlug,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
