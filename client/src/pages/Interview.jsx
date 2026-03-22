import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./Interview.css";

export default function Interview() {
    const [jobRole, setJobRole] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [evaluations, setEvaluations] = useState({});
    const [step, setStep] = useState("setup");
    const [loading, setLoading] = useState(false);
    const [evalLoading, setEvalLoading] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const generateQuestions = async () => {
        if (!jobRole.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await API.post("/ai/generate-questions", { jobRole });
            setQuestions(res.data.questions);
            setStep("interview");
        } catch (err) {
            setError("Failed to generate questions. Try again!", err);
        } finally {
            setLoading(false);
        }
    };

    const evaluateAnswer = async (index) => {
        if (!answers[index]?.trim()) return;
        setEvalLoading(prev => ({ ...prev, [index]: true }));
        try {
            const res = await API.post("/ai/evaluate-answer", {
                question: questions[index].question,
                answer: answers[index],
                jobRole,
            });
            setEvaluations(prev => ({ ...prev, [index]: res.data }));
        } catch (err) {
            setError("Evaluation failed. Try again!",err);
        } finally {
            setEvalLoading(prev => ({ ...prev, [index]: false }));
        }
    };

    const finishInterview = async () => {
        setLoading(true);
        try {
            const finalQuestions = questions.map((q, i) => ({
                question: q.question,
                userAnswer: answers[i] || "",
                aiFeedback: evaluations[i]?.feedback || "",
                score: evaluations[i]?.score || 0,
            }));

            const res = await API.post("/interview/save", {
                jobRole,
                questions: finalQuestions,
            });

            navigate("/results", {
                state: {
                    interview: res.data.interview,
                    evaluations,
                    jobRole,
                }
            });
        } catch (err) {
            setError("Failed to save interview!", err);
        } finally {
            setLoading(false);
        }
    };

    const allEvaluated = questions.length > 0 &&
        questions.every((_, i) => evaluations[i]);

    return (
        <div className="interview-page">

            {step === "setup" && (
                <div className="setup-container">
                    <div className="setup-card card">
                        <h2>Start Your Interview 🎯</h2>
                        <p>Enter the job role you want to practice for</p>

                        {error && <div className="error-msg">{error}</div>}

                        <div className="setup-input-group">
                            <input
                                className="input"
                                type="text"
                                placeholder="e.g. React Developer, Data Scientist, Product Manager..."
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && generateQuestions()}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={generateQuestions}
                                disabled={loading || !jobRole.trim()}
                            >
                                {loading ? (
                                    <span className="btn-loading">
                                        <span className="spinner-sm"/>
                                        Generating...
                                    </span>
                                ) : "Generate Questions ✨"}
                            </button>
                        </div>

                        <div className="popular-roles">
                            <p>Popular roles:</p>
                            <div className="role-tags">
                                {["React Developer", "Node.js Developer",
                                  "Full Stack Developer", "Data Scientist",
                                  "Product Manager"].map(role => (
                                    <span
                                        key={role}
                                        className="role-tag"
                                        onClick={() => setJobRole(role)}
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === "interview" && (
                <div className="questions-container">
                    <div className="interview-header">
                        <h2>Interview: {jobRole} 💼</h2>
                        <p>Answer all questions and click evaluate to get AI feedback</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <div className="questions-list">
                        {questions.map((q, index) => (
                            <div key={index} className="question-card card">
                                <div className="question-header">
                                    <span className="question-num">Q{index + 1}</span>
                                    {evaluations[index] && (
                                        <span className={`badge ${
                                            evaluations[index].score >= 7
                                                ? "badge-success"
                                                : evaluations[index].score >= 4
                                                    ? "badge-warning"
                                                    : "badge-danger"
                                        }`}>
                                            Score: {evaluations[index].score}/10
                                        </span>
                                    )}
                                </div>

                                <p className="question-text">{q.question}</p>

                                <textarea
                                    className="input answer-input"
                                    placeholder="Type your answer here..."
                                    value={answers[index] || ""}
                                    onChange={(e) => setAnswers(prev => ({
                                        ...prev,
                                        [index]: e.target.value
                                    }))}
                                    rows={4}
                                    disabled={!!evaluations[index]}
                                />

                                {!evaluations[index] ? (
                                    <button
                                        className="btn btn-primary eval-btn"
                                        onClick={() => evaluateAnswer(index)}
                                        disabled={
                                            evalLoading[index] ||
                                            !answers[index]?.trim()
                                        }
                                    >
                                        {evalLoading[index]
                                            ? "Evaluating..."
                                            : "Evaluate Answer 🤖"}
                                    </button>
                                ) : (
                                    <div className="feedback-box">
                                        <div className="feedback-section">
                                            <h4>AI Feedback</h4>
                                            <p>{evaluations[index].feedback}</p>
                                        </div>
                                        <div className="feedback-section ideal">
                                            <h4>Ideal Answer</h4>
                                            <p>{evaluations[index].idealAnswer}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {allEvaluated && (
                        <div className="finish-container">
                            <button
                                className="btn btn-primary finish-btn"
                                onClick={finishInterview}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "View Results 📊"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}