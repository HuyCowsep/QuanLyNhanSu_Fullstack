import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/Attendance.css';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');

  const fetchAttendances = async () => {
    try {
      const res = await axios.get(`http://localhost:9999/api/attendance/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAttendances(res.data);
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = res.data.find((att) => att.date.split('T')[0] === today);

      if (todayAttendance) {
        setIsCheckedIn(true);
        if (todayAttendance.checkOutTime) {
          setIsCheckedOut(true);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chấm công:', error);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, [token, employeeId]);

  const handleCheckIn = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await axios.post(
        'http://localhost:9999/api/attendance/create',
        { employeeId, date: today },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire('Thành công!', 'Bạn đã chấm công vào!', 'success').then(() => {
        setIsCheckedIn(true);
        fetchAttendances(); // Fetch lại dữ liệu thay vì reload
      });
    } catch (error) {
      Swal.fire('Lỗi!', error.response?.data?.message || 'Không thể chấm công!', 'error');
    }
  };

  const handleCheckOut = async (attendanceId) => {
    try {
      await axios.put(
        `http://localhost:9999/api/attendance/${attendanceId}/update`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire('Thành công!', 'Bạn đã chấm công ra thành công!', 'success').then(() => {
        setIsCheckedOut(true);
        fetchAttendances(); // Fetch lại dữ liệu thay vì reload
      });
    } catch (error) {
      Swal.fire('Lỗi!', 'Không thể chấm công ra!', 'error');
    }
  };

  return (
    <div className="attendance-page">
      <h1>Chấm Công</h1>
      {!isCheckedIn ? (
        <button className="check-in-btn" onClick={handleCheckIn}>
          Chấm công vào ⏰
        </button>
      ) : (
        <p className="checked-in-text" style={{ margin: '20px 0px' }}>
          {isCheckedOut ? 'Bạn đã chấm công hôm nay thành công, tạm biệt!' : '✅ Chấm công vào thành công!'}
        </p>
      )}
      <h2>Lịch sử chấm công</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Giờ vào</th>
            <th>Giờ ra</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((att) => (
            <tr key={att._id}>
              <td>{new Date(att.date).toLocaleDateString('vi-VN')}</td>
              <td>{att.checkInTime || '--:--'}</td>
              <td>{att.checkOutTime || '--:--'}</td>
              <td
                className={`status-cell ${
                  att.status === 'Đi làm' || att.status === 'Nghỉ có phép'
                    ? 'status-green'
                    : att.status === 'Đi làm muộn'
                    ? 'status-yellow'
                    : 'status-red'
                }`}
              >
                {att.status}
              </td>
              <td>
                {!att.checkOutTime ? (
                  <button className="check-out-btn" onClick={() => handleCheckOut(att._id)}>
                    Chấm công ra 🏠
                  </button>
                ) : (
                  <p className="checked-out-text">Hoàn thành</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;