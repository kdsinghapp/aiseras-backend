const express = require("express");
const router = express.Router();
const {
  sendVerificationCode,
  completeProfile,
  verifyEmail,
  login,
  changePassword,
} = require("../../controller/auth/userController");
const passport = require("passport");

router.post("/send-verification", sendVerificationCode);

router.post("/verify-email", verifyEmail);

router.post("/complete-profile", completeProfile);

router.post("/login", login);

router.post("/change-password", changePassword);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

module.exports = router;
