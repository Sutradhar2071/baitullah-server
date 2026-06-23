const Booking = require("../models/Booking");
const Package = require("../models/Package");

// @desc    Create a new booking inquiry
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, packageId, packageTitle, numberOfTravelers, preferredDate, message } = req.body;

    if (!name || !email || !phone) {
      res.status(400);
      throw new Error("Name, email and phone are required");
    }

    let resolvedPackageTitle = packageTitle || "";
    let resolvedPackageId = null;

    if (packageId) {
      const pkg = await Package.findById(packageId);
      if (pkg) {
        resolvedPackageId = pkg._id;
        resolvedPackageTitle = pkg.title;
      }
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      package: resolvedPackageId,
      packageTitle: resolvedPackageTitle,
      numberOfTravelers: numberOfTravelers || 1,
      preferredDate: preferredDate || "",
      message: message || "",
    });

    res.status(201).json({
      message: "Your inquiry has been submitted successfully. We will contact you soon.",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("package", "title slug type")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking (admin)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("package", "title slug type");

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    const { status } = req.body;
    if (status && ["new", "contacted", "confirmed", "cancelled"].includes(status)) {
      booking.status = status;
    }

    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};
