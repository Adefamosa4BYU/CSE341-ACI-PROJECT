const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res, next) => {
  // #swagger.tags = ['User']
  try {
    const { firstName, lastName, email, password, phone, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      phone,
      location,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "Registration successfully",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });

  } catch (err) {
    next(err);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  // #swagger.tags = ['User']
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid username" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });

  } catch (err) {
    next(err);
  }
};

// GitHub OAuth callback
exports.githubCallback = (req, res) => {
  // #swagger.ignore = true
  //#swagger.tags=['User']
  const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ success: true, token });
};

// Logout (works for both JWT + OAuth)
exports.logout = (req, res, next) => {
  //#swagger.tags=['User']
  try {
    if (req.logout) {
      req.logout(err => { if (err) return next(err); });
    }
    // if (req.session) req.session.destroy(() => {});
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};


// GET all users
exports.getAllUsers = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.path = '/api/user/'
  try {
    const user = await User.find();
    res.json({ 
      success: true, 
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location
      } 
    });
  } catch (err) {
    next(err);
  }
};

// GET single user
exports.getUserById = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.path = '/api/user/{id}'
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE user
exports.updateUser = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.path = '/api/user/{id}'
  const { firstName, lastName, email, phone, location } = req.body;

  const userId = req.params.id
  try {
    const updatedUser = await User.findByIdAndUpdate(
      // req.params.id,
      userId,
      {
        firstName,
        lastName,
        email,
        phone,
        location,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

// DELETE user
exports.deleteUser = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.path = '/api/user/{id}'
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};