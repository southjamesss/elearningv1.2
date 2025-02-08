import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Exercises = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📌 ดึงข้อมูลแบบฝึกหัดจาก API
  useEffect(() => {
    fetch("http://localhost:4000/api/exercises")
      .then((res) => res.json())
      .then((data) => {
        setExercises(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ ไม่สามารถดึงข้อมูลแบบฝึกหัดได้:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center from-green-300 to-blue-400 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">📝 แบบฝึกหัด</h1>
        <p className="mt-4 text-gray-600 text-lg">
          ทดสอบความรู้ของคุณกับแบบฝึกหัดในหัวข้อต่าง ๆ!
        </p>

        {/* แสดงข้อความโหลดข้อมูล */}
        {loading ? (
          <p className="mt-6 text-blue-500 text-lg">⏳ กำลังโหลดแบบฝึกหัด...</p>
        ) : exercises.length === 0 ? (
          <p className="mt-6 text-red-500 text-lg">❌ ไม่มีแบบฝึกหัดที่จะแสดง</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="p-6 border rounded-xl shadow-lg bg-white hover:bg-green-500 hover:text-white transition transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/exercises/${exercise.id}`)}
              >
                <h3 className="text-lg font-semibold">{exercise.title}</h3>
                <p className="text-sm mt-2">{exercise.description}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
                >
                  🏆 เริ่มทำแบบฝึกหัด
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ปุ่มย้อนกลับ */}
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

export default Exercises;