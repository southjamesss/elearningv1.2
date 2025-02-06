import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminVideos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: "", url: "", description: "" });
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📌 ดึงข้อมูลวิดีโอเมื่อโหลดหน้า
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/videos");
      if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลวิดีโอได้");
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // 📌 ตรวจสอบ URL ของวิดีโอ
  const isValidURL = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+$/;
    return regex.test(url);
  };

  // 📌 เพิ่มวิดีโอใหม่
  const addVideo = async () => {
    if (!newVideo.title || !newVideo.url || !newVideo.description) {
      setError("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!isValidURL(newVideo.url)) {
      setError("❌ กรุณาใส่ URL ของวิดีโอที่ถูกต้อง (YouTube หรือ Vimeo)");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });
      if (!response.ok) throw new Error("เพิ่มวิดีโอล้มเหลว");
      const data = await response.json();
      setVideos([...videos, data]);
      setNewVideo({ title: "", url: "", description: "" });
      setError("");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // 📌 เริ่มแก้ไขวิดีโอ
  const startEditing = (video) => {
    setEditingVideo(video);
    setNewVideo({ title: video.title, url: video.url, description: video.description });
  };

  // 📌 บันทึกการแก้ไขวิดีโอ
  const updateVideo = async () => {
    if (!newVideo.title || !newVideo.url || !newVideo.description) {
      setError("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!isValidURL(newVideo.url)) {
      setError("❌ กรุณาใส่ URL ของวิดีโอที่ถูกต้อง (YouTube หรือ Vimeo)");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/videos/${editingVideo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });
      if (!response.ok) throw new Error("อัปเดตวิดีโอล้มเหลว");
      const updatedVideo = await response.json();
      setVideos(videos.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)));
      setEditingVideo(null);
      setNewVideo({ title: "", url: "", description: "" });
      setError("");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // 📌 ลบวิดีโอ
  const deleteVideo = async (id) => {
    if (!window.confirm("คุณต้องการลบวิดีโอนี้หรือไม่?")) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/videos/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("ลบวิดีโอล้มเหลว");
      setVideos(videos.filter((video) => video.id !== id));
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center relative">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🎥 จัดการวิดีโอ</h1>

      {/* ปุ่มย้อนกลับ */}
      <button
        className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-700 transition"
        onClick={() => navigate("/admin")}
      >
        กลับไปหน้า Admin
      </button>

      {/* แสดงข้อผิดพลาด */}
      {error && <p className="text-red-500">{error}</p>}

      {/* แบบฟอร์มเพิ่ม/แก้ไขวิดีโอ */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{editingVideo ? "✏️ แก้ไขวิดีโอ" : "➕ เพิ่มวิดีโอ"}</h2>
        <input
          type="text"
          value={newVideo.title}
          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
          placeholder="ชื่อวิดีโอ"
          className="p-2 border rounded-lg w-full mb-3"
        />
        <input
          type="text"
          value={newVideo.url}
          onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
          placeholder="URL ของวิดีโอ"
          className="p-2 border rounded-lg w-full mb-3"
        />
        <textarea
          value={newVideo.description}
          onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
          placeholder="คำอธิบายเกี่ยวกับวิดีโอ"
          className="p-2 border rounded-lg w-full mb-3"
          rows="3"
        />
        {editingVideo ? (
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full" onClick={updateVideo}>
            ✔️ อัปเดต
          </button>
        ) : (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full" onClick={addVideo}>
            ➕ เพิ่ม
          </button>
        )}
      </div>

      {/* รายการวิดีโอ */}
      <div className="mt-6 w-full max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-800">📚 รายการวิดีโอ</h2>
        {videos.map((video) => (
          <div key={video.id} className="p-4 bg-white shadow-md rounded-lg mt-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{video.title}</h3>
              <p className="text-sm text-gray-600">{video.description}</p>
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                ดูวิดีโอ
              </a>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" onClick={() => startEditing(video)}>
                ✏️ แก้ไข
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => deleteVideo(video.id)}>
                ❌ ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVideos;