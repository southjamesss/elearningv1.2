const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// 📌 ดึงข้อมูลหลักสูตรทั้งหมด
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    console.error("❌ ดึงข้อมูลหลักสูตรล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถดึงหลักสูตรได้" });
  }
});

// 📌 ดึงข้อมูลหลักสูตรเดี่ยวตาม ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) return res.status(404).json({ error: "❌ ไม่พบหลักสูตร" });

    res.json(course);
  } catch (error) {
    console.error("❌ ดึงข้อมูลหลักสูตรล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถดึงหลักสูตรได้" });
  }
});

// 📌 เพิ่มหลักสูตรใหม่ (รองรับ `details`)
// 📌 เพิ่มหลักสูตรใหม่ (รองรับ `details` และข้อความยาว)
router.post("/", async (req, res) => {
  try {
    console.log("📥 ข้อมูลที่ได้รับจาก Frontend:", req.body);

    const { name, content, details } = req.body;
    if (!name || !content || !details) {
      return res.status(400).json({ error: "❌ กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newCourse = await prisma.course.create({
      data: { name, content, details },
    });

    console.log("✅ เพิ่มหลักสูตรใหม่สำเร็จ:", newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("❌ เพิ่มหลักสูตรล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถเพิ่มหลักสูตรได้" });
  }
});

// 📌 อัปเดตหลักสูตร
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content, details } = req.body;

    if (!name || !content || !details) {
      return res.status(400).json({ error: "❌ กรุณากรอกข้อมูลให้ครบ (name, content, details)" });
    }

    const existingCourse = await prisma.course.findUnique({ where: { id } });
    if (!existingCourse) return res.status(404).json({ error: "❌ ไม่พบหลักสูตรที่ต้องการอัปเดต" });

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { name, content, details },
    });

    console.log("✅ อัปเดตหลักสูตรสำเร็จ:", updatedCourse);
    res.json(updatedCourse);
  } catch (error) {
    console.error("❌ อัปเดตหลักสูตรล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถอัปเดตหลักสูตรได้" });
  }
});

// 📌 ลบหลักสูตร
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingCourse = await prisma.course.findUnique({ where: { id } });
    if (!existingCourse) return res.status(404).json({ error: "❌ ไม่พบหลักสูตรที่ต้องการลบ" });

    await prisma.course.delete({ where: { id } });
    console.log("🗑️ ลบหลักสูตรสำเร็จ ID:", id);
    res.json({ message: "✅ ลบหลักสูตรสำเร็จ" });
  } catch (error) {
    console.error("❌ ลบหลักสูตรล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถลบหลักสูตรได้" });
  }
});



module.exports = router;