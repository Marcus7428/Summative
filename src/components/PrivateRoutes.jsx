import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context";

function PrivateRoute({ children }) {
    const { user, authLoading } = useContext(UserContext);
    if (authLoading) return null;
    return user && user.uid ? children : <Navigate to="/login" />;
}

export default PrivateRoute;