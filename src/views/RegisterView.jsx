import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterView.css";
import Header from "../components/Header";
import { UserContext } from "../context";
import axios from "axios";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../firebase/index.js";

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
    const [errorMessage, setErrorMessage] = useState("");

    const db = firestore;

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

    async function checkEmailExists(email) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    }

    async function handleEmailRegistration(e) {
        e.preventDefault();
        if (!validateForm()) {
            setErrorMessage(
                "Please complete all fields properly:\n- Valid email\n- Password at least 6 characters\n- Matching passwords\n- 5+ genres selected"
            );
            return;
        }

        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
            setErrorMessage("This email is already registered.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            await user.getIdToken(true);

            await setDoc(doc(db, "users", user.uid), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                genres: formData.genres,
                uid: user.uid,
            });

            setUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                genres: formData.genres,
            });

            // Automatically load the first selected genre
            const firstGenreName = formData.genres[0];
            const firstGenreObj = genres.find(g => g.name === firstGenreName);
            if (firstGenreObj) {
                navigate(`/movies/${firstGenreObj.id}`);
            } else {
                navigate(`/movies`);
            }
        } catch (error) {
            if (error.code === "auth/invalid-email") {
                setErrorMessage("Please enter a valid email address.");
            } else if (error.code === "auth/weak-password") {
                setErrorMessage("Password must be at least 6 characters.");
            } else {
                setErrorMessage(error.message);
            }
        }
    }

    async function handleGoogleRegistration() {
        if (formData.genres.length < 5) {
            setErrorMessage("Please select at least 5 genres before registering with Google.");
            return;
        }
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const emailExists = await checkEmailExists(user.email);
            if (emailExists) {
                setErrorMessage("This email is already registered.");
                return;
            }

            await setDoc(doc(db, "users", user.uid), {
                firstName: user.displayName ? user.displayName.split(" ")[0] : "",
                lastName: user.displayName ? user.displayName.split(" ")[1] || "" : "",
                email: user.email,
                genres: formData.genres,
                uid: user.uid,
            });

            setUser({
                firstName: user.displayName ? user.displayName.split(" ")[0] : "",
                lastName: user.displayName ? user.displayName.split(" ")[1] || "" : "",
                email: user.email,
                genres: formData.genres,
            });

            // Automatically load the first selected genre
            const firstGenreName = formData.genres[0];
            const firstGenreObj = genres.find(g => g.name === firstGenreName);
            if (firstGenreObj) {
                navigate(`/movies/${firstGenreObj.id}`);
            } else {
                navigate(`/movies`);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    function validateEmail(email) {
        // Checks for "@" and a "." after "@"
        const atIndex = email.indexOf("@");
        const dotIndex = email.lastIndexOf(".");
        return (
            atIndex > 0 &&
            dotIndex > atIndex + 1 &&
            dotIndex < email.length - 1
        );
    }

    function validateForm() {
        const validFirstName = formData.firstName.trim().length > 0;
        const validLastName = formData.lastName.trim().length > 0;
        const validEmail = validateEmail(formData.email);
        const validPassword = formData.password.length >= 6;
        const passwordsMatch = formData.password === formData.confirmPassword;
        const validGenres = formData.genres.length >= 5;

        return (
            validFirstName &&
            validLastName &&
            validEmail &&
            validPassword &&
            passwordsMatch &&
            validGenres
        );
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
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <form onSubmit={handleEmailRegistration} className="form">
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
                                <span className="error-message">Email must contain "@" and a "." after "@"</span>
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
                            {touched.password && formData.password.length > 0 && formData.password.length < 6 && (
                                <span className="error-message">Password must be at least 6 characters</span>
                            )}
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
                                <span className="error-message select-genres">Please select at least 5 genres</span>
                            )}
                        </div>

                        <button type="submit" className="submit-btn" disabled={!validateForm()}>
                            Register with Email
                        </button>
                    </form>
                    <button
                        className="google-btn"
                        onClick={handleGoogleRegistration}
                        disabled={formData.genres.length < 5}
                    >
                        Register with Google
                    </button>
                    {formData.genres.length < 5 && (
                        <p className="error-message" style={{ marginTop: 18, color: "#fff" }}>
                            Select at least 5 genres before registering with Google.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}