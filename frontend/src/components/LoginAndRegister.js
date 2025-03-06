import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginAndRegister.css";
import "boxicons/css/boxicons.min.css";

const LoginAndRegister = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:9999/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 400);
      } else {
        const res = await axios.post("http://localhost:9999/api/auth/register", {
          email: formData.email,
          password: formData.password,
          role: "employee",
        });
        setMessage(res.data.message || "Đăng ký thành công!");

        setTimeout(() => {
          setIsLogin(true);
          setMessage("");
        }, 1000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className={`container ${!isLogin ? "active" : ""}`}>
      {/* Form Đăng nhập */}
      <div className="form-box login">
        <form onSubmit={isLogin ? handleSubmit : (e) => e.preventDefault()}>
          <h1>Đăng nhập</h1>
          <div className="input-box">
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Quên mật khẩu?</a>
          </div>
          <button type="submit" className="btn">
            Đăng nhập
          </button>
          {message && isLogin && <p className="message">{message}</p>}
          <p>hoặc đăng nhập bằng các nền tảng xã hội</p>
          <div className="social-icons">
            <a href="#">
              <i className="bx bxl-google"></i>
            </a>
            <a href="#">
              <i className="bx bxl-facebook"></i>
            </a>
            <a href="#">
              <i className="bx bxl-github"></i>
            </a>
            <a href="#">
              <i className="bx bxl-linkedin"></i>
            </a>
          </div>
        </form>
      </div>

      {/* Form Đăng ký */}
      <div className="form-box register">
        <form onSubmit={!isLogin ? handleSubmit : (e) => e.preventDefault()}>
          <h1>Đăng ký tài khoản</h1>
          <div className="input-box">
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box">
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className="btn">
            Đăng ký
          </button>
          {message && !isLogin && <p className="message">{message}</p>}
          <p>hoặc đăng ký với các nền tảng xã hội</p>
          <div className="social-icons">
            <a href="#">
              <i className="bx bxl-google"></i>
            </a>
            <a href="#">
              <i className="bx bxl-facebook"></i>
            </a>
            <a href="#">
              <i className="bx bxl-github"></i>
            </a>
            <a href="#">
              <i className="bx bxl-linkedin"></i>
            </a>
          </div>
        </form>
      </div>

      {/* Chuyển đổi giữa Login và Register */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1 style={{ textAlign: "center" }}>Xin chào, công ty nhớ bạn rồi đó!</h1>
          <p style={{ textAlign: "center" }}>Bạn không có tài khoản?</p>
          <button className="btn register-btn" onClick={() => setIsLogin(false)}>
            Đăng ký ngay
          </button>
        </div>

        <div className="toggle-panel toggle-right">
          <h1 style={{ textAlign: "center" }}>Chào bạn, sẵn sàng chưa nào?</h1>
          <p style={{ textAlign: "center" }}>Bạn đã có tài khoản? Đăng nhập ngay</p>
          <button className="btn login-btn" onClick={() => setIsLogin(true)}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginAndRegister;
