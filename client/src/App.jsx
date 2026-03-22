import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import History from "./pages/History";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="spinner-wrap"><span className="spinner"/></div>;
    return user ? children : <Navigate to="/login"/>;
};

function AppRoutes() {
    const { user } = useAuth();
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>}/>
                <Route path="/register" element={user ? <Navigate to="/"/> : <Register/>}/>
                <Route path="/interview" element={
                    <ProtectedRoute><Interview/></ProtectedRoute>
                }/>
                <Route path="/results" element={
                    <ProtectedRoute><Results/></ProtectedRoute>
                }/>
                <Route path="/history" element={
                    <ProtectedRoute><History/></ProtectedRoute>
                }/>
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes/>
            </BrowserRouter>
        </AuthProvider>
    );
}