import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDepartment.css';
import Swal from 'sweetalert2';

const AdminDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    managerId: '',
    description: '',
  });
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const departmentsRes = await axios.get('http://localhost:9999/api/departments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(departmentsRes.data);

      const employeesRes = await axios.get('http://localhost:9999/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAddDepartment = async () => {
    try {
      const response = await axios.post('http://localhost:9999/api/departments/create', newDepartment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: response.data.message,
      });
      setNewDepartment({ name: '', managerId: '', description: '' });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Có gì đó không ổn!',
        text: 'Lỗi khi thêm phòng ban',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Phòng ban này sẽ bị xóa vĩnh viễn!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa ngay!',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:9999/api/departments/${id}/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Đã xóa!', 'Phòng ban đã bị xóa.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Có gì đó không ổn!',
          text: 'Lỗi khi xóa phòng ban',
        });
      }
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    const manager = employees.find((emp) => emp._id === dept.managerId);
    return (
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (manager && `${manager.firstName} ${manager.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="admin-department-page">
      <h1>Quản lý phòng ban</h1>
      <input
        type="text"
        placeholder="🔍 Tìm kiếm phòng ban, trưởng phòng hoặc mô tả..."
        className="search-box"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="add-department">
        <input
          type="text"
          placeholder="Tên phòng ban"
          value={newDepartment.name}
          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
        />
        <select
          value={newDepartment.managerId}
          onChange={(e) => setNewDepartment({ ...newDepartment, managerId: e.target.value })}
        >
          <option value="">Chọn trưởng phòng</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName} - {emp.position} {emp.role === 'Trưởng phòng' ? '(Leader)' : ''}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Mô tả"
          value={newDepartment.description}
          onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
        />
        <button onClick={handleAddDepartment}>Thêm phòng ban</button>
      </div>
      {filteredDepartments.map((dept) => (
        <div key={dept._id} className="department-card">
          <h2>{dept.name}</h2>
          <p>
            <strong>Trưởng phòng:</strong> {dept.manager}
          </p>
          <p>
            <strong>Mô tả:</strong> {dept.description || 'Không có mô tả'}
          </p>
          <button className="delete-btn" onClick={() => handleDelete(dept._id)}>
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDepartment;