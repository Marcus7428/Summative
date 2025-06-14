import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Hero.css";
import movieBackground from "../images/movieBackground.jpg";

function Hero() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="heroSection">
                <img src={movieBackground} alt="Movie Background" className="heroImage" />
                <h1 className="heroText">Watch all of the latest and greatest shows!</h1>
            </div>
        </div>
    );
}

export default Hero;