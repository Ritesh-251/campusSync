import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import InputComponent from "../Components/inputComponents.jsx";
import ButtonComponents from "../Components/buttonComponents.jsx";

const CompleteProfile = () => {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfileSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("User not authenticated");
        setIsLoading(false);
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        name,
        course,
        role,
        email: user.email,
      });

      alert("Profile Completed Successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side Mascot */}
      <div className="bg-teal-500 flex items-center justify-center p-8">
        <div className="text-center">
          <img
            src="/mascot.png"
            alt="Mascot"
            className="max-w-xs mx-auto rounded-2xl"
          />
          <h1 className="text-white text-3xl font-bold mt-6">
            Welcome to CampusSync!
          </h1>
          <p className="text-teal-100 mt-2">
            Just a few more steps to complete your profile.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex items-center justify-center p-10 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Complete Your Profile 👋
          </h2>

          <InputComponent
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-600 focus:ring-teal-500 focus:border-teal-500"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="">Select your course</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-600 focus:ring-teal-500 focus:border-teal-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select your role</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Organizer">Organizer</option>
          </select>

          <ButtonComponents
            value={isLoading ? "Saving..." : "Save & Continue"}
            onClick={handleProfileSubmit}
            disabled={isLoading}
            className="bg-[#038C73] text-white hover:bg-[#0c6042] transition"
          />
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
