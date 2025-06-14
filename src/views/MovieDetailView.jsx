import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MovieDetailView.css";

function MovieDetailView() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);

    useEffect(() => {
        async function fetchMovieDetails() {
            try {
                const movieResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );
                setMovie(movieResponse.data);

                const trailerResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );
                const trailerData = trailerResponse.data.results.find(
                    (video) => video.type === "Trailer" && video.site === "YouTube"
                );
                setTrailer(trailerData ? `https://www.youtube.com/embed/${trailerData.key}` : null);
            } catch (error) {
                console.error("Error fetching movie details or trailer:", error);
            }
        }
        fetchMovieDetails();
    }, [id]);

    if (!movie) {
        return <p>Loading movie details...</p>;
    }

    return (
        <div className="movie-detail-container">
            <h1 className="movie-title">{movie.title}</h1>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
            />
            <p className="movie-overview">{movie.overview}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> {movie.vote_average}/10</p>
            <p><strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(", ")}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
            <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
            {trailer && (
                <div className="movie-trailer">
                    <h2>Trailer</h2>
                    <iframe
                        width="100%"
                        height="400"
                        src={trailer}
                        title="Movie Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
}

export default MovieDetailView;