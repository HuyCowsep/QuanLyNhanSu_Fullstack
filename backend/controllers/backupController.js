// backend/controllers/backupController.js
const { createBackup } = require('../utils/backup');

const backupDatabase = (req, res) => {
  createBackup((err, fileName) => {
    if (err) {
      return res.status(500).json({ message: 'Sao lưu thất bại', error: err.message });
    }
    res.json({ message: 'Sao lưu thành công', file: fileName });
  });
};

module.exports = { backupDatabase };
