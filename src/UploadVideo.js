import React, { useState } from "react";
import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function UploadVideo({ user }) {
    const [videoFile, setVideoFile] = useState(null);
    const [title, setTitle] = useState("");
    const [participant, setParticipant] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!videoFile || !title || !participant) {
            alert("Please fill all fields and select a video.");
            return;
        }

        try {
            setUploading(true);
            const storageRef = ref(storage, `videos/${uuidv4()}_${videoFile.name}`);
            await uploadBytes(storageRef, videoFile);
            const url = await getDownloadURL(storageRef);

            await addDoc(collection(db, "videos"), {
                title,
                participant,
                uploader: user.email,
                url,
                likes: 0,
                voters: [],
            });

            alert("Video uploaded successfully!");
            setVideoFile(null);
            setTitle("");
            setParticipant("");
        } catch (err) {
            alert("Upload failed");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ margin: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2>Upload Video</h2>
            <input
                type="text"
                placeholder="Video Title (e.g., Team Alpha)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginBottom: "0.5rem", display: "block" }}
            />
            <input
                type="text"
                placeholder="Participant Name"
                value={participant}
                onChange={(e) => setParticipant(e.target.value)}
                style={{ marginBottom: "0.5rem", display: "block" }}
            />
            <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setVideoFile(e.target.files[0])}
                style={{ marginBottom: "0.5rem", display: "block" }}
            />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
}

export default UploadVideo;
