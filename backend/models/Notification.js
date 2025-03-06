const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tiêu đề thông báo
  message: { type: String, required: true }, // Nội dung thông báo
  targetType: { type: String, enum: ["All", "Department"], required: true }, // Gửi đến toàn bộ công ty hoặc phòng ban
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: function () {
      return this.targetType === "Department";
    },
  }, // Nếu gửi đến phòng ban thì cần ID phòng ban
  createdAt: { type: Date, default: Date.now }, // Thời gian gửi thông báo
});

module.exports = mongoose.model("Notification", notificationSchema);
