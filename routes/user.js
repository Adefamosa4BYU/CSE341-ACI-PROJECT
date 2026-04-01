const express = require("express");
const passport = require("passport");
const router = express.Router();

const { register, login, githubCallback, logout, getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const { registerRules, loginRules, validate } = require("../middleware/validation");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Redirect to GitHub OAuth
// router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
// Redirect to GitHub OAuth
router.get("/github", (req, res, next) => {
  // #swagger.ignore = true
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

//  Callback GitHub
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  githubCallback
);

// GET all users
// #swagger.ignore = true
router.get("/", auth, role("admin"), getAllUsers);

router.post("/register", registerRules(), validate, register);

router.post("/login", loginRules(), validate, login);

// Logout (works for both JWT + OAuth)
router.post("/logout", logout);

// GET single user
router.get("/:id", getUserById);

// UPDATE user
router.put("/:id", registerRules(), validate, updateUser);

// DELETE user
router.delete("/:id", auth, role("admin"), deleteUser);

module.exports = router;