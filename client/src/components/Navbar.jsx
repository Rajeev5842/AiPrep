import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                🤖 AiPrep
            </Link>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span className="navbar-user">Hi, {user.name}!</span>
                        <Link to="/interview" className="btn btn-primary">
                            Start Interview
                        </Link>
                        <Link to="/history" className="btn btn-outline">
                            History
                        </Link>
                        <button onClick={handleLogout} className="btn btn-danger">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}