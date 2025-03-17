const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Chờ duyệt', 'Đã duyệt', 'Từ chối'],
    default: 'Chờ duyệt',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Leave', leaveSchema);
