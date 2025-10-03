const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        // Basic details
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // ensures consistent email storage
            trim: true,
        },

        // Authentication
        passwordHash: {
            type: String,
            required: true,
        },

        // Role-based access
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        banned: {
            type: Boolean,
            default: false
        },

    },
    {
        timestamps: true, // adds createdAt & updatedAt automatically
    }
);

module.exports = mongoose.model("User", UserSchema);
