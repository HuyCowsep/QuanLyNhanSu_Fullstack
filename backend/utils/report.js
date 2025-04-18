// backend/utils/report.js
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

const generateReport = (data, fields, reportName) => {
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  const filePath = path.join(__dirname, '../public/exports', `${reportName}-${Date.now()}.csv`);
  fs.writeFileSync(filePath, csv);
  return filePath;
};

module.exports = { generateReport };
