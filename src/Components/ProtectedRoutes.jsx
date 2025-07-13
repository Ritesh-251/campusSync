// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("Please log in first.");
        setIsAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData?.isProfileComplete) {
          setIsAllowed(true);
        } else {
          toast.error("Please complete your profile.");
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Error checking user profile.");
        setIsAllowed(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return isAllowed ? children : <Navigate to="/complete-profile" />;
};

export default ProtectedRoute;
