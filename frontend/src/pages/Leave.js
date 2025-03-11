import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../styles/Leave.css';

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });
  const [remainingDays, setRemainingDays] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployeeName(`${res.data.firstName} ${res.data.lastName}`);
        setDepartmentName(res.data.department?.name || 'Chưa cập nhật');
      } catch (error) {
        console.error('Lỗi khi lấy thông tin nhân viên:', error);
      }
    };

    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/api/leaves/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployeeName(`${res.data.firstName} ${res.data.lastName}`);
        setLeaves(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy đơn nghỉ phép:', error);
      }
    };

    const fetchRemainingDays = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/api/leaves/remaining/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRemainingDays(res.data.remainingLeaveDays);
      } catch (error) {
        console.error('Lỗi khi lấy số ngày nghỉ còn lại:', error);
      }
    };

    fetchEmployeeInfo();
    fetchLeaves();
    fetchRemainingDays();
  }, [token, employeeId]);

  // 📌 Hàm gửi đơn nghỉ phép
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (remainingDays === 0) {
      Swal.fire('Không thể gửi đơn!', 'Bạn đã hết ngày nghỉ phép!', 'error');
      return;
    }

    try {
      await axios.post(
        'http://localhost:9999/api/leaves/create',
        { ...formData, employeeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Swal.fire('Thành công!', 'Đơn nghỉ phép đã được gửi!', 'success').then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire('Lỗi!', error.response?.data?.message || 'Không thể gửi đơn!', 'error');
    }
  };

  // 📌 Xóa đơn nghỉ phép nếu đơn chưa duyệt
  const handleDeleteLeave = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn muốn thu hồi đơn?',
      text: 'Bạn sẽ không thể hoàn tác hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa ngay!',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:9999/api/leaves/${id}/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire('Đã xóa!', 'Đơn nghỉ phép đã bị xóa.', 'success').then(() => {
          window.location.reload();
        });
      } catch (error) {
        Swal.fire('Lỗi!', 'Không thể xóa đơn nghỉ phép!', 'error');
      }
    }
  };

  // 📌 Hàm xác định màu trạng thái đơn
  const getLeaveStatusClass = (status) => {
    if (status === 'Đã duyệt') return 'leave-status approved';
    if (status === 'Từ chối') return 'leave-status rejected';
    return 'leave-status pending';
  };

  return (
    <div className="leave-page">
      {/*  Nút Back Home */}
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h1>Đơn xin Nghỉ Phép</h1>

      {/*  Hiển thị số ngày phép còn lại */}
      <p className={remainingDays === 0 ? 'leave-remaining red' : remainingDays <= 4 ? 'leave-remaining orange' : 'leave-remaining green'}>
        Số ngày phép còn lại: <strong>{remainingDays !== null ? remainingDays : 'Đang tải...'}</strong>
      </p>

      {/*  Biểu mẫu gửi đơn nghỉ phép */}
      <form className="leave-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Nhân viên</legend>
          <input type="text" value={employeeName} disabled className="disabled-input" />
        </fieldset>

        <fieldset>
          <legend>Phòng ban</legend>
          <input type="text" value={departmentName} disabled className="disabled-input" />
        </fieldset>

        <fieldset>
          <legend>Bắt đầu nghỉ từ ngày:</legend>
          <input type="date" name="startDate" required onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
        </fieldset>

        <fieldset>
          <legend>Nghỉ đến hết ngày:</legend>
          <input type="date" name="endDate" required onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
        </fieldset>

        <textarea name="reason" placeholder="Lý do nghỉ phép" required onChange={(e) => setFormData({ ...formData, reason: e.target.value })}></textarea>

        <button type="submit" disabled={remainingDays === 0}>
          {remainingDays === 0 ? 'Bạn đã hết phép 😢' : 'Gửi đơn nghỉ phép 📩'}
        </button>
      </form>

      {/*  Danh sách đơn nghỉ phép của nhân viên */}
      <h2 style={{ margin: '40px 0px', textAlign: 'center ' }}>Danh sách đơn nghỉ phép của bạn</h2>
      <table className="leave-table">
        <thead>
          <tr>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Lý do</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{new Date(leave.startDate).toLocaleDateString('vi-VN')}</td>
              <td>{new Date(leave.endDate).toLocaleDateString('vi-VN')}</td>
              <td>{leave.reason}</td>
              <td className={getLeaveStatusClass(leave.status)}>{leave.status}</td>
              <td>
                {leave.status === 'Chờ duyệt' && (
                  <button className="delete-btn" onClick={() => handleDeleteLeave(leave._id)}>
                    🗑 Xóa
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leave;
