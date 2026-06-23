const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Login admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    res.json(admin);
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile (name / password)
// @route   PUT /api/auth/profile
// @access  Private
const updateAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      res.status(404);
      throw new Error("Admin not found");
    }

    admin.name = req.body.name || admin.name;
    if (req.body.password) {
      admin.password = req.body.password; // will be hashed by pre-save hook
    }

    const updated = await admin.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginAdmin, getAdminProfile, updateAdminProfile };
