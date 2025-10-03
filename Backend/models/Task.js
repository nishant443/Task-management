const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        // Basic details
        title: {
            type: String,
            required: true,
            trim: true, // removes extra spaces
        },
        description: {
            type: String,
            trim: true,
        },

        // Task metadata
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },

        // Relationships
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // ✅ AssignedTo as email string instead of ObjectId
        assignedTo: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    // simple email regex
                    return !v || /^\S+@\S+\.\S+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`,
            },
            default: null,
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt
    }
);

module.exports = mongoose.model("Task", TaskSchema);
