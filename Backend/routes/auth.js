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
        res.status(201).json({ message: `${role || "User"} registered successfully`, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --------------------
// Login User/Admin
// --------------------
// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // 2️⃣ Check if user is banned
        if (user.banned) return res.status(403).json({ message: "Your account is banned" });

        // 3️⃣ Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // 4️⃣ Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1d" });

        // 5️⃣ Respond with user data and token
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
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
        const users = await User.find({}, "_id name email role");
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

router.put("/ban/:id", auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.banned = true;
        await user.save();
        res.json({ message: `${user.name} is banned` });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Unban a user
router.put("/unban/:id", auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.banned = false;
        await user.save();
        res.json({ message: `${user.name} is unbanned` });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
