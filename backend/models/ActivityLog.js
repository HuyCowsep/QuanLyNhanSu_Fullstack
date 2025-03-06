const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ai thực hiện hành động
  action: { type: String, required: true }, // Hành động thực hiện
  targetModel: { type: String, required: true }, // Mô hình bị tác động (Employee, Department, v.v.)
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID của đối tượng bị tác động
  timestamp: { type: Date, default: Date.now }, // Thời gian thực hiện
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
