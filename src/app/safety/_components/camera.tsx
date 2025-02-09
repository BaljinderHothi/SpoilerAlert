import React, { useEffect, useRef, useState } from "react";

const CameraStream: React.FC = () => {
    // const videoRef = useRef(null);
    // const [isRecording, setIsRecording] = useState(false);
    // const [recordedChunks, setRecordedChunks] = useState([]);
    // const [mostFreqPrediction, setMostFreqPrediction] = useState("");
    // const [isVideoStreamActive, setIsVideoStreamActive] = useState(false);
    // const [countdown, setCountdown] = useState(0);
    // const videoStreamBackend = "http://127.0.0.1:5000/video_feed";

    // const fetchMostFrequentPrediction = async () => {
    //     try {
    //         const response = await fetch("http://127.0.0.1:5000/most_frequent_prediction");
    //         const data = await response.json();
    //         setMostFreqPrediction(data.most_frequent_prediction);
    //     } catch (error) {
    //         console.error("Error fetching most frequent prediction:", error);
    //     }
    // };

    // const toggleRecording = async () => {
    //     if (isRecording) {
    //         setIsRecording(false);
    //         setIsVideoStreamActive(false);
    //         setCountdown(0);
    //         await fetch("http://127.0.0.1:5000/stop_camera");
    //     } else {
    //         setRecordedChunks([]);
    //         setIsRecording(true);
    //         setIsVideoStreamActive(true);
    //         setCountdown(60);
    //         await fetch("http://127.0.0.1:5000/start_camera");
    //     }
    // };

    return (
        <div className="relative w-[640px] h-[480px] bg-black rounded-lg overflow-hidden">
            {/* <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", maxWidth: "200px", height: "50px" }}
            /> */}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button
                    // onClick={toggleRecording}
                    className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md shadow hover:bg-green-600 transition"
                >
                    {/* {isRecording ? "Stop Recording" : "Start Recording"} */}
                    Start Recording
                </button>
            </div>

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white">
                {/* SpoilerAlert's Prediction: {mostFreqPrediction} */}
                No Prediction Available
            </div>
        </div>
    );
};

export default CameraStream;
