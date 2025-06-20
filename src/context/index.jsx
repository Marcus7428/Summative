import { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebase/index.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    uid: "",
    firstName: "",
    lastName: "",
    email: "",
    genres: [],
    purchases: [],
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(firestore, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || firebaseUser.email,
              genres: Array.isArray(data.genres) ? data.genres : [],
              purchases: Array.isArray(data.purchases) ? data.purchases : [],
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              firstName: "",
              lastName: "",
              email: firebaseUser.email,
              genres: [],
              purchases: [],
            });
          }
        } catch (err) {
          setUser({
            uid: firebaseUser.uid,
            firstName: "",
            lastName: "",
            email: firebaseUser.email,
            genres: [],
            purchases: [],
          });
        }
      } else {
        setUser({
          uid: "",
          firstName: "",
          lastName: "",
          email: "",
          genres: [],
          purchases: [],
        });
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, authLoading, cart, setCart }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
export { UserContext };