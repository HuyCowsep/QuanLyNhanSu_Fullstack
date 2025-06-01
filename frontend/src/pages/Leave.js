import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/Leave.css";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({ startDate: "", endDate: "", reason: "" });
  const [remainingDays, setRemainingDays] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("employeeId");

  const fetchData = async () => {
    try {
      const employeeRes = await axios.get(`http://localhost:9999/api/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeName(`${employeeRes.data.firstName} ${employeeRes.data.lastName}`);
      setDepartmentName(employeeRes.data.department?.name || "Chưa cập nhật");

      const leavesRes = await axios.get(`http://localhost:9999/api/leaves/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(leavesRes.data);

      const remainingRes = await axios.get(`http://localhost:9999/api/leaves/remaining/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRemainingDays(remainingRes.data.remainingLeaveDays);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (remainingDays === 0) {
      Swal.fire("Không thể gửi đơn!", "Bạn đã hết ngày nghỉ phép!", "error");
      return;
    }

    try {
      await axios.post(
        "http://localhost:9999/api/leaves/create",
        { ...formData, employeeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Thành công!", "Đơn nghỉ phép đã được gửi!", "success").then(() => {
        setFormData({ startDate: "", endDate: "", reason: "" });
        fetchData();
      });
    } catch (error) {
      Swal.fire("Lỗi!", error.response?.data?.message || "Không thể gửi đơn!", "error");
    }
  };

  const handleDeleteLeave = async (id) => {
    const result = await Swal.fire({
      title: "Bạn muốn thu hồi đơn?",
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa ngay!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:9999/api/leaves/${id}/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire("Đã xóa!", "Đơn nghỉ phép đã bị xóa.", "success").then(() => {
          fetchData();
        });
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể xóa đơn nghỉ phép!", "error");
      }
    }
  };

  const getLeaveStatusClass = (status) => {
    if (status === "Đã duyệt") return "leave-status approved";
    if (status === "Từ chối") return "leave-status rejected";
    return "leave-status pending";
  };

  return (
    <div className="leave-page">
      <h1>Đơn xin Nghỉ Phép</h1>
      <p
        className={
          remainingDays === 0
            ? "leave-remaining red"
            : remainingDays <= 4
            ? "leave-remaining orange"
            : "leave-remaining green"
        }
      >
        Số ngày phép còn lại: <strong>{remainingDays !== null ? remainingDays : "Đang tải..."}</strong>
      </p>
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
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            required
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </fieldset>
        <fieldset>
          <legend>Nghỉ đến hết ngày:</legend>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            required
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </fieldset>
        <textarea
          name="reason"
          placeholder="Lý do nghỉ phép"
          value={formData.reason}
          required
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        ></textarea>
        <button type="submit" disabled={remainingDays === 0}>
          {remainingDays === 0 ? "Bạn đã hết phép 😢" : "Gửi đơn nghỉ phép 📩"}
        </button>
      </form>
      <h2 style={{ margin: "40px 0px", textAlign: "center" }}>Danh sách đơn nghỉ phép của bạn</h2>
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
              <td>{new Date(leave.startDate).toLocaleDateString("vi-VN")}</td>
              <td>{new Date(leave.endDate).toLocaleDateString("vi-VN")}</td>
              <td>{leave.reason}</td>
              <td className={getLeaveStatusClass(leave.status)}>{leave.status}</td>
              <td>
                {leave.status === "Chờ duyệt" && (
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
