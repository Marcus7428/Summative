import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context";
import Header from "../components/Header";
import "./CartView.css";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase/index.js";

function CartView() {
    const { cart, setCart, user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleRemove = (movie) => {
        setCart(cart.filter((item) => item.id !== movie.id));
    };

    const handleCheckout = async () => {
        if (!user.uid) return;
        try {
            const userDocRef = doc(firestore, "users", user.uid);

            await updateDoc(userDocRef, {
                purchases: arrayUnion(...cart.map((m) => m.id)),
            });

            setUser({
                ...user,
                purchases: [...(user.purchases || []), ...cart.map((m) => m.id)],
            });
            setCart([]);
            localStorage.removeItem("cart");
            alert("Thank you for your purchase!");
        } catch (err) {
            alert("Checkout failed.");
            console.error(err);
        }
    };

    return (
        <>
            <Header />
            <div className="cart-container">
                <div className="cart-header-row">
                    <h2>Your Cart</h2>
                    <button className="go-back-btn" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
                {cart.length === 0 ? (
                    <div className="cart-message">Your cart is empty.</div>
                ) : (
                    <>
                        <div className="genre-movies-grid">
                            {cart.map((movie) => (
                                <div key={movie.id} className="movie-tile">
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
                                    <button className="added-btn" onClick={() => handleRemove(movie)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="save-btn" onClick={handleCheckout} style={{ marginTop: 24, width: 200, fontSize: "1.1rem" }}>
                            Checkout
                        </button>
                    </>
                )}
            </div>
        </>
    );
}

export default CartView;