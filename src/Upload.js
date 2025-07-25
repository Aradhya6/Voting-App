// src/Upload.js
import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

function Upload() {
    const [videoFile, setVideoFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [videoURL, setVideoURL] = useState("");

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!videoFile) return alert("Please choose a video first!");

        const fileRef = ref(storage, `videos/${videoFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, videoFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(percent);
            },
            (error) => {
                console.error("Upload error:", error);
                alert("Upload failed!");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setVideoURL(url);
                    alert("Upload successful!");
                });
            }
        );
    };

    return (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
            <h2>Upload Video</h2>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <br /><br />
            <button onClick={handleUpload}>Upload</button>
            <br /><br />
            <progress value={progress} max="100" />
            {videoURL && (
                <div>
                    <p>Uploaded Video URL:</p>
                    <a href={videoURL} target="_blank" rel="noopener noreferrer">{videoURL}</a>
                </div>
            )}
        </div>
    );
}

export default Upload;
