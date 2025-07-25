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

function App() {
  const [user, setUser] = useState(null);
  const provider = new GoogleAuthProvider();
  const adminEmail = "23u0025@students.git.edu";

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (!email.endsWith("@students.git.edu")) {
        alert("Log in using  GIT students account.");
        await signOut(auth); // Force sign out if not valid
        return;
      }

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
    <div style={{ textAlign: "center" }}>
      <h1>Voting App</h1>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>

          {/* Only admin can upload and view admin panel */}
          {user.email === adminEmail && (
            <>
              <UploadVideo user={user} />
              <AdminPanel />
            </>
          )}

          {/* All users can view and vote */}
          <VideoList user={user} />
        </>
      ) : (
        <button onClick={login}>Login with Git Email</button>
      )}
    </div>
  );
}

export default App;
