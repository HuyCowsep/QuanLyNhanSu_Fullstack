import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Attendance.css';

const AdminAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/attendance/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('📌 Dữ liệu chấm công:', response.data);
        setAttendances(response.data);
      } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu chấm công:', error.response?.data || error.message);
      }
    };

    fetchAttendances();
  }, []);

  return (
    <div className="attendance-admin">
      {/* 🔙 Nút quay lại Dashboard */}
      <div className="back-home-container">
        <span className="back-home" onClick={() => navigate('/dashboard')}>
          ⬅️ Back Home
        </span>
      </div>

      <h1 style={{ textAlign: 'center' }}>QUẢN LÝ CHẤM CÔNG</h1>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Họ & Tên</th>
            <th>Phòng Ban</th>
            <th>Ngày</th>
            <th>Giờ vào</th>
            <th>Giờ ra</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((att) => (
            <tr key={att._id}>
              <td>{att.employeeInfo ? `${att.employeeInfo.firstName} ${att.employeeInfo.lastName}` : 'Không có'}</td>
              <td>{att.departmentInfo ? att.departmentInfo.name : 'Không có'}</td>
              <td>{new Date(att.date).toLocaleDateString('vi-VN')}</td>
              <td>{att.checkInTime || '--:--'}</td>
              <td>{att.checkOutTime || '--:--'}</td>
              <td>{att.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAttendance;

//
//Đoạn code mới nhưng chưa hoàn thiện
//
//
//
//
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Attendance.css';

// const AdminAttendance = () => {
//   const [attendances, setAttendances] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');
//   const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại theo định dạng YYYY-MM-DD

//   useEffect(() => {
//     const fetchAttendances = async () => {
//       try {
//         const response = await axios.get('http://localhost:9999/api/attendance/all', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log('📌 Dữ liệu chấm công:', response.data);
//         setAttendances(response.data);
//       } catch (error) {
//         console.error('❌ Lỗi khi lấy dữ liệu chấm công:', error.response?.data || error.message);
//       }
//     };

//     const fetchEmployees = async () => {
//       try {
//         const response = await axios.get('http://localhost:9999/api/employees', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log('📌 Danh sách nhân viên:', response.data);
//         setEmployees(response.data);
//       } catch (error) {
//         console.error('❌ Lỗi khi lấy danh sách nhân viên:', error.response?.data || error.message);
//       }
//     };

//     fetchAttendances();
//     fetchEmployees();
//   }, []);

//   // Tạo danh sách nhân viên theo ngày hiện tại
//   const todayAttendanceMap = new Map();
//   attendances.forEach((att) => {
//     if (att.date.startsWith(today)) {
//       todayAttendanceMap.set(att.employeeId, att);
//     }
//   });

//   return (
//     <div className="attendance-admin">
//       {/* 🔙 Nút quay lại Dashboard */}
//       <div className="back-home-container">
//         <span className="back-home" onClick={() => navigate('/dashboard')}>
//           ⬅️ Back Home
//         </span>
//       </div>

//       <h1 style={{ textAlign: 'center' }}>QUẢN LÝ CHẤM CÔNG NGÀY {new Date().toLocaleDateString('vi-VN')}</h1>

//       <table className="attendance-table">
//         <thead>
//           <tr>
//             <th>Họ & Tên</th>
//             <th>Phòng Ban</th>
//             <th>Giờ vào</th>
//             <th>Giờ ra</th>
//             <th>Trạng thái</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employees.map((emp) => {
//             const att = todayAttendanceMap.get(emp._id);
//             return (
//               <tr key={emp._id}>
//                 <td>{`${emp.firstName} ${emp.lastName}`}</td>
//                 <td>{emp.department?.name || 'Không có'}</td>
//                 <td>{att ? att.checkInTime : '--:--'}</td>
//                 <td>{att ? att.checkOutTime : '--:--'}</td>
//                 <td>{att ? att.status : 'Chưa chấm công'}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminAttendance;
