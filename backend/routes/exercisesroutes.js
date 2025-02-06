const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// 📌 GET /api/exercises - ดึงข้อมูลแบบฝึกหัดทั้งหมด
router.get("/", async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany({
      include: { questions: true }, // ดึงคำถามทั้งหมดในแบบฝึกหัด
    });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "❌ ไม่สามารถดึงข้อมูลแบบฝึกหัดได้" });
  }
});

// 📌 GET /api/exercises/:id - ดึงข้อมูลแบบฝึกหัดตาม ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!exercise) {
      return res.status(404).json({ error: "❌ ไม่พบแบบฝึกหัดนี้" });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "❌ ไม่สามารถดึงข้อมูลแบบฝึกหัดได้" });
  }
});

// 📌 POST /api/exercises - เพิ่มแบบฝึกหัดใหม่
router.post("/", async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const newExercise = await prisma.exercise.create({
      data: {
        title,
        description,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
      include: { questions: true },
    });

    res.json(newExercise);
  } catch (error) {
    res.status(500).json({ error: "❌ ไม่สามารถเพิ่มแบบฝึกหัดได้" });
  }
});

// 📌 PUT /api/exercises/:id - แก้ไขแบบฝึกหัด
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;

    // อัปเดตแบบฝึกหัด
    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        title,
        description,
        questions: {
          deleteMany: {}, // ลบคำถามเดิมก่อน
          create: questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
      include: { questions: true },
    });

    res.json(updatedExercise);
  } catch (error) {
    res.status(500).json({ error: "❌ ไม่สามารถแก้ไขแบบฝึกหัดได้" });
  }
});

// 📌 DELETE /api/exercises/:id - ลบแบบฝึกหัด
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.exercise.delete({ where: { id } });
    res.json({ message: "✅ ลบแบบฝึกหัดสำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: "❌ ไม่สามารถลบแบบฝึกหัดได้" });
  }
});

module.exports = router;