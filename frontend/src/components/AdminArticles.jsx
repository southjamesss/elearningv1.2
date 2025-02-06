import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newContentDetail, setNewContentDetail] = useState(""); // ✅ เพิ่มช่องเนื้อหาเต็ม
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 ดึงข้อมูลบทความจาก API
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/articles");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลล้มเหลว:", error);
    }
    setLoading(false);
  };

  // 📌 เพิ่มบทความใหม่
  const addArticle = async () => {
    if (newTitle.trim() && newContent.trim() && newContentDetail.trim()) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, content: newContent, contentDetail: newContentDetail }),
        });
        const data = await response.json();
        setArticles([...articles, data]);
        setNewTitle("");
        setNewContent("");
        setNewContentDetail("");
      } catch (error) {
        console.error("❌ เพิ่มบทความล้มเหลว:", error);
      }
      setLoading(false);
    }
  };

  // 📌 ลบบทความ
  const deleteArticle = async (id) => {
    if (!window.confirm("คุณต้องการลบบทความนี้หรือไม่?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:4000/api/articles/${id}`, { method: "DELETE" });
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.error("❌ ลบบทความล้มเหลว:", error);
    }
    setLoading(false);
  };

  // 📌 เริ่มแก้ไขบทความ
  const startEditing = (article) => {
    setEditingArticle(article);
    setNewTitle(article.title);
    setNewContent(article.content);
    setNewContentDetail(article.contentDetail || ""); // ✅ ดึงเนื้อหาเต็ม
  };

  // 📌 อัปเดตบทความ
  const updateArticle = async () => {
    if (editingArticle && newTitle.trim() && newContent.trim() && newContentDetail.trim()) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/api/articles/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, content: newContent, contentDetail: newContentDetail }),
        });
        const updatedArticle = await response.json();
        setArticles(
          articles.map((article) =>
            article.id === updatedArticle.id ? updatedArticle : article
          )
        );
        setEditingArticle(null);
        setNewTitle("");
        setNewContent("");
        setNewContentDetail("");
      } catch (error) {
        console.error("❌ อัปเดตบทความล้มเหลว:", error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📝 จัดการบทความ</h1>

      {/* แสดง Loading */}
      {loading && <p className="text-blue-500">⏳ กำลังโหลด...</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">{editingArticle ? "✏️ แก้ไขบทความ" : "➕ เพิ่มบทความ"}</h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="ชื่อบทความ"
          className="p-3 border rounded-lg w-full"
        />
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="เนื้อหาบทความ (สั้น)"
          className="p-3 border rounded-lg w-full mt-3"
          rows="3"
        />
        <textarea
          value={newContentDetail}
          onChange={(e) => setNewContentDetail(e.target.value)}
          placeholder="เนื้อหาบทความ (เต็ม)"
          className="p-3 border rounded-lg w-full mt-3"
          rows="5"
        />
        <div className="flex gap-3 mt-3">
          {editingArticle ? (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex-1" onClick={updateArticle}>
              ✔️ อัปเดต
            </button>
          ) : (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1" onClick={addArticle}>
              ➕ เพิ่ม
            </button>
          )}
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={() => { setNewTitle(""); setNewContent(""); setNewContentDetail(""); }}>
            🗑️ ล้าง
          </button>
        </div>
      </div>

      {/* รายการบทความ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mt-6">
        {articles.map((article) => (
          <div key={article.id} className="p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition transform hover:scale-105">
            <h2 className="text-lg font-bold text-gray-800">{article.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{article.content}</p>
            <div className="flex justify-between mt-4">
              <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" onClick={() => startEditing(article)}>
                ✏️ แก้ไข
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => deleteArticle(article.id)}>
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

export default AdminArticles;