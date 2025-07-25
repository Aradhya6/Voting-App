import React, { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
    increment,
    deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

function VideoList({ user }) {
    const [videos, setVideos] = useState([]);
    const [showOptions, setShowOptions] = useState({});

    const fetchVideos = async () => {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const videoList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setVideos(videoList);
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleLike = async (videoId) => {
        if (!user?.email) {
            alert("Please log in to vote.");
            return;
        }

        const allVideos = await getDocs(collection(db, "videos"));
        let previousVotedId = null;

        for (const docSnap of allVideos.docs) {
            const data = docSnap.data();
            if (data.voters?.includes(user.email)) {
                previousVotedId = docSnap.id;
                break;
            }
        }

        if (previousVotedId === videoId) {
            alert("You have already voted for this video.");
            return;
        }

        if (previousVotedId) {
            const prevRef = doc(db, "videos", previousVotedId);
            await updateDoc(prevRef, {
                likes: increment(-1),
                voters: arrayRemove(user.email),
            });
        }

        const videoRef = doc(db, "videos", videoId);
        await updateDoc(videoRef, {
            likes: increment(1),
            voters: arrayUnion(user.email),
        });

        fetchVideos();
    };

    const handleDelete = async (video) => {
        const confirm = window.confirm("Are you sure you want to delete this video?");
        if (!confirm) return;

        try {
            // Delete video from storage
            const storageRef = ref(storage, video.storagePath); // requires storagePath
            await deleteObject(storageRef);

            // Delete from Firestore
            await deleteDoc(doc(db, "videos", video.id));

            fetchVideos();
        } catch (err) {
            console.error("Error deleting video:", err);
            alert("Failed to delete video.");
        }
    };

    const toggleOptions = (id) => {
        setShowOptions((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
            <h2>Uploaded Videos</h2>
            {videos.map((video) => {
                const hasVoted = video.voters?.includes(user?.email);
                const isUploader = user?.email === video.uploader;

                return (
                    <div key={video.id} style={{ marginBottom: "30px", position: "relative" }}>
                        <h4>{video.title || "Untitled Video"}</h4>
                        <video width="300" controls>
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <br />

                        <button onClick={() => handleLike(video.id)}>
                            {hasVoted ? "✅ Voted" : "❤️ Vote"}
                        </button>

                        {isUploader && (
                            <>
                                <button onClick={() => toggleOptions(video.id)} style={{ marginLeft: "10px" }}>
                                    ⋮
                                </button>
                                {showOptions[video.id] && (
                                    <div style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "10px",
                                        backgroundColor: "#eee",
                                        borderRadius: "5px",
                                        padding: "5px",
                                        zIndex: 10
                                    }}>
                                        <button onClick={() => handleDelete(video)} style={{ color: "red" }}>
                                            🗑️ Delete Video
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        <p>Likes: {video.likes || 0}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default VideoList;
