import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterView.css";
import Header from "../components/Header";
import { UserContext } from "../context";
import axios from "axios";

export default function RegisterView() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        genres: [],
    });
    const [genres, setGenres] = useState([]);
    const [touched, setTouched] = useState({});

    useEffect(() => {
        axios
            .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_KEY}`)
            .then((response) => {
                const allowedGenres = response.data.genres.filter((genre) =>
                    [28, 12, 16, 10751, 14, 36, 27, 9648, 878, 10752, 37, 80].includes(genre.id)
                );
                setGenres(allowedGenres);
            })
            .catch((error) => console.error("Error fetching genres:", error));
    }, []);

    function validateEmail(email) {
        return email.includes("@");
    }

    function validateForm() {
        const validFirstName = formData.firstName.trim().length > 0;
        const validLastName = formData.lastName.trim().length > 0;
        const validEmail = validateEmail(formData.email);
        const passwordsMatch = formData.password === formData.confirmPassword;
        const validGenres = formData.genres.length >= 5;

        return validFirstName && validLastName && validEmail && passwordsMatch && validGenres;
    }

    function handleChange(e) {
        const field = e.target;
        const newValue = field.type === "checkbox" ? field.checked : field.value;

        if (field.type === "checkbox") {
            let newGenres = [...formData.genres];
            if (newValue) {
                newGenres.push(field.value);
            } else {
                newGenres = newGenres.filter((g) => g !== field.value);
            }
            setFormData((prev) => ({ ...prev, genres: newGenres }));
        } else {
            setFormData((prev) => ({ ...prev, [field.name]: newValue }));
        }

        setTouched((prev) => ({ ...prev, [field.name]: true }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) {
            alert(
                "Please complete all fields properly:\n- Valid email\n- Matching passwords\n- 5+ genres selected"
            );
            return;
        }

        setUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            genres: formData.genres,
        });

        // Find the first genre selected by the user
        if (formData.genres.length > 0) {
            const selectedGenreName = formData.genres[0]; // Pick the first genre
            const selectedGenre = genres.find((genre) => genre.name === selectedGenreName);

            if (selectedGenre) {
                console.log(`Navigating to /movies/${selectedGenre.id}`); // Debugging log
                navigate(`/movies/${selectedGenre.id}`); // Navigate to the genre
                return;
            }
        }

        // Fallback: Navigate to /movies if no genre is found
        console.log("Navigating to /movies");
        navigate(`/movies`);
    }

    function renderGenresCheckboxes() {
        if (genres.length === 0) return <span>Loading genres...</span>;
        return genres.map((genre) => (
            <label key={genre.id} className="genre-checkbox">
                <input
                    type="checkbox"
                    name="genres"
                    value={genre.name}
                    checked={formData.genres.includes(genre.name)}
                    onChange={handleChange}
                />
                {genre.name}
            </label>
        ));
    }

    return (
        <>
            <Header />
            <div className="register-container">
                <div className="register-form">
                    <h2 className="register-title">Register</h2>
                    <form onSubmit={handleSubmit} className="form">
                        {["firstName", "lastName"].map((field) => (
                            <div className="form-group" key={field}>
                                <label className="form-label">{field.split(/(?=[A-Z])/).join(" ")}</label>
                                <input
                                    type="text"
                                    name={field}
                                    className="form-input"
                                    value={formData[field]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {touched.email && !validateEmail(formData.email) && (
                                <span className="error-message">Invalid email format</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {touched.confirmPassword && formData.password !== formData.confirmPassword && (
                                <span className="error-message">Passwords do not match</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Your Favorite Genres (at least 5):</label>
                            <div className="genres-checkboxes">{renderGenresCheckboxes()}</div>
                            {touched.genres && formData.genres.length < 5 && (
                                <span className="error-message">Select at least 5 genres</span>
                            )}
                        </div>

                        <button type="submit" className="submit-btn" disabled={!validateForm()}>
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}