const { Notification } = require('../models');
const mongoose = require('mongoose');

// 📌 Gửi thông báo mới
const createNotification = async (req, res) => {
  try {
    const { title, message, targetType, departmentId } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!title || !message) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung không được để trống' });
    }

    // Nếu gửi thông báo theo phòng ban, kiểm tra departmentId
    if (targetType === 'Department' && !departmentId) {
      return res.status(400).json({ message: 'Vui lòng chọn phòng ban' });
    }

    // Tạo thông báo mới
    const newNotification = new Notification({
      title,
      message,
      targetType,
      departmentId: targetType === 'Department' ? departmentId : null,
      createdAt: new Date(),
    });

    // Lưu vào DB
    await newNotification.save();

    res.json({ message: 'Thông báo đã được tạo thành công', notification: newNotification });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo thông báo', error: error.message });
  }
};

// 📌 Lấy tất cả thông báo
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { targetType: 'All' },
        { targetType: 'Department' }, // Thêm điều kiện lấy tất cả thông báo của phòng ban
      ],
    });
    res.json(notifications);
  } catch (error) {
    console.error('❌ Lỗi khi lấy thông báo:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 📌 Lấy thông báo theo phòng ban hoặc tất cả
const getNotificationsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    // Tìm tất cả thông báo chung + thông báo của phòng ban cụ thể
    const notifications = await Notification.find({
      $or: [{ targetType: 'All' }, { departmentId }],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { createNotification, getAllNotifications, getNotificationsByDepartment };
