const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// 📌 GET /api/videos - ดึงวิดีโอทั้งหมด
router.get("/", async (req, res) => {
  try {
    const videos = await prisma.video.findMany();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "❌ ไม่สามารถดึงข้อมูลวิดีโอได้", details: error.message });
  }
});

// 📌 POST /api/videos - เพิ่มวิดีโอใหม่
router.post("/", async (req, res) => {
  try {
    console.log("📥 ข้อมูลที่ได้รับ:", req.body); // ✅ Debug เช็คค่าที่รับมา

    const { title, url, description } = req.body;
    if (!title || !url || !description) {
      return res.status(400).json({ error: "❌ กรุณากรอกข้อมูลให้ครบ (title, url, description)" });
    }

    const newVideo = await prisma.video.create({
      data: { title, url, description },
    });

    console.log("✅ เพิ่มวิดีโอสำเร็จ:", newVideo);
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("❌ เพิ่มวิดีโอล้มเหลว:", error);
    res.status(500).json({ error: "❌ ไม่สามารถเพิ่มวิดีโอได้" });
  }
});

// 📌 PUT /api/videos/:id - แก้ไขวิดีโอ
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description } = req.body;

    if (!title || !url || !description) {
      return res.status(400).json({ error: "❌ ต้องระบุ title, url และ description" });
    }

    const video = await prisma.video.update({ 
      where: { id },
      data: { title, url, description }
    });

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: "❌ ไม่สามารถแก้ไขวิดีโอได้", details: error.message });
  }
});

// 📌 DELETE /api/videos/:id - ลบวิดีโอ
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.video.delete({ where: { id } });

    res.json({ message: "✅ ลบวิดีโอสำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: "❌ ไม่สามารถลบวิดีโอได้", details: error.message });
  }
});

module.exports = router;