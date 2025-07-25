import React from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

function Login({ setUser }) {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const email = result.user.email;

            if (!email.endsWith("@students.git.edu")) {
                alert("Only @students.git.edu emails are allowed.");
                return;
            }

            setUser({
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
            });
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
                Login with GIT Email
            </button>
        </div>
    );
}

export default Login;
