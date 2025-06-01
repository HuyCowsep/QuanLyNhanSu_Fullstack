import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Attendance.css';

const AdminAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem('token');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceRes = await axios.get('http://localhost:9999/api/attendance/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendances(attendanceRes.data);

        const employeesRes = await axios.get('http://localhost:9999/api/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employeesRes.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, [token]);

  const todayAttendanceMap = new Map();
  attendances.forEach((att) => {
    if (att.date.startsWith(today)) {
      todayAttendanceMap.set(att.employeeId, att);
    }
  });

  return (
    <div className="attendance-admin">
      <h1 style={{ textAlign: 'center' }}>QUẢN LÝ CHẤM CÔNG NGÀY {new Date().toLocaleDateString('vi-VN')}</h1>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Họ & Tên</th>
            <th>Phòng Ban</th>
            <th>Giờ vào</th>
            <th>Giờ ra</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const att = todayAttendanceMap.get(emp._id);
            return (
              <tr key={emp._id}>
                <td>{`${emp.firstName} ${emp.lastName}`}</td>
                <td>{emp.department?.name || 'Không có'}</td>
                <td>{att ? att.checkInTime : '--:--'}</td>
                <td>{att ? att.checkOutTime : '--:--'}</td>
                <td>{att ? att.status : 'Chưa chấm công'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAttendance;