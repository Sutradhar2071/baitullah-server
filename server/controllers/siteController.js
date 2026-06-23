const { Banner, Offer } = require("../models/Site");
const fs = require("fs");
const path = require("path");

const deleteFile = (imgPath) => {
  if (!imgPath) return;
  const filePath = path.join(__dirname, "..", imgPath);
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Failed to delete file: ${filePath}`, err.message);
  });
};

// ---------------- BANNERS ----------------

// @desc    Get all banners
// @route   GET /api/site/banners
// @access  Public
const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner
// @route   POST /api/site/banners
// @access  Private
const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, order } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error("Banner image is required");
    }

    const banner = await Banner.create({
      image: `/uploads/${req.file.filename}`,
      title: title || "",
      subtitle: subtitle || "",
      order: order || 0,
    });

    res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/site/banners/:id
// @access  Private
const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error("Banner not found");
    }

    const { title, subtitle, order } = req.body;

    banner.title = title !== undefined ? title : banner.title;
    banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
    banner.order = order !== undefined ? order : banner.order;

    if (req.file) {
      deleteFile(banner.image);
      banner.image = `/uploads/${req.file.filename}`;
    }

    const updated = await banner.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/site/banners/:id
// @access  Private
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error("Banner not found");
    }

    deleteFile(banner.image);
    await banner.deleteOne();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------------- OFFERS ----------------

// @desc    Get all offers
// @route   GET /api/site/offers
// @access  Public
const getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find().sort({ order: 1, createdAt: -1 });
    res.json(offers);
  } catch (error) {
    next(error);
  }
};

// @desc    Create offer
// @route   POST /api/site/offers
// @access  Private
const createOffer = async (req, res, next) => {
  try {
    const { title, description, link, order } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error("Offer image is required");
    }

    if (!title) {
      res.status(400);
      throw new Error("Title is required");
    }

    const offer = await Offer.create({
      image: `/uploads/${req.file.filename}`,
      title,
      description: description || "",
      link: link || "",
      order: order || 0,
    });

    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};

// @desc    Update offer
// @route   PUT /api/site/offers/:id
// @access  Private
const updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      res.status(404);
      throw new Error("Offer not found");
    }

    const { title, description, link, order } = req.body;

    offer.title = title !== undefined ? title : offer.title;
    offer.description = description !== undefined ? description : offer.description;
    offer.link = link !== undefined ? link : offer.link;
    offer.order = order !== undefined ? order : offer.order;

    if (req.file) {
      deleteFile(offer.image);
      offer.image = `/uploads/${req.file.filename}`;
    }

    const updated = await offer.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer
// @route   DELETE /api/site/offers/:id
// @access  Private
const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      res.status(404);
      throw new Error("Offer not found");
    }

    deleteFile(offer.image);
    await offer.deleteOne();
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
