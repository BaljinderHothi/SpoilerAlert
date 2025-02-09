import React, { useEffect, useRef, useState } from "react";

const CameraStream: React.FC = () => {
    const videoRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [mostFreqPrediction, setMostFreqPrediction] = useState("");
    const [isVideoStreamActive, setIsVideoStreamActive] = useState(false);

    const videoStreamBackend = "http://127.0.0.1:5000/video_feed";

    const fetchMostFrequentPrediction = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/most_frequent_prediction");
            const data = await response.json();
            setMostFreqPrediction(data.most_frequent_prediction);
        } catch (error) {
            console.error("Error fetching most frequent prediction:", error);
        }
    };

    useEffect(() => {
        let interval;
        if (isVideoStreamActive) {
            interval = setInterval(fetchMostFrequentPrediction, 1000);
        }
        return () => clearInterval(interval);
    }, [isVideoStreamActive]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;

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

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            setIsVideoStreamActive(false);

            await fetch("http://127.0.0.1:5000/stop_camera");
        } else {
            setRecordedChunks([]);
            mediaRecorderRef.current?.start();
            setIsRecording(true);
            setIsVideoStreamActive(true);

            await fetch("http://127.0.0.1:5000/start_camera");
        }
    };

    return (
        <div className="relative w-[640px] h-[480px] bg-black rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", maxWidth: "200px", height: "50px" }}
            />
            {isVideoStreamActive && (
                <img src={videoStreamBackend} alt="Mmm Fruits" className="absolute pb-10" />
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button
                    onClick={toggleRecording}
                    className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md shadow hover:bg-green-600 transition"
                >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
            </div>

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white">
                SpoilerAlert's Prediction: {mostFreqPrediction}
            </div>
        </div>
    );
};

export default CameraStream;