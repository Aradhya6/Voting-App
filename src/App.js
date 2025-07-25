import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import VideoList from "./VideoList";
import UploadVideo from "./UploadVideo";
import AdminPanel from "./AdminPanel";
import "./App.css"; // 👈 make sure this CSS file exists

function App() {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      alert("Login failed");
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <h1>🎥 Voting App</h1>
      {user ? (
        <>
          <p className="welcome-text">Welcome, {user.email}</p>
          <button className="btn logout-btn" onClick={logout}>
            Logout
          </button>

          {user.email === "23u0025@students.git.edu" && (
            <UploadVideo user={user} />
          )}

          <VideoList user={user} />

          {user.email === "23u0025@students.git.edu" && <AdminPanel />}
        </>
      ) : (
        <button className="btn login-btn" onClick={login}>
          Login with Git Email
        </button>
      )}
    </div>
  );
}

export default App;
