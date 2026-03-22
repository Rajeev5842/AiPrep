const express = require("express");
const router = express.Router();
const Interview = require("../models/Interview");
const authMiddleware = require("../middleware/auth");

router.post("/save", authMiddleware, async (req, res) => {
    try {
        const { jobRole, questions } = req.body;

        const interview = await Interview.create({
            userId: req.user.id,
            jobRole,
            questions,
            totalScore: questions.reduce((sum, q) => sum + (q.score || 0), 0),
            completed: true,
        });

        res.status(201).json({
            message: "Interview saved!",
            interview,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message });
    }
});

router.get("/history", authMiddleware, async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json({ interviews });

    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found!" });
        }

        res.json({ interview });

    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Interview.findByIdAndDelete(req.params.id);
        res.json({ message: "Interview deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Server error!", error: error.message });
    }
});

module.exports = router;



