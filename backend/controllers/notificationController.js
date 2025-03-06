const { Notification } = require("../models");

// 📌 Gửi thông báo mới
const createNotification = async (req, res) => {
  try {
    const { title, message, targetType, departmentId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Tiêu đề và nội dung thông báo là bắt buộc" });
    }

    if (targetType === "Department" && !departmentId) {
      return res.status(400).json({ message: "Phòng ban không hợp lệ" });
    }

    const newNotification = new Notification({ title, message, targetType, departmentId });
    await newNotification.save();

    res.status(201).json({ message: "Gửi thông báo thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 📌 Lấy tất cả thông báo
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate("departmentId", "name").sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 📌 Lấy thông báo theo phòng ban hoặc tất cả
const getNotificationsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    // Tìm tất cả thông báo chung + thông báo của phòng ban cụ thể
    const notifications = await Notification.find({
      $or: [{ targetType: "All" }, { departmentId }],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { createNotification, getAllNotifications, getNotificationsByDepartment };
