const { body } = require("express-validator");
const { validationResult } = require("express-validator");

const User = require("../models/User");

exports.registerRules = () => {
  return [
    // firstName
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    
    // lastName
    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),

    // Email
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail()
      .custom(async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email already exists. Please login.");
        }
      }),

    // Password
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must include uppercase, lowercase, and number"),

    // Phone (optional)
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),

    // Location (optional)
    body("location")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Location must be valid"),
  ];
};


exports.loginRules = () => {
  return [
    // Email
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Valid email is required"),

    // Password
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must include uppercase, lowercase, and number"),
  ];
};

exports.trainingRules = () => {
  return [
    // Title (required)
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),

    // Description (optional)
    body("description")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters"),

    // Date (required)
    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Date must be valid (YYYY-MM-DD)")
      .toDate(),

    // Level (optional but controlled)
    body("level")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("Level must be beginner, intermediate, or advanced"),

    // Location (optional)
    body("location")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Location must be valid"),

    // Capacity (optional but must be number)
    body("capacity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Capacity must be a number greater than 0")
      .toInt(),

    // Instructor (optional)
    body("instructor")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Instructor name must be valid"),

    // Duration (optional)
    body("duration")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Duration must be valid"),
  ];
};

exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  next();
};