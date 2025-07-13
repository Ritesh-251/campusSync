import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null); // New: where to redirect if not allowed

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User logged out — send to login page
        toast.error("Please log in first.");
        setIsAllowed(false);
        setRedirectPath("/"); // Redirect to login on logout
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData?.isProfileComplete) {
          setIsAllowed(true);
          setRedirectPath(null);
        } else {
          toast.error("Please complete your profile.");
          setIsAllowed(false);
          setRedirectPath("/complete-profile"); // Redirect here if profile incomplete
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Error checking user profile.");
        setIsAllowed(false);
        setRedirectPath("/"); // fallback redirect to login
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  // If allowed, render children, else redirect to proper page
  if (isAllowed) return children;
  return <Navigate to={redirectPath || "/login"} replace />;
};

export default ProtectedRoute;
