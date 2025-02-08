import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDetails, setNewDetails] = useState(""); // ✅ รองรับเนื้อหาหลักสูตร
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  // 📌 ดึงข้อมูลหลักสูตรจาก API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/courses");
      if (!response.ok) throw new Error("❌ ไม่สามารถดึงข้อมูลหลักสูตรได้");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      alert("❌ ดึงข้อมูลล้มเหลว: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 📌 รีเซ็ตฟอร์ม
  const resetForm = () => {
    setNewCourse("");
    setNewContent("");
    setNewDetails("");
    setEditingCourse(null);
  };

  // 📌 เพิ่มหรืออัปเดตหลักสูตร
  const handleSubmit = async () => {
    if (!newCourse.trim() || !newContent.trim() || !newDetails.trim()) {
      alert("⚠️ กรุณากรอกข้อมูลให้ครบ");
      return;
    }
  
    setLoading(true);
    try {
      const method = editingCourse ? "PUT" : "POST";
      const url = editingCourse
        ? `http://localhost:4000/api/courses/${editingCourse.id}`
        : "http://localhost:4000/api/courses";
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newCourse, 
          content: newContent, 
          details: newDetails  // ✅ ส่งข้อมูล `details`
        }),
      });
  
      if (!response.ok) throw new Error(`❌ ไม่สามารถ${editingCourse ? "อัปเดต" : "เพิ่ม"}หลักสูตรได้`);
      await fetchCourses();
      resetForm();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 📌 ลบหลักสูตร
  const deleteCourse = async (id) => {
    if (!window.confirm("⚠️ คุณต้องการลบหลักสูตรนี้หรือไม่?")) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("❌ ลบหลักสูตรล้มเหลว");
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      alert("❌ ลบหลักสูตรล้มเหลว: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 📌 เริ่มแก้ไขหลักสูตร
  const startEditing = (course) => {
    setEditingCourse(course);
    setNewCourse(course.name);
    setNewContent(course.content);
    setNewDetails(course.details || ""); // ✅ โหลดเนื้อหาที่มีอยู่
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">📚 จัดการหลักสูตร</h1>

      {loading && <p className="text-blue-500">⏳ กำลังโหลด...</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">{editingCourse ? "✏️ แก้ไขหลักสูตร" : "➕ เพิ่มหลักสูตร"}</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            placeholder="ชื่อหลักสูตร"
            className="p-3 border rounded-lg w-full"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="รายละเอียดหลักสูตร"
            className="p-3 border rounded-lg w-full"
            rows="3"
          />
          <textarea
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
            placeholder="เนื้อหาหลักสูตร"
            className="p-3 border rounded-lg w-full"
            rows="5"
          />
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 text-white rounded-lg flex-1 ${
                editingCourse ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleSubmit}
            >
              {editingCourse ? "✔️ อัปเดต" : "➕ เพิ่ม"}
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={resetForm}>
              🗑️ ล้าง
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 w-full max-w-xl my-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {courses.map((course) => (
          <div key={course.id} className="p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition transform hover:scale-105">
            <h2 className="text-lg font-bold text-gray-800">{course.name}</h2>
            <p className="text-sm text-gray-600 mt-2">{course.content}</p>
            <p className="text-sm text-gray-500 mt-2">{course.details}</p> {/* ✅ แสดงเนื้อหา */}
            <div className="flex justify-between mt-4">
              <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" onClick={() => startEditing(course)}>
                ✏️ แก้ไข
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => deleteCourse(course.id)}>
                ❌ ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มย้อนกลับ */}
      <button
        className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-700 transition"
        onClick={() => navigate("/admin")}
      >
        กลับไปหน้า Admin
      </button>
    </div>
  );
};

export default AdminCourses;