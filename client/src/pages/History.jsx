import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import "./History.css";

export default function History() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await API.get("/interview/history");
            setInterviews(res.data.interviews);
        } catch (err) {
            console.log("Error fetching history",err);
        } finally {
            setLoading(false);
        }
    };

    const deleteInterview = async (id) => {
        try {
            await API.delete(`/interview/${id}`);
            setInterviews(prev => prev.filter(i => i._id !== id));
        } catch (err) {
            console.log("Error deleting",err);
        }
    };

    const getScoreColor = (score, max) => {
        const pct = (score / max) * 100;
        if (pct >= 80) return "#2ecc71";
        if (pct >= 60) return "#f39c12";
        return "#e74c3c";
    };

    if (loading) return (
        <div className="spinner-wrap">
            <span className="spinner"/>
        </div>
    );

    return (
        <div className="history-page">
            <div className="history-header">
                <h2>Interview History 📚</h2>
                <Link to="/interview" className="btn btn-primary">
                    New Interview
                </Link>
            </div>

            {interviews.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-icon">📭</div>
                    <h3>No interviews yet!</h3>
                    <p>Start your first AI-powered interview now</p>
                    <Link to="/interview" className="btn btn-primary">
                        Start Interview
                    </Link>
                </div>
            ) : (
                <div className="history-grid">
                    {interviews.map((interview) => {
                        const maxScore = interview.questions.length * 10;
                        const pct = Math.round(
                            (interview.totalScore / maxScore) * 100
                        );
                        return (
                            <div key={interview._id} className="history-card card">
                                <div className="history-card-header">
                                    <h3>{interview.jobRole}</h3>
                                    <span
                                        className="history-score"
                                        style={{
                                            color: getScoreColor(
                                                interview.totalScore, maxScore
                                            )
                                        }}
                                    >
                                        {pct}%
                                    </span>
                                </div>
                                <div className="history-meta">
                                    <span>
                                        {interview.questions.length} questions
                                    </span>
                                    <span>
                                        {interview.totalScore}/{maxScore} pts
                                    </span>
                                    <span>
                                        {new Date(interview.createdAt)
                                            .toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="history-bar">
                                    <div
                                        className="history-bar-fill"
                                        style={{
                                            width: `${pct}%`,
                                            background: getScoreColor(
                                                interview.totalScore, maxScore
                                            )
                                        }}
                                    />
                                </div>
                                <button
                                    className="btn btn-danger delete-btn"
                                    onClick={() => deleteInterview(interview._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}