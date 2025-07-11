import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import InputComponent from "../Components/inputComponents.jsx";
import ButtonComponents from "../Components/buttonComponents.jsx";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Successful:", userCredential.user);
      alert("Login Success!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Login Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google Login Successful:", result.user);
      alert("Logged in with Google!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Login Error:", error.message);
      alert("Google Login Failed: " + error.message);
    }
  };

  const handleGitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("GitHub Login Successful:", result.user);
      alert("Logged in with GitHub!");
      navigate("/dashboard");
    } catch (error) {
      console.error("GitHub Login Error:", error.message);
      alert("GitHub Login Failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0FDF4]">
      <div className="py-6">
        <h1 className="text-center text-4xl font-bold text-[#0E7C54]">
          CampusSync
        </h1>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-teal-200">
          <h2 className="text-center text-2xl font-extrabold text-teal-600">
            Login
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
              value={isLoading ? "Logging in..." : "Login"}
              onClick={handleLogin}
              disabled={isLoading}
            />
          </div>

          <div className="pt-4">
            <p className="text-center text-sm text-gray-500 mb-3">
              or sign in via
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

          <p className="text-center text-gray-600 text-sm pt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-600 font-semibold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
