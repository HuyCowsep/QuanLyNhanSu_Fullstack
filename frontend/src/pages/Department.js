import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Department.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeTable, setShowEmployeeTable] = useState(false); // State to show employee table
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Store selected department
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Get role from localStorage

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng ban:', error);
      }
    };

    fetchDepartments();
  }, [token]);

  const filteredDepartments = departments.filter(
    (dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || dept.manager.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteEmployee = async (employeeId) => {
    const result = await Swal.fire({
      title: '⚠️ Xác nhận xóa nhân viên',
      text: 'Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:9999/api/employees/${employeeId}/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          title: '🎉 Thành công!',
          text: 'Nhân viên đã được xóa!',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        setSelectedDepartment((prevState) => ({
          ...prevState,
          employees: prevState.employees.filter((emp) => emp._id !== employeeId),
        }));
      } catch (error) {
        Swal.fire({
          title: '❌ Lỗi!',
          text: 'Không thể xóa nhân viên!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleShowEmployeeTable = (dept) => {
    setSelectedDepartment(dept);
    setShowEmployeeTable(true);
  };

  return (
    <div className="department-page">
      {/* 🔥 Nút Back Home */}
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h1>Danh sách phòng ban</h1>
      <input
        type="text"
        placeholder="🔍 Tìm kiếm phòng ban hoặc trưởng phòng..."
        className="search-box"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredDepartments.map((dept) => (
        <div key={dept._id} className="department-card">
          <h2>{dept.name}</h2>
          <p>
            <strong>Trưởng phòng:</strong> {dept.manager}
          </p>
          <p>
            <strong>Mô tả:</strong> {dept.description || 'Không có mô tả'}
          </p>
          <p>
            <strong>Số lượng nhân viên:</strong> {dept.numberOfEmployees}
          </p>

          {/* Show the button only for admin */}
          {role === 'admin' && (
            <>
              {!showEmployeeTable ? (
                <button onClick={() => handleShowEmployeeTable(dept)} className="btn-show-employee">
                  Chỉnh sửa
                </button>
              ) : (
                <button onClick={() => window.location.reload()} className="btn-cancel-edit">
                  Hủy chỉnh sửa
                </button>
              )}
            </>
          )}

          {/* Show employee table when admin clicks "Chỉnh sửa" */}
          {showEmployeeTable && selectedDepartment._id === dept._id && (
            <div className="employee-table">
              <h3>Danh sách nhân viên</h3>
              <table>
                <thead>
                  <tr>
                    <th>Họ và Tên</th>
                    <th>Chức vụ</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td>{emp.position}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteEmployee(emp._id)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3>Nhân viên:</h3>
          <ul className="employee-list">
            {dept.employees.map((emp) => (
              <li key={emp._id}>
                {emp.firstName} {emp.lastName} - {emp.position}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Department;
