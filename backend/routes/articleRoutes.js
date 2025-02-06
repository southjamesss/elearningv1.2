const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// 📌 ดึงข้อมูลบทความทั้งหมด
router.get("/", async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res.json(articles);
  } catch (error) {
    console.error("❌ ดึงข้อมูลบทความล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถดึงบทความได้" });
  }
});

// 📌 ดึงข้อมูลบทความเดี่ยว
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return res.status(404).json({ error: "❌ ไม่พบบทความ" });
    }

    res.json(article);
  } catch (error) {
    console.error("❌ ดึงข้อมูลบทความเดี่ยวล้มเหลว:", error);
    res.status(500).json({ error: "❌ เกิดข้อผิดพลาด" });
  }
});

// 📌 เพิ่มบทความใหม่
router.post("/", async (req, res) => {
  try {
    const { title, content, contentDetail } = req.body;
    console.log("📥 ข้อมูลที่ได้รับ:", req.body);

    if (!title || !content || !contentDetail) {
      return res.status(400).json({ error: "❌ กรุณากรอก title, content และ contentDetail" });
    }

    const newArticle = await prisma.article.create({
      data: { title, content, contentDetail },
    });

    console.log("✅ บันทึกบทความใหม่สำเร็จ:", newArticle);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("❌ เพิ่มบทความล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถเพิ่มบทความได้" });
  }
});

// 📌 อัปเดตบทความ
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, contentDetail } = req.body;

    console.log("🔄 กำลังอัปเดตบทความ ID:", id);
    console.log("📥 ข้อมูลใหม่:", req.body);

    if (!title || !content || !contentDetail) {
      return res.status(400).json({ error: "❌ กรุณากรอกข้อมูลให้ครบ (title, content, contentDetail)" });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { title, content, contentDetail },
    });

    console.log("✅ อัปเดตบทความสำเร็จ:", updatedArticle);
    res.json(updatedArticle);
  } catch (error) {
    console.error("❌ อัปเดตบทความล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถอัปเดตบทความได้" });
  }
});

module.exports = router;