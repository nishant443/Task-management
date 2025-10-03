// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        // 1️⃣ Extract token from Authorization header
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // 3️⃣ Find user and attach to req
        const user = await User.findById(decoded.id).select("-passwordHash");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // 4️⃣ Check if user is banned
        if (user.banned) {
            return res.status(403).json({ message: "Your account is banned" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = auth;
