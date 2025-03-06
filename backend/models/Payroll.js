const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payroll", payrollSchema);
