const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Đang lưu file vào:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log('📸 File nhận được:', file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('🛠 Kiểm tra file:', file);
    if (!file) {
      return cb(new Error('Không có file nào được tải lên!'));
    }
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận file hình ảnh (JPG, JPEG, PNG)'));
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn 2MB
});

module.exports = upload;
