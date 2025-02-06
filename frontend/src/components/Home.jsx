import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // 📌 โหลดข้อมูลจาก LocalStorage เมื่อหน้าเว็บโหลด
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedUsername) {
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  // 📌 อัปเดตข้อมูลหลังจากล็อกอินสำเร็จ
  const handleLoginSuccess = (username, role) => {
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    setUsername(username);
    setRole(role);
    setShowLogin(false);

    navigate("/"); // ✅ กลับไปหน้า Home แล้วให้แสดงปุ่ม Admin
  };

  // 📌 ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUsername(null);
    setRole(null);
    navigate("/"); // กลับไปหน้า Home หลัง Logout
  };

  // 📌 ฟังก์ชันเปลี่ยนหน้า พร้อมเช็คว่าล็อกอินแล้วหรือไม่
  const handleNavigation = (path) => {
    if (!username) {
      setShowLogin(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <h1 className="text-lg font-bold text-blue-400 tracking-wide">
          React & Node.js Learning Hub
        </h1>
        <ul className="flex space-x-6 text-white text-md">
          {[
            { name: "หน้าแรก", path: "/" },
            { name: "หลักสูตร", path: "/courses" },
            { name: "บทความ", path: "/articles" },
            { name: "แบบฝึกหัด", path: "/exercises" },
          ].map((item, index) => (
            <li key={index} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className="hover:text-blue-400 transition duration-300"
              >
                {item.name}
              </button>
              <div className="absolute w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </li>
          ))}
          <li className="relative group">
            <button
              onClick={() => setShowContact(true)}
              className="hover:text-blue-400 transition duration-300"
            >
              ติดต่อเรา
            </button>
            <div className="absolute w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </li>
        </ul>
        <div className="flex space-x-4">
          {username ? (
            <>
              {/* ✅ ปุ่มนี้จะแสดงเฉพาะ Admin */}
              {role === "admin" && (
                <button
                  className="px-4 py-2 border border-yellow-500 rounded-full text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300"
                  onClick={() => navigate("/admin")}
                >
                  🛠 Admin Dashboard
                </button>
              )}
              <span className="text-white text-md font-semibold px-4 py-2 hover:bg-blue-500 rounded-lg">
                {username}
              </span>
              <button
                className="px-4 py-2 border border-red-500 rounded-full text-white hover:bg-red-500 transition-all duration-300"
                onClick={handleLogout}
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 border border-white rounded-full text-white hover:bg-white hover:text-gray-800 transition-all duration-300"
                onClick={() => setShowLogin(true)}
              >
                เข้าสู่ระบบ
              </button>
              <button
                className="px-4 py-2 border border-white rounded-full text-white hover:bg-white hover:text-gray-800 transition-all duration-300"
                onClick={() => setShowRegister(true)}
              >
                สมัครเรียน
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center text-white px-6 lg:px-16">
        <div className="bg-gray-200 bg-opacity-70 p-8 lg:p-12 rounded-xl shadow-xl max-w-4xl w-full">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            เรียนรู้ <span className="text-blue-600">React</span> และ{" "}
            <span className="text-green-600">Node.js</span> กับเรา!
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            คอร์สเรียนตั้งแต่พื้นฐานจนถึงขั้นสูง เพื่อให้คุณเป็นนักพัฒนาเว็บมืออาชีพ
          </p>
          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <button
              className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              onClick={() => handleNavigation("/videos")}
            >
              📚 เริ่มเรียน
            </button>
            <button
              className="px-6 py-3 bg-white text-gray-900 text-lg font-medium rounded-lg shadow-md hover:bg-gray-300 transition duration-300 transform hover:scale-105"
              onClick={() => handleNavigation("/courses")}
            >
              🔍 ดูรายละเอียดหลักสูตร
            </button>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="absolute bottom-6 flex space-x-6 text-white text-2xl z-10">
        {["facebook", "twitter", "instagram", "youtube"].map((platform, index) => (
          <a
            key={index}
            href="#"
            className="hover:text-blue-400 transition duration-300 transform hover:scale-110"
          >
            <i className={`fab fa-${platform}`}></i>
          </a>
        ))}
      </div>

       {/* Contact Us Modal ✅ */}
       {showContact && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800">📞 ติดต่อเรา</h2>
            <p className="mt-2 text-gray-600">สอบถามข้อมูลเพิ่มเติมเกี่ยวกับคอร์สเรียนและบริการของเรา</p>
            <div className="mt-4 text-left">
              <p><strong>📍 ที่อยู่:</strong> 123 ถนนหลัก, กรุงเทพฯ, ประเทศไทย</p>
              <p><strong>📞 โทร:</strong> 099-123-4567</p>
              <p><strong>📧 อีเมล:</strong> support@learninghub.com</p>
              <p><strong>🌐 เว็บไซต์:</strong> www.learninghub.com</p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() => setShowContact(false)}
            >
              ❌ ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* ใช้งาน Login และ Register Modal */}
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />
      <Register isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
};

export default Home;