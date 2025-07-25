import React, { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function UploadVideo({ user }) {
    const [videoFile, setVideoFile] = useState(null);
    const [title, setTitle] = useState("");
    const [participant, setParticipant] = useState("");
    const [uploading, setUploading] = useState(false);
    const [myVideos, setMyVideos] = useState([]);

    const fetchMyVideos = async () => {
        if (!user?.email) return;
        const q = query(collection(db, "videos"), where("uploader", "==", user.email));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMyVideos(data);
    };

    useEffect(() => {
        fetchMyVideos();
    }, [user]);

    const handleUpload = async () => {
        if (!videoFile || !title || !participant) {
            alert("Please fill all fields and select a video.");
            return;
        }

        try {
            setUploading(true);
            const uniquePath = `videos/${uuidv4()}_${videoFile.name}`;
            const storageRef = ref(storage, uniquePath);
            await uploadBytes(storageRef, videoFile);
            const url = await getDownloadURL(storageRef);

            await addDoc(collection(db, "videos"), {
                title,
                participant,
                uploader: user.email,
                url,
                likes: 0,
                voters: [],
                storagePath: uniquePath,
            });

            alert("Video uploaded successfully!");
            setVideoFile(null);
            setTitle("");
            setParticipant("");
            fetchMyVideos(); // refresh
        } catch (err) {
            alert("Upload failed");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (videoId, storagePath) => {
        const confirm = window.confirm("Are you sure you want to delete this video?");
        if (!confirm) return;

        try {
            const storageRef = ref(storage, storagePath);
            await deleteObject(storageRef); // Delete from storage
            await deleteDoc(doc(db, "videos", videoId)); // Delete from Firestore
            alert("Video deleted");
            fetchMyVideos(); // refresh list
        } catch (err) {
            alert("Failed to delete video");
            console.error(err);
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

            <hr />
            <h3>Your Uploaded Videos</h3>
            {myVideos.map((video) => (
                <div key={video.id} style={{ marginTop: "1rem" }}>
                    <strong>{video.title}</strong> - {video.participant}
                    <br />
                    <video width="300" controls>
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <br />
                    <button onClick={() => handleDelete(video.id, video.storagePath)} style={{ marginTop: "0.5rem" }}>
                        🗑️ Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default UploadVideo;
