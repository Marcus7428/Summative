import { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebase/index.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    genres: [],
  });

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || firebaseUser.email,
            genres: data.genres || [],
          });
        } else {
          // Fallback if no Firestore doc
          setUser({
            firstName: "",
            lastName: "",
            email: firebaseUser.email,
            genres: [],
          });
        }
      } else {
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          genres: [],
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, cart, setCart }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
export { UserContext };