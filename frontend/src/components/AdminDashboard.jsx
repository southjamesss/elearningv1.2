import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // เมนูที่ให้ Admin จัดการ
  const adminMenu = [
    { title: "📚 จัดการหลักสูตร", path: "/admin/courses", description: "เพิ่ม / ลบ / แก้ไขหลักสูตรที่เปิดสอน" },
    { title: "📝 จัดการบทความ", path: "/admin/articles", description: "เขียนและจัดการบทความการเรียนรู้" },
    { title: "🧩 จัดการแบบฝึกหัด", path: "/admin/exercises", description: "สร้างและแก้ไขแบบฝึกหัดสำหรับนักเรียน" },
    { title: "🎥 จัดการวิดีโอ", path: "/admin/videos", description: "อัปโหลดและแก้ไขวิดีโอการเรียนรู้" }, // ✅ เพิ่มเมนูวิดีโอ
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800">🔥 Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">จัดการเนื้อหาสำหรับแพลตฟอร์มการเรียนรู้</p>

        {/* Grid ของเมนูแอดมิน */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {adminMenu.map((menu, index) => (
            <div
              key={index}
              className="p-6 border rounded-xl shadow-md bg-white hover:bg-blue-500 hover:text-white transition transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(menu.path)}
            >
              <h3 className="text-lg font-semibold">{menu.title}</h3>
              <p className="text-sm mt-2">{menu.description}</p>
            </div>
          ))}
        </div>

        {/* ปุ่มกลับไปหน้า Home */}
        <button
          className="mt-8 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
          onClick={() => navigate("/")}
        >
          กลับหน้าแรก
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;