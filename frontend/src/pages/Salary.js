import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Salary.css';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');
  //xếp theo ngày tăng dần trong bảng lương - ChatGPT
  const sortedSalaries = [...salaries].sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/payroll/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('🔥 Check data xem là gì:', response.data);
        setSalaries(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (error) {
        console.error('❌ Lỗi khi lấy thông tin lương:', error);
      }
    };

    if (employeeId) {
      fetchSalary();
    }
  }, [employeeId, token]);

  return (
    <div className="salary-page">
      {/* Nút Back Home */}
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h1>Bảng Lương của {salaries.length > 0 ? `${salaries[0].employeeId.firstName} ${salaries[0].employeeId.lastName}` : 'Bạn'}</h1>
      {salaries.length > 0 && (
        <p style={{ margin: '25px 5px' }}>
          Bạn đã được trả tổng cộng{' '}
          <strong>
            <span style={{ color: 'green' }}>{salaries.length}</span>
          </strong>{' '}
          lần lương
        </p>
      )}

      {salaries && salaries.length > 0 ? (
        <table className="salary-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Tháng</th>
              <th>Năm</th>
              <th>Lương Cơ Bản</th>
              <th>Thưởng</th>
              <th>Phạt</th>
              <th>Tổng Lương</th>
            </tr>
          </thead>
          <tbody>
            {sortedSalaries.map((salary) => (
              <tr key={salary._id}>
                <td>{salary.paymentDate ? new Date(salary.paymentDate).getDate() : 'Chưa cập nhật'}</td>
                <td>{salary.paymentDate ? new Date(salary.paymentDate).getMonth() + 1 : 'Chưa cập nhật'}</td>
                <td>{salary.paymentDate ? new Date(salary.paymentDate).getFullYear() : 'Chưa cập nhật'}</td>
                <td>{salary.baseSalary ? salary.baseSalary.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
                <td>{salary.bonus ? salary.bonus.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
                <td>{salary.deductions ? `- ${salary.deductions.toLocaleString('vi-VN')}` : '0'} VNĐ</td>
                <td>{salary.total ? salary.total.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có dữ liệu lương.</p>
      )}
    </div>
  );
};

export default Salary;
