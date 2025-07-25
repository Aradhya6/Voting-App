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
import "./App.css";

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
    <div className="app-container">
      <h1 className="app-title">🎥 Voting App</h1>
      {user ? (
        <>
          <div className="user-info">
            <p className="welcome-text">Welcome, {user.email}</p>
            <button className="btn logout" onClick={logout}>
              Logout
            </button>
          </div>

          {user.email === "23u0025@students.git.edu" && (
            <UploadVideo user={user} />
          )}

          <VideoList user={user} />

          {user.email === "23u0025@students.git.edu" && <AdminPanel />}
        </>
      ) : (
        <button className="btn login" onClick={login}>
          Login with Git Email
        </button>
      )}
    </div>
  );
}

export default App;
