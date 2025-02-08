import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ExerciseDetail = () => {
  const { id } = useParams(); // รับค่า id จาก URL
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({}); // เก็บคำตอบที่เลือก
  const [score, setScore] = useState(null); // เก็บคะแนนที่ตรวจแล้ว

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        console.log("📡 Fetching exercise data for ID:", id);
        const response = await fetch(`http://localhost:4000/api/exercises/${id}`);

        if (!response.ok) {
          throw new Error(`❌ ไม่พบข้อสอบ (Error: ${response.status})`);
        }

        const data = await response.json();
        console.log("📥 ข้อมูลแบบฝึกหัดที่ได้รับ:", data);

        // ✅ แปลง options จาก JSON string เป็น Object
        const formattedExercise = {
          ...data,
          questions: data.questions.map(q => ({
            ...q,
            options: typeof q.options === "string" ? JSON.parse(q.options) : q.options || {},
          })),
        };

        setExercise(formattedExercise);
        setAnswers({}); // เคลียร์คำตอบเมื่อโหลดข้อสอบ
      } catch (err) {
        console.error("❌ Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  // 📌 ฟังก์ชันเปลี่ยนคำตอบของแต่ละข้อ
  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer, // อัปเดตคำตอบของข้อที่เลือก
    });
  };

  // 📌 ฟังก์ชันตรวจสอบคะแนน
  const checkAnswers = () => {
    let correctCount = 0;
    exercise.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount); // เก็บคะแนน
  };

  // 📌 ฟังก์ชันทำข้อสอบใหม่
  const resetQuiz = () => {
    setAnswers({});
    setScore(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-3xl w-full">
        {loading && <p className="text-blue-500 text-lg">⏳ กำลังโหลดข้อสอบ...</p>}
        {error && <p className="text-red-500 text-lg">{error}</p>}

        {!loading && !error && exercise && (
          <>
            <h1 className="text-3xl font-bold text-gray-800">{exercise.title}</h1>
            <p className="mt-4 text-gray-600">{exercise.description}</p>

            {/* ส่วนแสดงคำถาม */}
            <div className="mt-6">
              {exercise.questions && exercise.questions.length > 0 ? (
                <ul className="list-disc list-inside">
                  {exercise.questions.map((question, index) => (
                    <li key={index} className="mt-2 text-gray-700">
                      <strong>ข้อที่ {index + 1}:</strong> {question.questionText}
                      <div className="ml-4 mt-2">
                        {Object.entries(question.options).map(([key, value]) => (
                          <label key={key} className="block">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={key}
                              checked={answers[index] === key}
                              onChange={() => handleAnswerChange(index, key)}
                              className="mr-2"
                            />
                            <strong>{key.toUpperCase()}:</strong> {value}
                          </label>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">ไม่มีคำถามในข้อสอบนี้</p>
              )}
            </div>

            {/* แสดงคะแนนเมื่อกดตรวจข้อสอบ */}
            {score !== null && (
              <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded">
                ✅ คุณได้คะแนน: <strong>{score}</strong> / {exercise.questions.length}
              </div>
            )}

            {/* ปุ่มกดตรวจข้อสอบ */}
            {score === null ? (
              <button
                className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
                onClick={checkAnswers}
              >
                ✅ ตรวจข้อสอบ
              </button>
            ) : (
              // ปุ่มทำข้อสอบใหม่
              <button
                className="mt-6 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition"
                onClick={resetQuiz}
              >
                🔄 ทำข้อสอบใหม่
              </button>
            )}

            {/* ปุ่มย้อนกลับ */}
            <button
              className="mt-4 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
              onClick={() => navigate("/exercises")}
            >
              🔙 กลับไปที่แบบฝึกหัด
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetail;