require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const courseRoutes = require("./routes/courseRoutes");
const articleRoutes = require("./routes/articleRoutes");
const exerciseRoutes = require("./routes/exercisesroutes");
const videos = require("./routes/videosRoutes");



const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 📌 ตรวจสอบว่า `JWT_SECRET` ถูกกำหนดค่าแล้ว
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is not defined in .env file!");
  process.exit(1);
}

// 📌 Middleware ตรวจสอบ Token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "❌ ไม่พบ Token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "❌ Token ไม่ถูกต้อง" });
      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาดใน middleware", error });
  }
};

// 📌 Middleware ตรวจสอบสิทธิ์ Admin
const verifyAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "❌ ไม่อนุญาตสำหรับผู้ใช้ทั่วไป" });
  }
  next();
};

// 📌 ฟังก์ชันสร้าง Admin ถ้ายังไม่มีในฐานข้อมูล
const createAdminUser = async () => {
  try {
    const adminEmail = "admin@example.com";
    const adminPassword = "123456"; // 📌 ตั้งค่ารหัสผ่านเริ่มต้น

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          username: "admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        },
      });
      console.log("✅ Admin user created successfully!");
    } else {
      console.log("✅ Admin user already exists!");
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};

// 📌 เรียกใช้งานฟังก์ชันเพื่อสร้าง Admin (ถ้ายังไม่มี)
createAdminUser();

// 📌 API สมัครสมาชิก
app.post("/register", async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  try {
    // ตรวจสอบว่ามี email นี้แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "❌ อีเมลนี้ถูกใช้แล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, role },
    });
    res.status(201).json({ message: "✅ สมัครสมาชิกสำเร็จ", user });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error });
  }
});

// 📌 API เข้าสู่ระบบ
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "❌ ไม่พบผู้ใช้งาน" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "❌ รหัสผ่านไม่ถูกต้อง" });
    }

    console.log("✅ Login Successful:", user.email);

    // 📌 สร้าง JWT Token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "999h" });

    res.json({ message: "✅ เข้าสู่ระบบสำเร็จ", token, role: user.role, username: user.username });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error });
  }
});

// 📌 API ดึงข้อมูลผู้ใช้ที่ล็อกอิน
app.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!user) {                                                                                                                                                                                                                                                                                                                                                                            
      return res.status(404).json({ message: "❌ ไม่พบผู้ใช้" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error });
  }
});

// 📌 API สำหรับ Admin ดูรายการผู้ใช้ทั้งหมด
app.get("/admin/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true },
    });
    res.json(users);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error });
  }
});

// 📌 API สำหรับ Admin ลบผู้ใช้
app.delete("/admin/delete/:id", verifyToken, verifyAdmin, async (req, res) => {
  const userId = Number(req.params.id); // 📌 แปลง id เป็นตัวเลข

  if (isNaN(userId)) {
    return res.status(400).json({ message: "❌ รหัสผู้ใช้ไม่ถูกต้อง" });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: "✅ ลบผู้ใช้สำเร็จ" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาด", error });
  }
});


// 📌 เส้นทางสำหรับหลักสูตร
app.use("/api/courses", courseRoutes);

// 📌 เส้นทาง API สำหรับบทความ
app.use("/api/articles", articleRoutes);

// 📌 เส้นทาง API สำหรับแบบฝึกหัด
app.use("/api/exercises", exerciseRoutes);

// 📌 เส้นทาง API สำหรับวิดีโอ
app.use("/api/videos", videos);

// 📌 เริ่มต้น Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});