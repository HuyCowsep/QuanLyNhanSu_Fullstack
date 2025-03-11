import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Department.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9999/api/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng ban:', error);
      }
    };

    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || dept.manager.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="department-page">
      {/* 🔥 Nút Back Home */}
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h1>Danh sách phòng ban</h1>
      <input type="text" placeholder="🔍 Tìm kiếm phòng ban hoặc trưởng phòng..." className="search-box" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

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
