import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Ace Your Next Interview with <span>AI</span></h1>
                    <p>
                        AiPrep generates personalized interview questions for any job role
                        and gives you instant AI-powered feedback on your answers.
                    </p>
                    <div className="hero-buttons">
                        {user ? (
                            <Link to="/interview" className="btn btn-primary hero-btn">
                                Start Interview
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary hero-btn">
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="btn btn-outline hero-btn">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="hero-image">🤖</div>
            </section>

            <section className="features">
                <h2>Why AiPrep?</h2>
                <div className="features-grid">
                    <div className="feature-card card">
                        <div className="feature-icon">🎯</div>
                        <h3>Role-Specific Questions</h3>
                        <p>AI generates tailored questions based on your target job role</p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">⚡</div>
                        <h3>Instant AI Feedback</h3>
                        <p>Get detailed feedback and score on every answer instantly</p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>Save all your interviews and track improvement over time</p>
                    </div>
                    <div className="feature-card card">
                        <div className="feature-icon">💡</div>
                        <h3>Ideal Answers</h3>
                        <p>Learn from AI-generated ideal answers for every question</p>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-num">1</div>
                        <h3>Enter Job Role</h3>
                        <p>Tell us what role you're preparing for</p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step">
                        <div className="step-num">2</div>
                        <h3>AI Generates Questions</h3>
                        <p>Get 5 tailored interview questions instantly</p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step">
                        <div className="step-num">3</div>
                        <h3>Answer & Get Feedback</h3>
                        <p>Receive score and detailed feedback from AI</p>
                    </div>
                </div>
            </section>
        </div>
    );
}