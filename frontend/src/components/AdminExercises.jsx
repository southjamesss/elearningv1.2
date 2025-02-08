import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminExercises = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [newExercise, setNewExercise] = useState({
        title: "",
        description: "",
        questions: [
            { questionText: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "a" },
        ],
    });
    const [editingExercise, setEditingExercise] = useState(null);
    const [loading, setLoading] = useState(false);

    // 📌 ดึงข้อมูลแบบฝึกหัดจาก API
    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/api/exercises");
            const data = await response.json();

            // ✅ แปลง options จาก JSON string เป็น Object
            const formattedData = data.map(ex => ({
                ...ex,
                questions: ex.questions.map(q => ({
                    ...q,
                    options: JSON.parse(q.options), // ✅ แปลงกลับจาก JSON
                })),
            }));

            setExercises(formattedData);
        } catch (error) {
            console.error("❌ ดึงข้อมูลล้มเหลว:", error);
        }
        setLoading(false);
    };

    // 📌 เพิ่มหรืออัปเดตแบบฝึกหัด
    const saveExercise = async () => {
        if (!newExercise.title.trim() || !newExercise.description.trim()) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
    
        setLoading(true);
        try {
            const formattedExercise = {
                ...newExercise,
                questions: newExercise.questions.map(q => ({
                    questionText: q.questionText.trim() || "No Question", // ✅ ป้องกัน `null`
                    options: JSON.stringify(q.options || {}), // ✅ ป้องกัน `null`
                    correctAnswer: q.correctAnswer.trim() || "a", // ✅ ป้องกัน `null`
                })),
            };
    
            console.log("📡 กำลังส่งข้อมูลไป Backend:", formattedExercise); // ✅ Debugging
    
            let response;
            if (editingExercise) {
                response = await fetch(`http://localhost:4000/api/exercises/${editingExercise.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formattedExercise),
                });
            } else {
                response = await fetch("http://localhost:4000/api/exercises", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formattedExercise),
                });
            }
    
            if (!response.ok) {
                throw new Error(`เกิดข้อผิดพลาด HTTP ${response.status}`);
            }
    
            const responseData = await response.json();
            console.log("📥 ตอบกลับจาก API:", responseData);
    
            await fetchExercises();
            resetForm();  // ✅ รีเซ็ตฟอร์มหลังจากบันทึกเสร็จ
        } catch (error) {
            console.error("❌ ไม่สามารถบันทึกแบบฝึกหัดได้:", error);
            alert(`❌ บันทึกไม่สำเร็จ: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // ✅ ฟังก์ชัน Reset Form
    const resetForm = () => {
        setNewExercise({
            title: "",
            description: "",
            questions: [
                { questionText: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "a" },
            ],
        });
        setEditingExercise(null);
    };


    // 📌 ลบแบบฝึกหัด
    const deleteExercise = async (id) => {
        if (!window.confirm("คุณต้องการลบแบบฝึกหัดนี้หรือไม่?")) return;
        setLoading(true);
        try {
            await fetch(`http://localhost:4000/api/exercises/${id}`, { method: "DELETE" });
            setExercises(exercises.filter((exercise) => exercise.id !== id));
        } catch (error) {
            console.error("❌ ลบแบบฝึกหัดล้มเหลว:", error);
        }
        setLoading(false);
    };

    // 📌 เริ่มแก้ไขแบบฝึกหัด
    const startEditing = (exercise) => {
        setNewExercise({
            ...exercise,
            questions: exercise.questions.map(q => ({
                ...q,
                options: typeof q.options === "string" ? JSON.parse(q.options) : q.options || {}, // ✅ ตรวจสอบก่อน parse
            })),
        });
        setEditingExercise(exercise);
    };

    // 📌 เพิ่มข้อสอบใหม่
    const addNewQuestion = () => {
        setNewExercise({
            ...newExercise,
            questions: [
                ...newExercise.questions,
                { questionText: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "a" },
            ],
        });
    };

    return (
        <div className="p-10 bg-gray-100 min-h-screen flex flex-row gap-10">
            {/* 📌 ฟอร์มเพิ่ม/แก้ไขแบบฝึกหัด (ซ้ายมือ) */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {editingExercise ? "✏️ แก้ไขแบบฝึกหัด" : "➕ เพิ่มแบบฝึกหัด"}
                </h2>

                {/* 📌 ชื่อแบบฝึกหัด */}
                <input
                    type="text"
                    value={newExercise.title}
                    onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
                    placeholder="ชื่อแบบฝึกหัด"
                    className="p-3 border rounded-lg w-full mb-3 shadow-sm"
                />

                {/* 📌 คำอธิบาย */}
                <textarea
                    value={newExercise.description}
                    onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                    placeholder="คำอธิบาย"
                    className="p-3 border rounded-lg w-full mb-3 shadow-sm"
                    rows="2"
                />

                {/* 📌 ส่วนคำถาม */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">📌 คำถาม</h3>
                {newExercise.questions.map((question, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-gray-50 mb-3">

                        {/* 📌 ข้อคำถาม */}
                        <input
                            type="text"
                            value={question.questionText}
                            onChange={(e) => setNewExercise({
                                ...newExercise,
                                questions: newExercise.questions.map((q, i) =>
                                    i === index ? { ...q, questionText: e.target.value } : q
                                ),
                            })}
                            placeholder={`คำถามที่ ${index + 1}`}
                            className="p-2 border rounded-lg w-full mb-3 shadow-sm"
                        />

                        {/* 📌 ตัวเลือกช้อยส์ */}
                        <h4 className="text-sm font-semibold text-gray-700">🔹 ตัวเลือกคำตอบ</h4>
                        {["a", "b", "c", "d"].map((key) => (
                            <input
                                key={key}
                                type="text"
                                value={question.options[key]}
                                onChange={(e) =>
                                    setNewExercise({
                                        ...newExercise,
                                        questions: newExercise.questions.map((q, i) =>
                                            i === index
                                                ? { ...q, options: { ...q.options, [key]: e.target.value } }
                                                : q
                                        ),
                                    })
                                }
                                placeholder={`ตัวเลือก ${key.toUpperCase()}`}
                                className="p-2 border rounded-lg w-full mt-1 shadow-sm"
                            />
                        ))}

                        {/* 📌 เลือกคำตอบที่ถูกต้อง */}
                        <label className="block mt-3 text-gray-700 font-semibold">
                            ✅ คำตอบที่ถูกต้อง:
                            <select
                                value={question.correctAnswer}
                                onChange={(e) =>
                                    setNewExercise({
                                        ...newExercise,
                                        questions: newExercise.questions.map((q, i) =>
                                            i === index ? { ...q, correctAnswer: e.target.value } : q
                                        ),
                                    })
                                }
                                className="ml-2 border p-2 rounded-lg shadow-sm"
                            >
                                {["a", "b", "c", "d"].map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                ))}

                {/* 📌 ปุ่มเพิ่มคำถาม */}
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full mt-3"
                    onClick={() => setNewExercise({
                        ...newExercise,
                        questions: [...newExercise.questions, { questionText: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "a" }],
                    })}
                >
                    ➕ เพิ่มคำถามใหม่
                </button>

                {/* 📌 ปุ่มบันทึก หรือ อัปเดต */}
                {!loading && ( // ✅ ซ่อนปุ่มขณะกำลังโหลด
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full mt-2"
                        onClick={() => {
                            saveExercise(); // ✅ กดแล้วซ่อนปุ่ม
                        }}
                    >
                        ✔️ {editingExercise ? "อัปเดต" : "บันทึก"}
                    </button>
                )}
            </div>

            {/* 📌 รายการแบบฝึกหัด (ขวามือ) */}
            <div className="w-2/3">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 รายการแบบฝึกหัด</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {exercises.map((exercise) => (
                        <div key={exercise.id} className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition">
                            <h3 className="text-lg font-bold">{exercise.title}</h3>
                            <p className="text-gray-700">{exercise.description}</p>
                            <div className="flex gap-2 mt-4">
                                <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" onClick={() => startEditing(exercise)}>
                                    ✏️ แก้ไข
                                </button>
                                <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => deleteExercise(exercise.id)}>
                                    ❌ ลบ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ปุ่มย้อนกลับ */}
            <button
                className="absolute top-5 right-5 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-700 transition"
                onClick={() => navigate("/admin")}
            >
                กลับไปหน้า Admin
            </button>
        </div>
    );
};

export default AdminExercises;