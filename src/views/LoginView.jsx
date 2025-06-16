import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginView.css";
import Header from "../components/Header";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/index.js";
import { UserContext } from "../context";
import axios from "axios";

const ALLOWED_GENRE_IDS = [28, 12, 16, 80, 10751, 14, 36, 27, 9648, 878, 10752, 37];

function LoginView() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [pendingRedirect, setPendingRedirect] = useState(false);
    const [allowedGenres, setAllowedGenres] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        axios
            .get(`https://api.themoviedb.org/3/genre/movie/list`, {
                params: { api_key: import.meta.env.VITE_TMDB_KEY },
            })
            .then((response) => {
                setAllowedGenres(
                    response.data.genres.filter((genre) =>
                        ALLOWED_GENRE_IDS.includes(genre.id)
                    )
                );
            })
            .catch((error) => console.error("Error fetching genres:", error));
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setPendingRedirect(true);
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            setPendingRedirect(true);
        } catch (err) {
            setError("Google sign-in failed.");
        }
    };

    useEffect(() => {
        if (
            pendingRedirect &&
            user &&
            user.uid
        ) {
            if (user.genres && user.genres.length > 0 && allowedGenres.length > 0) {
                // Find the first allowed genre the user selected
                const firstAllowedGenre = allowedGenres.find(g => user.genres.includes(g.name));
                if (firstAllowedGenre) {
                    navigate(`/movies/${firstAllowedGenre.id}`);
                } else {
                    navigate("/movies");
                }
            } else {
                // No genres selected, force user to settings
                navigate("/settings");
            }
        }
    }, [pendingRedirect, user, allowedGenres, navigate]);

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
                    <button type="submit" className="login-btn">Login</button>
                    <button
                        type="button"
                        className="google-btn"
                        onClick={handleGoogleLogin}
                    >
                        Sign in with Google
                    </button>
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