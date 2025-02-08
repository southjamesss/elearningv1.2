import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams(); // 📌 ดึง `id` จาก URL
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 📌 ดึงข้อมูลหลักสูตรจาก API
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/courses/${id}`);
        if (!response.ok) throw new Error("❌ ไม่พบข้อมูลหลักสูตร");

        const data = await response.json();
        console.log("📥 ข้อมูลหลักสูตร:", data); // ✅ Debug เช็คข้อมูลที่ได้รับ
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-3xl w-full text-center">
        {loading && <p className="text-blue-500">⏳ กำลังโหลดข้อมูล...</p>}
        {error && <p className="text-red-500">❌ {error}</p>}

        {course && (
          <>
            <h1 className="text-3xl font-bold text-gray-800">{course.name}</h1>
            <p className="text-gray-700 mt-4 text-lg">{course.content}</p>

            {/* ✅ แสดงเนื้อหาหลักสูตร */}
            {course.details ? (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-lg text-left text-gray-700">
                <h2 className="text-xl font-semibold text-gray-800">📖 เนื้อหาหลักสูตร</h2>
                <p className="mt-2 whitespace-pre-line">{course.details}</p>
              </div>
            ) : (
              <p className="text-gray-500 mt-6">🚫 ไม่มีเนื้อหาหลักสูตร</p>
            )}
          </>
        )}

        {/* ปุ่มย้อนกลับ */}
        <button
          className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
          onClick={() => navigate(-1)}
        >
          🔙 กลับไปหน้าเดิม
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;