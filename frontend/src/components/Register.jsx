import React, { useState } from "react";

const Register = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  if (!isOpen) return null; // ถ้า isOpen เป็น false จะไม่แสดงอะไรเลย

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงในฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // เคลียร์ข้อความแจ้งเตือนก่อน

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        setFormData({ username: "", email: "", password: "" });
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
        <h2 className="text-2xl font-bold text-center text-gray-800">สมัครสมาชิก</h2>

        {message && <p className="text-center text-red-500 mt-2">{message}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">ชื่อผู้ใช้</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-2 w-full p-3 border rounded-lg focus:ring focus:ring-blue-400"
              required
            />
          </div>
          <div className="mt-4">
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
            className="w-full mt-4 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
          >
            สมัครเรียน
          </button>
        </form>

        {/* ปุ่มปิด Popup */}
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 hover:text-red-500 transition"
        >
          ❌ ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};

export default Register;