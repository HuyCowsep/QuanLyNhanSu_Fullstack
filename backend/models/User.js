const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
});

module.exports = mongoose.model('User', userSchema);
