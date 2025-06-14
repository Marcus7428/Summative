import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginView.css";
import Header from "../components/Header";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/index.js";

function LoginView() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/movies");
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    return (
        <>
            <Header />
            <div className="loginContainer">
                <form className="loginForm" onSubmit={handleLogin}>
                    <h1>Login</h1>
                    {error && <p className="error-message">{error}</p>}
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <p>
                        Don't have an account?{" "}
                        <span onClick={() => navigate("/register")}>Register here</span>
                    </p>
                </form>
            </div>
        </>
    );
}

export default LoginView;