import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Results.css";

export default function Results() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        navigate("/interview");
        return null;
    }

    const { interview } = state;
    const totalScore = interview.questions.reduce(
        (sum, q) => sum + q.score, 0
    );
    const maxScore = interview.questions.length * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);

    const getGrade = (pct) => {
        if (pct >= 80) return { grade: "Excellent!", color: "#2ecc71", emoji: "🏆" };
        if (pct >= 60) return { grade: "Good Job!", color: "#f39c12", emoji: "👍" };
        return { grade: "Keep Practicing!", color: "#e74c3c", emoji: "💪" };
    };

    const { grade, color, emoji } = getGrade(percentage);

    return (
        <div className="results-page">
            <div className="results-container">

                <div className="score-card card">
                    <div className="score-emoji">{emoji}</div>
                    <h2>{grade}</h2>
                    <p className="job-role">{interview.jobRole}</p>

                    <div className="score-circle" style={{ "--color": color }}>
                        <span className="score-pct">{percentage}%</span>
                        <span className="score-label">Score</span>
                    </div>

                    <p className="score-detail">
                        {totalScore} / {maxScore} points
                    </p>

                    <div className="result-actions">
                        <Link to="/interview" className="btn btn-primary">
                            New Interview
                        </Link>
                        <Link to="/history" className="btn btn-outline">
                            View History
                        </Link>
                    </div>
                </div>

                <div className="review-section">
                    <h3>Question Review</h3>
                    <div className="review-list">
                        {interview.questions.map((q, i) => (
                            <div key={i} className="review-card card">
                                <div className="review-header">
                                    <span className="question-num">Q{i + 1}</span>
                                    <span className={`badge ${
                                        q.score >= 7 ? "badge-success"
                                        : q.score >= 4 ? "badge-warning"
                                        : "badge-danger"
                                    }`}>
                                        {q.score}/10
                                    </span>
                                </div>
                                <p className="review-question">{q.question}</p>
                                <div className="review-answer">
                                    <h5>Your Answer</h5>
                                    <p>{q.userAnswer || "No answer provided"}</p>
                                </div>
                                {q.aiFeedback && (
                                    <div className="review-feedback">
                                        <h5>AI Feedback</h5>
                                        <p>{q.aiFeedback}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}