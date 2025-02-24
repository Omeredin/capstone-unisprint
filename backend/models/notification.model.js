const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true }, // Add this
    message: { type: String, required: true },
    acceptedby: {type: Schema.Types.ObjectId, ref: "User", default: null},
    createdAt: { type: Date, default: Date.now },
    type: { type: String, enum: ["application", "response"], required: true }, // Add this
    read: { type: Boolean, default: false },

});

module.exports = mongoose.model("Notification", notificationSchema);