import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // เคลียร์ข้อความแจ้งเตือน
  
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role); // 📌 บันทึก role
  
        setFormData({ email: "", password: "" }); // ✅ ล้างค่าที่กรอก
        onLoginSuccess(data.username, data.role); // อัปเดต UI
        onClose();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800">เข้าสู่ระบบ</h2>

        {message && <p className="text-center text-red-500 mt-2">{message}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">อีเมล</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-400"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <button onClick={onClose} className="mt-4 w-full text-gray-600 hover:text-red-500 transition">
          ❌ ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};

export default Login;