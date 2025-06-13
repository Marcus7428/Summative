import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeView from "./views/HomeView";
import MoviesView from "./views/MoviesView";
import MovieDetailView from "./views/MovieDetailView";
import GenreView from "./views/GenreView";
import SearchView from "./views/SearchView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import ErrorView from "./views/ErrorView";
import CartView from "./views/CartView";
import SettingView from "./views/SettingView";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/movies" element={<MoviesView />}>
                    <Route path="details/:id" element={<MovieDetailView />} />
                    <Route path=":genre_id" element={<GenreView />} />
                    <Route path="search" element={<SearchView />} />
                </Route>
                <Route path="/cart" element={<CartView />} />
                <Route path="/settings" element={<SettingView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/register" element={<RegisterView />} />
                <Route path="*" element={<ErrorView />} />
            </Routes>
        </Router>
    );
}

export default App;