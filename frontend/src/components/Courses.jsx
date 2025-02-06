import React from "react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    { name: "React.js", path: "/courses/react" },
    { name: "Node.js", path: "/courses/node" },
    { name: "Express.js", path: "/courses/express" },
    { name: "MongoDB", path: "/courses/mongodb" },
    { name: "Next.js", path: "/courses/next" },
    { name: "TypeScript", path: "/courses/typescript" },
    { name: "JavaScript ES6+", path: "/courses/javascript" },
    { name: "GraphQL", path: "/courses/graphql" },
    { name: "Redux", path: "/courses/redux" },
    { name: "Tailwind CSS", path: "/courses/tailwind" },
    { name: "Firebase", path: "/courses/firebase" },
    { name: "Docker", path: "/courses/docker" },
    { name: "Kubernetes", path: "/courses/kubernetes" },
    { name: "RESTful API", path: "/courses/rest-api" },
    { name: "Web Security", path: "/courses/security" },
    { name: "Testing with Jest", path: "/courses/testing" },
    { name: "AWS for Developers", path: "/courses/aws" },
    { name: "Microservices Architecture", path: "/courses/microservices" },
    { name: "Serverless with AWS Lambda", path: "/courses/serverless" },
    { name: "Full-Stack Development", path: "/courses/fullstack" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center from-blue-400 to-purple-500 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-5xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">🎓 หลักสูตรที่เปิดสอน</h1>
        <p className="mt-4 text-gray-600 text-lg">
          เลือกหลักสูตรที่คุณสนใจและเริ่มต้นเรียนรู้การพัฒนาเว็บได้เลย!
        </p>

        {/* Grid แสดงหลักสูตร */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              onClick={() => navigate(course.path)}
              className="p-6 border rounded-xl shadow-lg bg-white hover:bg-blue-500 hover:text-white transition transform hover:scale-105 cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{course.name}</h3>
            </div>
          ))}
        </div>

        {/* ปุ่มย้อนกลับ */}
        <button
          className="mt-8 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
};

export default Courses;