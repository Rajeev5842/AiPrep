const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    userAnswer: { type: String, default: "" },
    aiFeedback: { type: String, default: "" },
    score: { type: Number, default: 0 },
});

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobRole: {
        type: String,
        required: true,
    },
    questions: [questionSchema],
    totalScore: {
        type: Number,
        default: 0,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);