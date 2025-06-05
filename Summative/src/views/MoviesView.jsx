import { Outlet } from "react-router-dom";
import Genres from "../components/Genres.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "./MoviesView.css";

function MoviesView() {
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