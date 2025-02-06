import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Videos = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    // 📌 ดึงข้อมูลวิดีโอจาก API
    useEffect(() => {
        fetch("http://localhost:4000/api/videos")
            .then((res) => res.json())
            .then((data) => {
                setVideos(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("❌ ไม่สามารถดึงข้อมูลวิดีโอได้:", error);
                setLoading(false);
            });
    }, []);

    // 📌 ฟังก์ชันแปลง URL เป็น Embed สำหรับ YouTube
    const getEmbedUrl = (url) => {
        if (url.includes("watch?v=")) {
            return url.replace("watch?v=", "embed/");
        } else if (url.includes("youtu.be/")) {
            return url.replace("youtu.be/", "youtube.com/embed/");
        }
        return url;
    };

    return (
        <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center relative">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">🎥 วิดีโอการเรียนรู้</h1>

            {/* ปุ่มย้อนกลับ */}
            <button
                className="absolute top-5 right-5 px-6 py-3 border-2 border-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-500"
                onClick={() => navigate("/")}
            >
                กลับหน้าแรก
            </button>

            {loading ? (
                <p className="text-blue-500 text-lg">⏳ กำลังโหลดวิดีโอ...</p>
            ) : videos.length === 0 ? (
                <p className="text-gray-600 text-lg">🚫 ยังไม่มีวิดีโอ</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {videos.map((video) => (
                        <div key={video.id} className="bg-white p-4 shadow-lg rounded-lg">
                            <h3 className="text-lg font-semibold">{video.title}</h3>
                            <p className="text-sm text-gray-600">{video.description}</p>
                            <iframe
                                className="w-full mt-3 rounded-lg"
                                height="200"
                                src={getEmbedUrl(video.url)}
                                title={video.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Videos;