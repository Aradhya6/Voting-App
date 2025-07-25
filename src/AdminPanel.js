import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

function AdminPanel() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "videos"), (snapshot) => {
            const videoList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            videoList.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            setVideos(videoList);
        });

        return () => unsubscribe(); // Clean up listener
    }, []);



    const downloadCSV = () => {
        const rows = [
            ["Video Title", "Participant", "Likes"],
            ...videos.map((v) => [
                v.title || v.name || "Untitled",
                v.participant || "N/A",
                v.likes || 0,
            ]),
        ];

        const csv = rows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "vote_results.csv";
        a.click();
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Admin Panel: Voting Results</h2>
            <button onClick={downloadCSV} style={{ marginBottom: "1rem" }}>
                📥 Download CSV
            </button>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={styles.th}>Video Title</th>
                        <th style={styles.th}>Participant</th>
                        <th style={styles.th}>Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((video) => (
                        <tr key={video.id}>
                            <td style={styles.td}>{video.title || video.name || "N/A"}</td>
                            <td style={styles.td}>{video.participant || "N/A"}</td>
                            <td style={styles.td}>{video.likes || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    th: {
        border: "1px solid #ccc",
        padding: "8px",
        background: "#f0f0f0",
        textAlign: "left",
    },
    td: {
        border: "1px solid #ccc",
        padding: "8px",
    },
};

export default AdminPanel;
