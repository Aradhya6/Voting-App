import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
    increment,
} from "firebase/firestore";

const adminEmails = ["your.email@students.git.edu"]; // Replace with yours

function VideoList({ user }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const querySnapshot = await getDocs(collection(db, "videos"));
            const videoList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setVideos(videoList);
        };
        fetchVideos();
    }, []);

    const handleLike = async (videoId) => {
        if (!user || !user.email) {
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

        const updatedSnapshot = await getDocs(collection(db, "videos"));
        const videoList = updatedSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setVideos(videoList);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
            <h2>Uploaded Videos</h2>
            {videos.map((video) => {
                const hasVoted = video.voters?.includes(user?.email);

                return (
                    <div key={video.id} style={{ marginBottom: "30px" }}>
                        <h4>{video.name}</h4>
                        <video width="300" controls>
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <br />

                        <button onClick={() => handleLike(video.id)}>
                            {video.voters?.includes(user.email) ? "✅ Voted" : "❤️ Vote"}
                        </button>


                        {adminEmails.includes(user?.email) && (
                            <p>Likes: {video.likes || 0}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default VideoList;
