import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import Header from "../components/Header";
import axios from "axios";
import "./SettingView.css";
import { doc, updateDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase/index.js";
import { EmailAuthProvider, updateProfile, updatePassword } from "firebase/auth";

const ALLOWED_GENRE_IDS = [28, 12, 16, 80, 10751, 14, 36, 27, 9648, 878, 10752, 37];

function SettingView() {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [allGenres, setAllGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(user.genres || []);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [purchasedMovies, setPurchasedMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`https://api.themoviedb.org/3/genre/movie/list`, {
                params: { api_key: import.meta.env.VITE_TMDB_KEY },
            })
            .then((response) => {
                setAllGenres(
                    response.data.genres.filter((genre) =>
                        ALLOWED_GENRE_IDS.includes(genre.id)
                    )
                );
            })
            .catch((error) => console.error("Error fetching genres:", error));
    }, []);

    useEffect(() => {
        async function fetchPurchasedMovies() {
            if (user.purchases && user.purchases.length > 0) {
                const results = await Promise.all(
                    user.purchases.map(async (id) => {
                        try {
                            const res = await fetch(
                                `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
                            );
                            if (!res.ok) return null;
                            return await res.json();
                        } catch {
                            return null;
                        }
                    })
                );
                setPurchasedMovies(results.filter(Boolean));
            } else {
                setPurchasedMovies([]);
            }
        }
        fetchPurchasedMovies();
    }, [user.purchases]);

    const canEdit = auth.currentUser &&
        auth.currentUser.providerData.some(
            (p) => p.providerId === EmailAuthProvider.PROVIDER_ID
        );

    const handleGenreChange = (genreName) => {
        setSelectedGenres((prev) =>
            prev.includes(genreName)
                ? prev.filter((g) => g !== genreName)
                : [...prev, genreName]
        );
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const userDocRef = doc(firestore, "users", user.uid);
            await updateDoc(userDocRef, {
                firstName,
                lastName,
                genres: selectedGenres,
            });
            setUser({
                ...user,
                firstName,
                lastName,
                genres: selectedGenres,
            });
            if (canEdit) {
                await updateProfile(auth.currentUser, {
                    displayName: `${firstName} ${lastName}`,
                });
                if (newPassword) {
                    await updatePassword(auth.currentUser, newPassword);
                }
            }
            alert("Settings saved!");
            const firstGenreName = selectedGenres[0];
            const firstGenreObj = allGenres.find(g => g.name === firstGenreName);
            if (firstGenreObj) {
                navigate(`/movies/${firstGenreObj.id}`);
            } else {
                navigate("/movies");
            }
        } catch (err) {
            alert("Failed to save settings.");
            console.error(err);
        }
    };

    return (
        <>
            <Header />
            <div className="settings-container">
                <h2>Account Settings</h2>
                <form className="settings-form" onSubmit={handleSave}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            disabled={!canEdit}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            disabled={!canEdit}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={user.email}
                            disabled
                        />
                    </label>
                    {canEdit && (
                        <label>
                            New Password:
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="show-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </label>
                    )}
                    <label>
                        Select Your Favorite Genres:
                        <div className="genres-checkboxes">
                            {allGenres.map((genre) => (
                                <label key={genre.id} className="genre-checkbox">
                                    <input
                                        type="checkbox"
                                        value={genre.name}
                                        checked={selectedGenres.includes(genre.name)}
                                        onChange={() => handleGenreChange(genre.name)}
                                    />
                                    {genre.name}
                                </label>
                            ))}
                        </div>
                    </label>
                    <button type="submit" className="save-btn" disabled={!canEdit && newPassword}>
                        Save Changes
                    </button>
                </form>
                <div style={{ marginTop: 24 }}>
                    <h3 style={{ color: "#fff" }}>Past Purchases</h3>
                    {purchasedMovies.length ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                            {purchasedMovies.map((movie) => (
                                <div key={movie.id} style={{ textAlign: "center" }}>
                                    <img
                                        src={
                                            movie.poster_path
                                                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                                : "https://via.placeholder.com/200x300?text=No+Image"
                                        }
                                        alt={movie.title}
                                        style={{ width: 120, borderRadius: 8, marginBottom: 8 }}
                                    />
                                    <div style={{ color: "#fff", fontSize: 14 }}>{movie.title}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: "#fff" }}>No past purchases.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default SettingView;