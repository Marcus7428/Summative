import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context";
import axios from "axios";
import "./GenreView.css";

function GenreView() {
    const { genre_id } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const { cart, setCart } = useContext(UserContext);

    useEffect(() => {
        axios
            .get(`https://api.themoviedb.org/3/discover/movie`, {
                params: {
                    api_key: import.meta.env.VITE_TMDB_KEY,
                    with_genres: genre_id,
                    page,
                },
            })
            .then((response) => setMovies(response.data.results))
            .catch((error) => console.error("Error fetching movies:", error));
    }, [genre_id, page]);

    const handleBuy = (movie) => {
        if (!cart.some((item) => item.id === movie.id)) {
            setCart([...cart, movie]);
        }
    };

    const handleRemove = (movie) => {
        setCart(cart.filter((item) => item.id !== movie.id));
    };

    if (!movies.length) return <div>Loading movies...</div>;

    return (
        <div className="genre-movies-grid">
            {movies.map((movie) => {
                const inCart = cart.some((item) => item.id === movie.id);
                return (
                    <div key={movie.id} className="movie-tile">
                        <Link to={`/movies/details/${movie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <img
                                src={
                                    movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                        : "https://via.placeholder.com/300x450?text=No+Image"
                                }
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <div className="movie-title">{movie.title}</div>
                        </Link>
                        {!inCart ? (
                            <button className="buy-btn" onClick={() => handleBuy(movie)}>
                                Buy
                            </button>
                        ) : (
                            <button className="added-btn" onClick={() => handleRemove(movie)}>
                                Added to cart
                            </button>
                        )}
                    </div>
                );
            })}
            <div className="pagination">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
                <span>Page {page}</span>
                <button onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
        </div>
    );
}

export default GenreView;