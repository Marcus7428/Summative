import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Feature.css";

function Feature() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function fetchMovies() {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );
                const shuffled = response.data.results.sort(() => 0.5 - Math.random());
                setMovies(shuffled.slice(0, 3));
        }
        fetchMovies();
    }, []);

    return (
        <div className="featureSection">
            <h1 className="featureTitle">Now playing:</h1>
            <div className="movieGrid">
                {movies.map((movie) => (
                    <div key={movie.id} className="movieCard">
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="moviePoster"/>
                        <h3 className="movieTitle">{movie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feature;