import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ ไม่สามารถดึงข้อมูลบทความได้:", error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {loading ? (
        <p className="text-blue-500 text-lg">⏳ กำลังโหลด...</p>
      ) : article ? (
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-blue-700">{article.title}</h1>
          <p className="mt-4 text-gray-700 text-lg">{article.content}</p>
          <hr className="my-6 border-gray-300" />
          <p className="mt-4 text-gray-900 text-md whitespace-pre-line">
            {article.contentDetail}
          </p>
          <button
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-700 transition"
            onClick={() => navigate("/articles")}
          >
            🔙 กลับไปบทความทั้งหมด
          </button>
        </div>
      ) : (
        <p className="text-red-500 text-lg">❌ ไม่พบข้อมูลบทความ</p>
      )}
    </div>
  );
};

export default ArticleDetail;