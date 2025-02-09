import React, { useEffect, useRef, useState } from "react";

const CAMERA_WIDTH = 640;
const CAMERA_HEIGHT = 480;
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

    const toggleRecording = () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            setRecordedChunks([]);
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
        <div className="relative w-[640px] h-[480px] bg-black rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{width: "100%", maxWidth: "200", height: "200px"}}
            />
            <img src={videoStreamBackend} alt="Mmm Fruits"/>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button onClick={toggleRecording}
                className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md shadow hover:bg-green-600 transition">
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
            </div>
        </div>
    );
};

export default CameraStream;