const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, //Thêm {useNewUrlParser: true, useUnifiedTopology: true } để đảm bảo kết nối ổn định.
      useUnifiedTopology: true,
    });
    console.log("✅ Kết nối MongoDB Compass thành công!");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
