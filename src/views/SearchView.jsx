import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import Header from "../components/Header";
import axios from "axios";
import "./SettingView.css";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/index.js";

function SettingView() {
    const { user, setUser } = useContext(UserContext);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [allGenres, setAllGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(user.genres || []);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`https://api.themoviedb.org/3/genre/movie/list`, {
                params: { api_key: import.meta.env.VITE_TMDB_KEY },
            })
            .then((response) => setAllGenres(response.data.genres))
            .catch((error) => console.error("Error fetching genres:", error));
    }, []);

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
            alert("Settings saved!");
            navigate("/movies");
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
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
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
                    <button type="submit" className="save-btn">Save Changes</button>
                </form>
            </div>
        </>
    );
}

export default SettingView;