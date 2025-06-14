import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.css";
import { UserContext } from "../context";

function Header() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [search, setSearch] = useState("");

    const isLoggedIn = user && user.email && user.password;

    const handleLogout = () => {
        setUser({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            genres: [],
        });
        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/movies/search?query=${encodeURIComponent(search.trim())}`);
            setSearch("");
        }
    };

    return (
        <div>
            <div className="navBar">
                <h1 className="navTitle" onClick={() => navigate("/")}>WebFlicks</h1>
                <div className="buttonGroup">
                    {!isLoggedIn ? (
                        <>
                            <button className="LoginButton" onClick={() => navigate("/login")}>Login</button>
                            <button className="RegisterButton" onClick={() => navigate("/register")}>Register</button>
                        </>
                    ) : (
                        <>
                            <form className="searchForm" onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="searchBox"
                                    placeholder="Search movies..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button type="submit" className="searchBtn">Search</button>
                            </form>
                            <button className="CartButton" onClick={() => navigate("/cart")}>Cart</button>
                            <button className="SettingsButton" onClick={() => navigate("/settings")}>Settings</button>
                            <button className="LogoutButton" onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
            {isLoggedIn && (
                <div className="welcome-message-box">
                    <span className="welcome-message">Hello {user.firstName}!</span>
                </div>
            )}
        </div>
    );
}

export default Header;