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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const provider = new GoogleAuthProvider();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (!email.endsWith("@students.git.edu")) {
        alert("Access denied. Please use your @students.git.edu email.");
        await signOut(auth);
        return;
      }

      setUser(result.user);
    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email?.endsWith("@students.git.edu")) {
        setUser(currentUser);
      } else {
        if (currentUser) {
          alert("Access denied. Only @students.git.edu emails allowed.");
          await signOut(auth);
        }
        setUser(null);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) return <p>Loading...</p>;

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
          Login with GIT Email
        </button>
      )}
    </div>
  );
}

export default App;
