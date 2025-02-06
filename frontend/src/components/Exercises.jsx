import React from "react";
import { useNavigate } from "react-router-dom";

const Exercises = () => {
  const navigate = useNavigate();

  // ข้อมูลตัวอย่างแบบฝึกหัด
  const exercises = [
    {
      id: 1,
      title: "💡 แบบฝึกหัด React.js",
      description: "ทดสอบความเข้าใจเกี่ยวกับ React และการใช้งาน Component",
      path: "/exercises/react",
    },
    {
      id: 2,
      title: "🟢 แบบฝึกหัด Node.js",
      description: "ทดสอบการสร้างเซิร์ฟเวอร์ด้วย Node.js และ Express.js",
      path: "/exercises/node",
    },
    {
      id: 3,
      title: "🚀 แบบฝึกหัด JavaScript",
      description: "ทดสอบพื้นฐานและแนวคิดของ JavaScript (ES6+)",
      path: "/exercises/javascript",
    },
    {
      id: 4,
      title: "🔧 แบบฝึกหัด Redux",
      description: "ฝึกการจัดการ State ด้วย Redux และ Context API",
      path: "/exercises/redux",
    },
    {
      id: 5,
      title: "🖥️ แบบฝึกหัด Full-Stack",
      description: "ฝึกสร้างแอปพลิเคชันที่ใช้ทั้ง Frontend และ Backend",
      path: "/exercises/fullstack",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center from-green-400 to-blue-500 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">📝 แบบฝึกหัด</h1>
        <p className="mt-4 text-gray-600 text-lg">
          ทดสอบความรู้ของคุณกับแบบฝึกหัดในหัวข้อต่าง ๆ!
        </p>

        {/* รายการแบบฝึกหัด */}
        <div className="mt-6 space-y-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-6 border rounded-xl shadow-lg bg-white hover:bg-green-500 hover:text-white transition transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(exercise.path)}
            >
              <h3 className="text-lg font-semibold">{exercise.title}</h3>
              <p className="text-sm mt-2">{exercise.description}</p>
            </div>
          ))}
        </div>

        {/* ปุ่มย้อนกลับ */}
        <button
          className="mt-8 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
          onClick={() => navigate("/")}
        >
          ⬅️ กลับหน้าแรก
        </button>
      </div>
    </div>
  );
};

export default Exercises;