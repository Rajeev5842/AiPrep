const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const authMiddleware = require("../middleware/auth");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.post("/generate-questions", authMiddleware, async (req, res) => {
    try {
        const { jobRole } = req.body;

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical interviewer. Always respond with valid JSON only, no extra text."
                },
                {
                    role: "user",
                    content: `Generate 5 technical interview questions for a ${jobRole} position.
                    Return ONLY this JSON array, nothing else:
                    [
                        {"question": "question text here"},
                        {"question": "question text here"}
                    ]`
                }
            ],
            temperature: 0.7,
        });

        const text = response.choices[0].message.content;
        const cleaned = text.replace(/```json|```/g, "").trim();
        const questions = JSON.parse(cleaned);

        res.json({ questions });

    } catch (error) {
        res.status(500).json({ message: "AI error!", error: error.message });
    }
});

router.post("/evaluate-answer", authMiddleware, async (req, res) => {
    try {
        const { question, answer, jobRole } = req.body;

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical interviewer. Always respond with valid JSON only, no extra text."
                },
                {
                    role: "user",
                    content: `You are an expert interviewer for ${jobRole} position.
                    Question: ${question}
                    Candidate's Answer: ${answer}
                    
                    Evaluate and return ONLY this JSON object, nothing else:
                    {
                        "score": <number 0-10>,
                        "feedback": "<2-3 lines of constructive feedback>",
                        "idealAnswer": "<brief ideal answer in 2-3 lines>"
                    }`
                }
            ],
            temperature: 0.7,
        });

        const text = response.choices[0].message.content;
        const cleaned = text.replace(/```json|```/g, "").trim();
        const evaluation = JSON.parse(cleaned);

        res.json(evaluation);

    } catch (error) {
        res.status(500).json({ message: "AI error!", error: error.message });
    }
});

module.exports = router;