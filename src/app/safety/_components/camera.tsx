import React, { useEffect, useRef, useState } from "react";

const CameraStream: React.FC = () => {
    const videoRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [mostFreqPrediction, setMostFreqPrediction] = useState("");
    const [isVideoStreamActive, setIsVideoStreamActive] = useState(false);
    const [countdown, setCountdown] = useState(0);
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
        let interval: NodeJS.Timeout;
        if (isVideoStreamActive) {
            interval = setInterval(fetchMostFrequentPrediction, 1000);
        }
        return () => clearInterval(interval);
    }, [isVideoStreamActive]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && isRecording) {
            toggleRecording();
        }
    }, [countdown, isRecording]);

    const toggleRecording = async () => {
        if (isRecording) {
            setIsRecording(false);
            setIsVideoStreamActive(false);
            setCountdown(0);
            await fetch("http://127.0.0.1:5000/stop_camera");
        } else {
            setRecordedChunks([]);
            setIsRecording(true);
            setIsVideoStreamActive(true);
            setCountdown(6);
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