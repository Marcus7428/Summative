import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Genres from "../components/Genres.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import axios from "axios";
import "./MoviesView.css";

const ALLOWED_GENRE_IDS = [28, 12, 16, 80, 10751, 14, 36, 27, 9648, 878, 10752, 37];

function MoviesView() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [allowedGenres, setAllowedGenres] = useState([]);

    useEffect(() => {
        axiosf
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

    useEffect(() => {
        if (
            location.pathname === "/movies" &&
            user &&
            user.genres &&
            user.genres.length > 0 &&
            allowedGenres.length > 0
        ) {
            const firstAllowedGenre = allowedGenres.find(g => user.genres.includes(g.name));
            if (firstAllowedGenre) {
                navigate(`/movies/${firstAllowedGenre.id}`, { replace: true });
            }
        }
    }, [location.pathname, user, allowedGenres, navigate]);

    return (
        <>
            <Header />
            <div className="movies-view-container">
                <aside className="genres-sidebar">
                    <h1 className="genres-title">Genres</h1>
                    <Genres />
                </aside>
                <main className="movies-main-content">
                    <Outlet /> 
                </main>
            </div>
            <Footer />
        </>
    );
}

export default MoviesView;