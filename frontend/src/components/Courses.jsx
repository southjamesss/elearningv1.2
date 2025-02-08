import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/courses");
        if (!response.ok) throw new Error("❌ ไม่สามารถดึงข้อมูลหลักสูตรได้");

        const data = await response.json();
        console.log("📥 ได้รับข้อมูลหลักสูตรจาก API:", data);
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center from-blue-400 to-purple-500 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-5xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">🎓 หลักสูตรที่เปิดสอน</h1>
        <p className="mt-4 text-gray-600 text-lg">
          เลือกหลักสูตรที่คุณสนใจและเริ่มต้นเรียนรู้ได้เลย!
        </p>

        {loading && <p className="text-blue-500 mt-4">⏳ กำลังโหลดหลักสูตร...</p>}
        {error && <p className="text-red-500 mt-4">❌ {error}</p>}

        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="p-6 border rounded-xl shadow-lg bg-white hover:bg-blue-500 hover:text-white transition transform hover:scale-105 cursor-pointer"
                >
                  <h3 className="text-lg font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-700 mt-2">{course.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">ไม่มีหลักสูตรที่เปิดสอนในขณะนี้</p>
            )}
          </div>
        )}

        <button
          className="mt-8 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
};

export default Courses;