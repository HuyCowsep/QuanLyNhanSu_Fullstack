// backend/controllers/reportController.js
const { Employee } = require('../models');
const { generateReport } = require('../utils/report');
const path = require('path');

const generateEmployeeReport = async (req, res) => {
  try {
    const employees = await Employee.find().select('name email department');
    const fields = ['name', 'email', 'department'];
    const filePath = generateReport(employees, fields, 'employees');
    res.json({ message: 'Báo cáo đã được tạo', file: path.basename(filePath) });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo báo cáo', error: error.message });
  }
};

module.exports = { generateEmployeeReport };
