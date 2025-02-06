import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 ดึงข้อมูลหลักสูตรจาก API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลล้มเหลว:", error);
    }
    setLoading(false);
  };

  // 📌 เพิ่มหลักสูตรใหม่
  const addCourse = async () => {
    if (newCourse.trim() && newContent.trim()) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCourse, content: newContent }),
        });
        const data = await response.json();
        setCourses([...courses, data]);
        setNewCourse("");
        setNewContent("");
      } catch (error) {
        console.error("❌ เพิ่มหลักสูตรล้มเหลว:", error);
      }
      setLoading(false);
    }
  };

  // 📌 ลบหลักสูตร
  const deleteCourse = async (id) => {
    if (!window.confirm("คุณต้องการลบหลักสูตรนี้หรือไม่?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:4000/api/courses/${id}`, { method: "DELETE" });
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("❌ ลบหลักสูตรล้มเหลว:", error);
    }
    setLoading(false);
  };

  // 📌 เริ่มแก้ไขหลักสูตร
  const startEditing = (course) => {
    setEditingCourse(course);
    setNewCourse(course.name);
    setNewContent(course.content);
  };

  // 📌 อัปเดตหลักสูตร
  const updateCourse = async () => {
    if (editingCourse && newCourse.trim() && newContent.trim()) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/api/courses/${editingCourse.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCourse, content: newContent }),
        });
        const updatedCourse = await response.json();
        setCourses(
          courses.map((course) =>
            course.id === updatedCourse.id ? updatedCourse : course
          )
        );
        setEditingCourse(null);
        setNewCourse("");
        setNewContent("");
      } catch (error) {
        console.error("❌ อัปเดตหลักสูตรล้มเหลว:", error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">📚 จัดการหลักสูตร</h1>

      {/* แสดง Loading */}
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
          <div className="flex gap-3">
            {editingCourse ? (
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex-1" onClick={updateCourse}>
                ✔️ อัปเดต
              </button>
            ) : (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1" onClick={addCourse}>
                ➕ เพิ่ม
              </button>
            )}
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={() => { setNewCourse(""); setNewContent(""); }}>
              🗑️ ล้าง
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 w-full max-w-xl my-6"></div>

      {/* รายการหลักสูตร */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {courses.map((course) => (
          <div key={course.id} className="p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition transform hover:scale-105">
            <h2 className="text-lg font-bold text-gray-800">{course.name}</h2>
            <p className="text-sm text-gray-600 mt-2">{course.content}</p>
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