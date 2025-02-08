const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// 📌 GET /api/exercises - ดึงข้อมูลแบบฝึกหัดทั้งหมด
router.get("/", async (req, res) => {
    try {
        const exercises = await prisma.exercise.findMany({
            include: { questions: true },
        });

        const formattedExercises = exercises.map(ex => ({
            ...ex,
            questions: ex.questions.map(q => ({
                ...q,
                options: q.options ? JSON.parse(q.options) : {}, // ✅ ป้องกัน `null`
            })),
        }));

        res.json(formattedExercises);
    } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลแบบฝึกหัดได้:", error);
        res.status(500).json({ error: "❌ ไม่สามารถดึงข้อมูลแบบฝึกหัดได้" });
    }
});

// 📌 GET /api/exercises/:id - ดึงข้อมูลแบบฝึกหัดตาม ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const exercise = await prisma.exercise.findUnique({
            where: { id: String(id) },
            include: { questions: true },
        });

        if (!exercise) {
            return res.status(404).json({ error: "❌ ไม่พบแบบฝึกหัดนี้" });
        }

        const formattedExercise = {
            ...exercise,
            questions: exercise.questions.map(q => ({
                ...q,
                options: q.options ? JSON.parse(q.options) : {}, // ✅ ป้องกัน `null`
            })),
        };

        res.json(formattedExercise);
    } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลแบบฝึกหัดได้:", error);
        res.status(500).json({ error: "❌ ไม่สามารถดึงข้อมูลแบบฝึกหัดได้" });
    }
});

// 📌 POST /api/exercises - เพิ่มแบบฝึกหัดใหม่
router.post("/", async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        if (!title || !description || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: "❌ กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        const newExercise = await prisma.exercise.create({
            data: {
                title,
                description,
                questions: {
                    create: questions.map(q => ({
                        questionText: q.questionText.trim(),
                        options: JSON.stringify(q.options || {}), // ✅ แปลง JSON string
                        correctAnswer: q.correctAnswer.trim(),
                    })),
                },
            },
            include: { questions: true },
        });

        res.status(201).json(newExercise);
    } catch (error) {
        console.error("❌ ไม่สามารถเพิ่มแบบฝึกหัดได้:", error);
        res.status(500).json({ error: "❌ ไม่สามารถเพิ่มแบบฝึกหัดได้" });
    }
});

// 📌 PUT /api/exercises/:id - แก้ไขแบบฝึกหัด
router.put("/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { title, description, questions } = req.body;

      console.log("📡 ข้อมูลที่ได้รับจาก Frontend:", req.body); // ✅ Debugging

      if (!title || !description || !questions || !Array.isArray(questions)) {
          return res.status(400).json({ error: "❌ กรุณากรอกข้อมูลให้ครบถ้วน" });
      }

      const existingExercise = await prisma.exercise.findUnique({
          where: { id: String(id) },
      });

      if (!existingExercise) {
          return res.status(404).json({ error: "❌ ไม่พบแบบฝึกหัดที่จะอัปเดต" });
      }

      // ✅ ลบคำถามเก่าก่อน
      await prisma.question.deleteMany({ where: { exerciseId: id } });

      // ✅ อัปเดตแบบฝึกหัดใหม่
      const updatedExercise = await prisma.exercise.update({
          where: { id: String(id) },
          data: {
              title,
              description,
              questions: {
                  create: questions.map((q) => ({
                      questionText: q.questionText || "No Question", // ✅ ป้องกัน `null`
                      options: JSON.stringify(q.options || {}), // ✅ ป้องกัน `null`
                      correctAnswer: q.correctAnswer || "a", // ✅ ป้องกัน `null`
                  })),
              },
          },
          include: { questions: true },
      });

      res.json(updatedExercise);
  } catch (error) {
      console.error("❌ ไม่สามารถแก้ไขแบบฝึกหัดได้:", error);
      res.status(500).json({ error: "❌ ไม่สามารถแก้ไขแบบฝึกหัดได้" });
  }
});

// 📌 DELETE /api/exercises/:id - ลบแบบฝึกหัด
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const existingExercise = await prisma.exercise.findUnique({
            where: { id: String(id) },
        });

        if (!existingExercise) {
            return res.status(404).json({ error: "❌ ไม่พบแบบฝึกหัดที่จะลบ" });
        }

        // ✅ ใช้ Transaction เพื่อลบคำถามและแบบฝึกหัด
        await prisma.$transaction([
            prisma.question.deleteMany({ where: { exerciseId: id } }),
            prisma.exercise.delete({ where: { id: String(id) } }),
        ]);

        res.json({ message: "✅ ลบแบบฝึกหัดสำเร็จ" });
    } catch (error) {
        console.error("❌ ไม่สามารถลบแบบฝึกหัดได้:", error);
        res.status(500).json({ error: "❌ ไม่สามารถลบแบบฝึกหัดได้" });
    }
});

module.exports = router;