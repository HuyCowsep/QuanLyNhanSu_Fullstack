import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Salary.css';

const AdminSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ employeeId: '', month: '', year: '', baseSalary: '', bonus: '' });
  const [editingSalaryId, setEditingSalaryId] = useState(null);
  //xếp ngày tăng dần trong bảng lương
  const sortedSalaries = [...salaries].sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  //bảng lương tham khảo màu mè hoa lá
  const defaultSalaries = [
    { position: 'Intern (Thực tập sinh)', salary: '3 - 7 triệu', note: 'Trợ cấp, có thể cao hơn nếu làm nhiều.' },
    { position: 'Fresher (Dưới 1 năm KN)', salary: '8 - 15 triệu', note: 'Mới ra trường, học nhanh, code ổn là được.' },
    { position: 'Junior (1-3 năm KN)', salary: '15 - 25 triệu', note: 'Có thể tự làm task, chưa đủ lead team.' },
    { position: 'Middle (3-5 năm KN)', salary: '25 - 40 triệu', note: 'Làm chủ dự án nhỏ, mentor junior.' },
    { position: 'Senior (5+ năm KN)', salary: '40 - 70 triệu', note: 'Thiết kế hệ thống, tối ưu code.' },
    { position: 'Tech Lead', salary: '60 - 100 triệu', note: 'Định hướng công nghệ, code ít nhưng chất.' },
    { position: 'Solution Architect', salary: '80 - 150 triệu', note: 'Thiết kế hệ thống lớn, làm việc với KH.' },
    { position: 'CTO (Giám đốc công nghệ)', salary: '100 - 250 triệu', note: 'Tư duy chiến lược, định hướng cty.' },
  ];
  //lưu cái bảng lương tham khảo màu mè vào local
  const [salaryGuide, setSalaryGuide] = useState(() => {
    const savedData = localStorage.getItem('salaryGuide');
    return savedData ? JSON.parse(savedData) : defaultSalaries;
  });

  //  Lưu vào LocalStorage khi có chỉnh sửa
  useEffect(() => {
    localStorage.setItem('salaryGuide', JSON.stringify(salaryGuide));
  }, [salaryGuide]);

  //  Hàm cập nhật khi admin chỉnh sửa text
  const handleEditGuide = (index, field, value) => {
    const updatedSalaries = [...salaryGuide];
    updatedSalaries[index][field] = value;
    setSalaryGuide(updatedSalaries);
  };

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/payroll/all', { headers: { Authorization: `Bearer ${token}` } });
        setSalaries(response.data);
        console.log('Dữ liệu lương:', response.data);
      } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách lương:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/employees', { headers: { Authorization: `Bearer ${token}` } });
        setEmployees(response.data);
      } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách nhân viên:', error);
      }
    };

    fetchSalaries();
    fetchEmployees();
  }, [token]);

  //Hàm xoá lương
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:9999/api/payroll/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          setSalaries(salaries.filter((salary) => salary._id !== id));
          Swal.fire('Đã xóa!', 'Dữ liệu đã được xóa.', 'success');
        } catch (error) {
          Swal.fire('Lỗi!', 'Không thể xóa lương.', 'error');
          console.error('❌ Lỗi khi xóa lương:', error);
        }
      }
    });
  };

  //Hàm sửa lương trong bảng lương đã trả
  const handleEdit = (salary) => {
    setEditingSalaryId(salary._id);
    setFormData({
      employeeId: salary.employeeId._id,
      paymentDate: salary.paymentDate,
      baseSalary: salary.baseSalary,
      bonus: salary.bonus,
      deductions: salary.deductions,
    });
    setShowModal(true);
  };

  //hàm thêm lương cho nhân viên
  const handleCreate = () => {
    setEditingSalaryId(null);
    setFormData({
      employeeId: '',
      paymentDate: '',
      baseSalary: '',
      bonus: '',
    });
    setShowModal(true); //mở modal
  };

  //Khi chọn nhân viên nào đó thì hiện luôn lương cơ bản ra
  const handleEmployeeSelect = async (employeeId) => {
    setFormData({ ...formData, employeeId });
    try {
      const response = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Tự động điền lương cơ bản vào form
      setFormData((prevData) => ({
        ...prevData,
        baseSalary: response.data.salary || '',
      }));
    } catch (error) {
      console.error('❌ Lỗi khi lấy thông tin nhân viên:', error);
    }
  };

  //Hàm chỉnh lương cơ bản
  const handleSalaryChange = (employeeId, newSalary) => {
    setEmployees((prevEmployees) => prevEmployees.map((emp) => (emp._id === employeeId ? { ...emp, salary: newSalary } : emp)));
  };

  //Hàm xác nhận khi đã chỉnh sửa lương cơ bản xong
  const handleSalaryEdit = async (employeeId, newSalary) => {
    try {
      await axios.put(
        `http://localhost:9999/api/employees/${employeeId}/salary/update`,
        { salary: newSalary },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Swal.fire('Thành công!', 'Lương nhân viên đã được cập nhật!', 'success');
    } catch (error) {
      Swal.fire('Lỗi!', 'Không thể cập nhật lương nhân viên.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paymentDate) {
      return Swal.fire('Lỗi!', 'Vui lòng nhập đầy đủ ngày thanh toán!', 'error');
    }
    // Tạo paymentDate từ ngày/tháng/năm
    const paymentDate = new Date(formData.paymentDate).toISOString();

    try {
      if (editingSalaryId) {
        await axios.put(
          `http://localhost:9999/api/payroll/update/${editingSalaryId}`,
          { ...formData, paymentDate }, // Gửi paymentDate lên server
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire('Thành công!', 'Cập nhật lương thành công!', 'success');
      } else {
        await axios.post(
          'http://localhost:9999/api/payroll/create',
          { ...formData, paymentDate }, // Gửi paymentDate lên server
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire('Thành công!', 'Thêm mới lương thành công!', 'success');
      }

      setShowModal(false);
      window.location.reload();
    } catch (error) {
      Swal.fire('Lỗi!', 'Không thể lưu dữ liệu.', 'error');
      console.error('❌ Lỗi khi cập nhật lương:', error);
    }
  };

  return (
    <div className="admin-salary-page">
      {/* 🔙 Nút Back Home */}
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h1>Quản Lý Lương</h1>

      <div className="salary-guide-container">
        <h2>Bảng lương tham khảo</h2>
        <table className="salary-guide-table">
          <thead>
            <tr>
              <th>Vị trí</th>
              <th>Lương (VNĐ/tháng)</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {salaryGuide.map((item, index) => (
              <tr key={index}>
                <td contentEditable="true" onBlur={(e) => handleEditGuide(index, 'position', e.target.innerText)}>
                  {item.position}
                </td>
                <td contentEditable="true" onBlur={(e) => handleEditGuide(index, 'salary', e.target.innerText)}>
                  {item.salary}
                </td>
                <td contentEditable="true" onBlur={(e) => handleEditGuide(index, 'note', e.target.innerText)}>
                  {item.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nút Thêm Lương */}
      <div className="add-btn-container">
        <button className="add-btn" onClick={handleCreate}>
          Thêm Lương Cho Nhân Viên ➕
        </button>
      </div>

      {employees.length > 0 && (
        <div className="salary-table-container">
          <h2>Lương Cơ Bản Của Nhân Viên</h2>
          <table className="salary-table">
            <thead>
              <tr>
                <th>Nhân Viên</th>
                <th>Phòng ban</th>
                <th>Vị trí công việc</th>
                <th>Chức vụ</th>
                <th>Lương Cơ Bản</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td>{employee.department.name}</td>
                  <td>{employee.position}</td>
                  <td style={{ color: employee.role === 'Trưởng phòng' ? 'red' : 'inherit' }}>{employee.role}</td>
                  <td>
                    <input type="number" value={employee.salary} onChange={(e) => handleSalaryChange(employee._id, e.target.value)} />
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleSalaryEdit(employee._id, employee.salary)} // Truyền cả employee._id và employee.salary
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <br></br>
      <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0px' }}>Bảng lương đã trả</div>
      {salaries.length > 0 ? (
        <table className="salary-table">
          <thead>
            <tr>
              <th>Nhân Viên</th>
              <th>Ngày thanh toán</th>
              <th>Lương Cơ Bản</th>
              <th>Thưởng</th>
              <th>Phạt</th>
              <th>Tổng Lương</th>
              <th colSpan="2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedSalaries.map((salary) => {
              const employee = employees.find((emp) => emp._id === salary.employeeId);
              const paymentDate = new Date(salary.paymentDate);
              return (
                <tr key={salary._id}>
                  <td>{salary.employeeId ? `${salary.employeeId.firstName} ${salary.employeeId.lastName}` : 'Không xác định'}</td>
                  <td>{paymentDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
                  <td>{salary.baseSalary ? salary.baseSalary.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
                  <td>{salary.bonus ? salary.bonus.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
                  <td>{salary.deductions ? `- ${salary.deductions.toLocaleString('vi-VN')}` : '0'} VNĐ</td>
                  <td>{salary.total ? salary.total.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(salary)}>
                      Sửa
                    </button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(salary._id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Không có dữ liệu lương.</p>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal">
          <form className="salary-form" onSubmit={handleSubmit}>
            <label>Nhân Viên</label>
            {editingSalaryId ? (
              // Khi sửa lương đã trả, hiển thị tên nhân viên đã được chọn
              <input
                type="text"
                value={`${employees.find((emp) => emp._id === formData.employeeId)?.firstName} ${
                  employees.find((emp) => emp._id === formData.employeeId)?.lastName
                }`}
                readOnly
              />
            ) : (
              // Khi thêm lương mới, sử dụng select để chọn nhân viên từ List
              <select value={formData.employeeId} onChange={(e) => handleEmployeeSelect(e.target.value)} required>
                <option value="">Chọn nhân viên</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            )}

            <label>Ngày thanh toán</label>
            <input type="date" value={formData.paymentDate} onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })} required />

            <label>Lương Cơ Bản</label>
            <input type="number" value={formData.baseSalary} onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })} required />

            <label>Thưởng</label>
            <input type="number" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: e.target.value })} required />

            <label>Tiền Phạt</label>
            <input type="number" value={formData.deductions} onChange={(e) => setFormData({ ...formData, deductions: e.target.value })} required />

            <button type="submit">{editingSalaryId ? 'Cập nhật' : 'Thêm mới'}</button>
            <button type="button" onClick={() => setShowModal(false)}>
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminSalary;
