import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Courses from "./components/Courses";
import AdminDashboard from "./components/AdminDashboard"; 
import Articles from "./components/Articles"; 
import Exercises from "./components/Exercises"; 
import AdminCourses from "./components/AdminCourses";
import AdminArticles from "./components/AdminArticles";
import AdminExercises from "./components/AdminExercises";
import AdminVideos from "./components/AdminVideos";
import Videos from "./components/Videos";
import ArticleDetail from "./components/ArticleDetail";
import ExerciseDetail from "./components/ExerciseDetail";
import CourseDetail from "./components/CourseDetail";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/articles" element={<Articles />} /> 
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/articles" element={<AdminArticles />} />
        <Route path="/admin/exercises" element={<AdminExercises />} />
        <Route path="/admin/videos" element={<AdminVideos />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
      </Routes>
    </Router>
  );
}

export default App;