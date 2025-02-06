import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Articles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📌 ดึงข้อมูลบทความจาก API
  useEffect(() => {
    fetch("http://localhost:4000/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ ไม่สามารถดึงข้อมูลบทความได้:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">📚 บทความล่าสุด</h1>
        <p className="mt-4 text-gray-600 text-lg">
          เรียนรู้เทคนิคใหม่ ๆ ในการพัฒนาเว็บและเทคโนโลยีที่น่าสนใจ!
        </p>

        {/* แสดงสถานะโหลด */}
        {loading ? (
          <p className="text-blue-500 text-lg">⏳ กำลังโหลด...</p>
        ) : articles.length === 0 ? (
          <p className="text-red-500 text-lg">❌ ไม่พบบทความ</p>
        ) : (
          <div className="mt-6 space-y-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-6 border rounded-xl shadow-lg bg-white hover:bg-blue-500 hover:text-white transition transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <p className="text-sm mt-2">{article.content.substring(0, 100)}...</p>
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

export default Articles;