import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Yaha "./" lagana, path correct

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Signup Successful:", userCredential.user);
        alert("Signup Success");
      })
      .catch((error) => {
        console.error("Signup Error:", error.message);
        alert("Signup Failed: " + error.message);
      });
  };

  return (
    <div>
      <h2>Test Firebase Signup</h2>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default App;
