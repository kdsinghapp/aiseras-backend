const User = require("../../model/auth/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// **Step 1: Enter Email & Send Verification Code**
exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (!user) {
      user = new User({ email, verificationCode, isVerified: false });
    } else {
      user.verificationCode = verificationCode;
    }

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Your verification code is ${verificationCode}`,
    });

    res
      .status(200)
      .json({ message: "Verification code sent to email", success: "True" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Step 2: Verify Email Code**
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Invalid verification code" });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully. Please complete your profile.",
      success: "True",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Step 3: Enter Full Details**
exports.completeProfile = async (req, res) => {
  try {
    let { email, name, age, gender, password } = req.body;
    email = email.toLowerCase();

    console.log("Complete Profile - Received Email:", email);

    const user = await User.findOne({ email });

    console.log("User Found:", user);

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isVerified)
      return res.status(400).json({ message: "Email not verified" });
    if (user.password)
      return res.status(400).json({ message: "Profile already completed" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure age is a number
    age = parseInt(age) || null;

    // Debugging log before updating user
    console.log("Updating User Details:", { name, age, gender });

    user.name = name;
    user.age = age;
    user.gender = gender;
    user.password = hashedPassword;

    await user.save();

    console.log("Profile Updated Successfully:", user);

    res
      .status(200)
      .json({
        message: "Profile completed successfully. You can now log in.",
        data: user,
        success: "True",
      });
  } catch (error) {
    console.error("Complete Profile Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// **Login (Only After Completing Profile)**
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isVerified)
      return res.status(400).json({ message: "Email not verified" });
    if (!user.password)
      return res.status(400).json({ message: "Profile incomplete" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "User Logged in Sucessfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Change Password**
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    console.log("Received Email:", email);
    const user = await User.findOne({ email });
    console.log("User Found:", user);

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
