import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import InputComponent from "../Components/inputComponents.jsx";
import ButtonComponents from "../Components/buttonComponents.jsx";
import { FaGoogle, FaGithub } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Signup Successful:", user);
      alert("Signup Success! Now complete your profile.");
      navigate("/complete-profile");
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert("Signup Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Sign-In Successful:", user);
      alert("Signed in with Google! Now complete your profile.");
      navigate("/complete-profile");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert("Google Sign-In Failed: " + error.message);
    }
  };

  const handleGitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("GitHub Sign-In Successful:", user);
      alert("Signed in with GitHub! Now complete your profile.");
      navigate("/complete-profile");
    } catch (error) {
      console.error("GitHub Sign-In Error:", error.message);
      alert("GitHub Sign-In Failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0FDF4]">
      {/* ✅ Header */}
      <div className="py-6">
        <h1 className="text-center text-4xl font-bold text-[#0E7C54]">
          CampusSync
        </h1>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-teal-200">
          <h2 className="text-center text-2xl font-extrabold text-teal-600">
            Sign Up
          </h2>

          <div className="flex flex-col space-y-4">
            <InputComponent
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputComponent
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ButtonComponents
              value={isLoading ? "Processing..." : "Sign Up"}
              onClick={handleSignup}
              disabled={isLoading}
            />
          </div>

          {/* Social Sign In Buttons */}
          <div className="pt-4">
            <p className="text-center text-sm text-gray-500 mb-3">
              or sign up via
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleGoogleSignIn}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                <FaGoogle size={20} />
              </button>

              <button
                onClick={handleGitHubSignIn}
                className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition"
              >
                <FaGithub size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
