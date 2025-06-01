import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginAndRegister.css";

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
        console.log("Login response:", res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("employeeId", res.data.employeeId);
        localStorage.setItem("role", res.data.role);
        setMessage("Đăng nhập thành công!");

        setTimeout(() => {
          window.location.href = "/dashboard"; // Thay navigate bằng window.location.href
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
      console.error("Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-page">
      <div className={`container ${!isLogin ? "active" : ""}`}>
        <div className="form-box login">
          <form onSubmit={isLogin ? handleSubmit : (e) => e.preventDefault()}>
            <h1>Login</h1>
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn">
              Login
            </button>
            {message && isLogin && <p className="message">{message}</p>}
            <p>or login with social platforms</p>

            <ul className="social-icons">
              <li>
                <a href="#">
                  <i className="fab fa-google icon"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-facebook-f icon"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-github icon"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-linkedin-in icon"></i>
                </a>
              </li>
            </ul>
          </form>
        </div>

        <div className="form-box register">
          <form onSubmit={!isLogin ? handleSubmit : (e) => e.preventDefault()}>
            <h1>Register account</h1>
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            {message && !isLogin && <p className="message">{message}</p>}
            <p>or register with social platforms</p>

            <ul className="social-icons">
              <li>
                <a href="#">
                  <i className="fab fa-google icon"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-facebook-f icon"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-github icon"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-linkedin-in icon"></i>
                </a>
              </li>
            </ul>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1 style={{ textAlign: "center" }}>Hi, the company misses you!</h1>
            <p style={{ textAlign: "center" }}>Don't have an account?</p>
            <button className="btn register-btn" onClick={() => setIsLogin(false)}>
              Register now
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1 style={{ textAlign: "center" }}>Welcome, are you ready?</h1>
            <p style={{ textAlign: "center" }}>Already have an account?</p>
            <button className="btn login-btn" onClick={() => setIsLogin(true)}>
              Login now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAndRegister;