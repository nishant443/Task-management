const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

// --------------------
// Register User/Admin
// --------------------
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password)
            return res.status(400).json({ message: "Please provide all fields" });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            passwordHash: hashedPassword,
            role: role || "user",
        });

        await user.save();
        res.status(201).json({ message: `${role || "User"} registered successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------
// Login User/Admin
// --------------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Please provide email and password" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (user.banned)
            return res.status(403).json({ message: "Your account is banned" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "1d" }
        );

        // Send user info and token separately
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------
// Get all users (Admin only)
// --------------------
router.get("/users", auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}, "_id name email role banned");
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------
// Ban a user (Admin only)
// --------------------
router.put("/ban/:id", auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.banned = true;
        await user.save();
        res.json({ message: `${user.name} is banned` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------
// Unban a user (Admin only)
// --------------------
router.put("/unban/:id", auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.banned = false;
        await user.save();
        res.json({ message: `${user.name} is unbanned` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
