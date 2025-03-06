const { ActivityLog } = require("../models");

const logActivity = async (userId, action, targetModel, targetId) => {
  try {
    const newLog = new ActivityLog({ userId, action, targetModel, targetId });
    await newLog.save();
  } catch (error) {
    console.error("Lỗi ghi lịch sử hoạt động:", error.message);
  }
};

// 📌 Lấy lịch sử hoạt động của tất cả người dùng (Admin)
const getAllLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate("userId", "email").sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 📌 Lấy lịch sử hoạt động của một người dùng cụ thể
const getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await ActivityLog.find({ userId }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { logActivity, getAllLogs, getUserLogs };
