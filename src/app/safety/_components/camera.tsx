import React, { useEffect, useRef, useState } from "react";

const CameraStream: React.FC = () => {
    const videoRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const videoStreamBackend = "http://127.0.0.1:5000/video_feed"

    const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: CAMERA_WIDTH, height: CAMERA_HEIGHT } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    // Initialize MediaRecorder for recording
                    const mediaRecorder = new MediaRecorder(stream, {
                        mimeType: "video/webm",
                    });

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            setRecordedChunks((prev) => [...prev, event.data]);
                        }
                    };

                    mediaRecorder.onstop = () => {
                        if (recordedChunks.length) {
                            const blob = new Blob(recordedChunks, {
                                type: "video/webm",
                            });
                            const url = URL.createObjectURL(blob);
                            console.log("Recorded video blob:", blob);
                            setRecordedChunks([]);
                        }
                    };

                    mediaRecorderRef.current = mediaRecorder;
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };

    // Toggle recording
    const toggleRecording = () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            setRecordedChunks([]); // Reset recorded chunks
            mediaRecorderRef.current?.start();
            setIsRecording(true);
        }
    };

    useEffect(() => {
        startCamera()
            .then(() => {
                console.log("Camera started");
            })
            .catch((error) => {
                console.error("Error with camera:", error);
            });
    }, []);

    return (
        <div>
            <h2>Live Camera Stream</h2>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", maxWidth: "640px", height: "auto" }}
            />
            <img src={videoStreamBackend} alt="Mmm Fruits"/>

            <div style={{ marginTop: "10px" }}>
                <button onClick={toggleRecording}>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
            </div>
        </div>
    );
};

export default CameraStream;