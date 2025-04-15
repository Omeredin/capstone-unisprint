const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema({
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "Tutoring", "Food Delivery", etc.
    location: { type: String, default: "AmericanU" }, // e.g., "Library, Study Room B"
    payment: { type: Number, required: true }, // e.g., 15 (for $15)
    urgency: { type: Boolean, default: false }, // Indicates if the job is urgent
    duration: { type: Number, default: 0 }, // Duration in hours
    datePosted: { type: Date, default: Date.now }, // Automatically sets to the current date
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    acceptedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    acceptedAt: {type: Date, default: null},
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track applicants
    status: { type: String, default: "Open" }, // Open, Accepted, or Rejected
    replies: [replySchema] // Array of replies
});

module.exports = mongoose.model("Order", orderSchema);