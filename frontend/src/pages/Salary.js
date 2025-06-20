import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Salary.css';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employee, setEmployee] = useState(null);
  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');
  const sortedSalaries = [...salaries].sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salaryRes = await axios.get(`http://localhost:9999/api/payroll/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalaries(Array.isArray(salaryRes.data) ? salaryRes.data : [salaryRes.data]);

        const employeeRes = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployee(employeeRes.data);
      } catch (error) {
        console.error('❌ Lỗi khi lấy thông tin:', error);
      }
    };

    if (employeeId && token) {
      fetchData();
    }
  }, [employeeId, token]);

  return (
    <div className="salary-page">
      <h1>Bảng Lương của {salaries.length > 0 ? `${salaries[0].employeeId.firstName} ${salaries[0].employeeId.lastName}` : 'Bạn'}</h1>
      {employee && employee.salary > 0 && (
        <p style={{ margin: '25px 5px' }}>
          Lương cơ bản của bạn: <strong style={{ color: 'green' }}>{employee.salary.toLocaleString('vi-VN')} VNĐ</strong>
        </p>
      )}
      {salaries.length > 0 && (
        <p style={{ margin: '25px 5px' }}>
          Bạn đã được trả tổng cộng <strong><span style={{ color: 'green' }}>{salaries.length}</span></strong> lần lương
        </p>
      )}
      {salaries && salaries.length > 0 ? (
        <table className="salary-table">
          <thead>
            <tr>
              <th>Ngày Nhận Lương</th>
              <th>Lương cơ bản</th>
              <th>Thưởng</th>
              <th>Phạt</th>
              <th>Tổng Lương</th>
            </tr>
          </thead>
          <tbody>
            {sortedSalaries.map((salary) => {
              const paymentDate = new Date(salary.paymentDate);
              return (
                <tr key={salary._id}>
                  <td>{paymentDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
                  <td>{salary.baseSalary ? salary.baseSalary.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
                  <td>{salary.bonus ? salary.bonus.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
                  <td>{salary.deductions ? `- ${salary.deductions.toLocaleString('vi-VN')}` : '0'} VNĐ</td>
                  <td>{salary.total ? salary.total.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p style={{ color: 'red' }}>Bạn chưa được trả lương hoặc không có dữ liệu lương.</p>
      )}
    </div>
  );
};

export default Salary;